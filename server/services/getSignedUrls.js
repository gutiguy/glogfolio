const requireLogin = require("../middlewares/requireLogin");
const s3 = require("../services/awsUtilities").s3;

module.exports = app => {
  app.get("/api/upload", requireLogin, (req, res) => {
    const key = req.query.folder + "/" + req.query.key;
    console.log(key);
    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "blogfolio-dev",
        ContentType: "image/jpeg",
        Key: key
      },
      (err, url) => {
        if (!err) {
          res.status(200).send({ url, key });
        } else {
          res.status(400).send({ error: err });
        }
      }
    );
  });
};
