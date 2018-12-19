const uuid = require("uuid/v1");
const awsUtilities = require("../services/awsUtilities");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const { raw } = require("objection");
// Include data models:
const { Carousel } = require("./carouselModels");

let upload = multer({
  dest: "tmp/uploads/",
  onError: function(err, next) {
    console.log("error", err);
    next(err);
  }
});

const {
  generateRawPushOrder,
  normalizeTable
} = require("../services/reorder.js");

module.exports = app => {
  app.get("/api/carousels", async (req, res) => {
    let nodes;
    try {
      nodes = await Carousel.query().orderBy("order");
      res.status(200).send(nodes);
    } catch (error) {
      res.status(400).send({ error: error });
    }
  });

  app.post("/api/carousels/add", upload.single("image"), async (req, res) => {
    const { title, url, description, x, y, width, height } = req.body;
    const image = req.file;
    sharp.cache(false);
    const croppedImage = await sharp(image.path)
      .extract({
        left: parseInt(x, 10),
        top: parseInt(y, 10),
        width: parseInt(width, 10),
        height: parseInt(height, 10)
      })
      .jpeg({ quality: 100, chromaSubsampling: "4:4:4" })
      .toBuffer();

    const imageKey = `${uuid()}s${parseInt(width, 10)}x${parseInt(
      height,
      10
    )}.jpeg`;
    await awsUtilities.addFile(
      croppedImage,
      "carousel/" + imageKey,
      "image/jpeg",
      async function(err) {
        if (!err) {
          const newNode = await Carousel.query().insert({
            title,
            description,
            url,
            image_key: imageKey,
            order: generateRawPushOrder("carousel", "order", undefined, 10000)
          });
          res.status(200).send(newNode);
        } else {
          console.log(err);
          res
            .status(400)
            .send({ error: "There was an error uploading the image!" });
        }
      }
    );
    delete croppedImage;
    console.log("image:", image);
    fs.unlink(image.path, err => {
      console.log(err);
    });
  });

  app.post("/api/carousels/delete", async (req, res) => {
    const { selectedNodes } = req.body;
    let ids = [];
    let Objects = [];
    Object.keys(selectedNodes).forEach(image => {
      ids.push(image);
      Objects.push({ Key: "carousel/" + selectedNodes[image] });
    });
    const deleteRequest = await Carousel.query()
      .delete()
      .whereIn("id", ids);
    awsUtilities.deleteFiles(Objects);
    if (deleteRequest) {
      res.status(200).send({ message: "Carousels deleted" });
    } else {
      res.status(400).send();
    }
  });

  app.post("/api/carousels/edit", async (req, res) => {
    const { id, title, url, description } = req.body;
    const newNode = await Carousel.query().patchAndFetchById(id, {
      title,
      description,
      url
    });
    if (newNode) {
      res.status(200).send(newNode);
    } else {
      res.status(400).send();
    }
  });

  // TODO: refactor reorder functionality (this is a big boilerplate off of listRoutes.js)
  app.post("/api/carousels/reorder", async (req, res) => {
    const { putAfter, currentId } = req.body;
    let reorderedCarousel;

    // If putAfter wasn't specified simply unshift currentId :
    if (typeof putAfter === "undefined" && typeof currentId === "number") {
      reorderedCarousel = await Carousel.query()
        .patch({
          order: raw('COALESCE((SELECT min("order")-1000 FROM "carousel"),0)')
        })
        .where("id", currentId);
    } else {
      reorderedCarousel = await Carousel.query()
        .patch({
          order: raw(
            'COALESCE((SELECT ("order"+(SELECT min("order") FROM "carousel" WHERE "order">(SELECT "order" FROM "carousel" WHERE "id"=?)))/2 FROM "carousel" WHERE "id"=?), (SELECT max("order")+1000 FROM "carousel") ,0)',
            [putAfter, putAfter]
          )
        })
        .where("id", currentId)
        .catch(async err => {
          console.log(
            (reorderedCarousel = Carousel.query()
              .patch({
                order: raw(
                  'COALESCE((SELECT ("order"+(SELECT min("order") FROM "carousel" WHERE "order">(SELECT "order" FROM "carousel" WHERE "id"=?))/2 FROM "carousel" WHERE "id"=?)), (SELECT max("order")+1000 FROM "carousel") ,0)',
                  [putAfter, putAfter]
                )
              })
              .where("id", currentId)
              .toString())
          );
          console.log(err);
          // If there was an issue entering, assume the orders need renormalization (to make room between them), so do that and try again
          await normalizeTable("carousel", "order", [], 100000);

          // Now try again
          await reorderedCarousel.catch(err =>
            res.status(400).send({
              message: "There was a problem with the reorder.",
              error: err
            })
          );
        });
    }
    if (typeof reorderedCarousel !== "undefined") {
      res.status(200).send({ message: "Reordered succesfully! " });
    }
  });
};
