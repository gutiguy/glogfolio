// Include data models:
const { List, ListType } = require("./listModels");
const requireLogin = require("../middlewares/requireLogin");
const { raw } = require("objection");
const {
  normalizeTable,
  generateRawPushOrder
} = require("../services/reorder.js");

module.exports = app => {
  app.get("/api/lists/all", async (_, res) => {
    const list = await ListType.query()
      .select()
      .eager("lists")
      .modifyEager("lists", builder => {
        builder.orderBy("order");
      });
    res.status(200).send(list);
  });

  // Send back lists by type
  app.get("/api/lists/:list_type_id(\\d+)", async (req, res) => {
    const list_type_id = req.params.list_type_id;

    const list = await List.query()
      .select()
      .where("list_type_id", list_type_id)
      .orderBy("order", "asc");
    res.status(200).send(list);
  });

  // Add list
  app.post("/api/lists/add", async (req, res) => {
    const { name, link, list_type_id } = req.body;
    const newList = await List.query()
      .insert({
        name: name,
        link: link,
        list_type_id: list_type_id,
        order: generateRawPushOrder(
          "list",
          "order",
          { column: "list_type_id", value: list_type_id },
          10000
        )
      })
      .catch(err => {
        res.status(400).send({ message: "There was a problem adding this." });
      });
    if (typeof newList !== "undefined") {
      res.status(200).send({ id: newList.id, message: "Added successfuly! " });
    }
  });

  app.post("/api/lists/reorder", async (req, res) => {
    const { putAfter, currentId, listType } = req.body;
    let reorderedList;

    // If putAfter wasn't specified simply unshift currentId :
    if (typeof putAfter === "undefined" && typeof currentId === "number") {
      reorderedList = await List.query()
        .patch({
          order: raw('COALESCE((SELECT min("order")-1000 FROM "list"),0)')
        })
        .where("id", currentId);
    } else {
      reorderedList = List.query()
        .patch({
          order: raw(
            'COALESCE((SELECT ("order"+(SELECT min("order") FROM "list" WHERE "order">(SELECT "order" FROM "list" WHERE "id"=?) AND list_type_id=?))/2 FROM "list" WHERE "id"=?), (SELECT max("order")+1000 FROM "list") ,0)',
            [putAfter, listType, putAfter]
          )
        })
        .where("id", currentId)
        .andWhere("list_type_id", listType);

      // Execute query
      await reorderedList.catch(async err => {
        // If there was an issue entering, assume the orders need renormalization (to make room between them), so do that and try again
        await normalizeTable(
          "list",
          "order",
          [
            'ALTER TABLE "list" DROP CONSTRAINT "list_order_list_type_id_unique";',
            'ALTER TABLE "list"	ADD CONSTRAINT "list_order_list_type_id_unique" UNIQUE("order","list_type_id");'
          ],
          100000
        );

        // Now try again
        await reorderedList.catch(err =>
          res.status(400).send({
            message: "There was a problem with the reorder.",
            error: err
          })
        );
      });
    }
    if (typeof reorderedList !== "undefined") {
      res.status(200).send({ message: "Reordered succesfully! " });
    }
  });

  // Delete useful tool
  app.post("/api/lists/delete", async (req, res) => {
    const ids = req.body.ids;
    const deletedList = await List.query()
      .delete()
      .whereIn("id", ids);
    res.status(200).send({ message: "Deleted " + deletedList + " list items" });
  });

  // Edit list
  app.patch("/api/lists", requireLogin, async (req, res) => {
    const { id, name, link } = req.body;
    const editedList = await List.query()
      .patch({ name, link })
      .where("id", id)
      .returning("*");
    res
      .status(200)
      .send({ message: "Edited list successfully", editedList: editedList[0] });
  });
};
