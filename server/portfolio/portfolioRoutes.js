var arrayToTree = require("array-to-tree");
const uuid = require("uuid/v1");
const awsUtilities = require("../services/awsUtilities");
const getExtension = require("mime-types").extension;

// Routes for the portfolio's API

// Include data models:
const { Artwork, Category } = require("./portfolioModels");

const {
  generateRawPushOrder,
  reorder,
  injectOrder
} = require("../services/reorder.js");

module.exports = app => {
  app.get("/api/artworks", async (_, res) => {
    const artworks = await Artwork.query().eager("categories(selectId)", {
      selectId: builder => {
        builder.select("category.id");
      }
    });
    artworks.forEach(
      artwork =>
        (artwork.categories = artwork.categories.map(category => category.id))
    );
    res.status(200).send(artworks);
  });

  app.post("/api/artworks/add", async (req, res) => {
    const { name, description, selectedCategories, height, width } = req.body;
    const imageKey = `${uuid()}s${width}x${height}.jpeg`;
    const newArt = await Artwork.query().insert({
      name,
      description,
      image_key: imageKey
    });
    if (typeof Array.isArray(selectedCategories)) {
      const RelateCategories = await newArt
        .$relatedQuery("categories")
        .relate(selectedCategories);
    }
    res.status(200).send({ key: imageKey });
  });

  app.post("/api/artworks/delete", async (req, res) => {
    const { selectedImages } = req.body;
    let ids = [];
    let Objects = [];
    Object.keys(selectedImages).forEach(image => {
      ids.push(image);
      Objects.push({ Key: selectedImages[image] });
    });
    const deleteRequest = await Artwork.query()
      .delete()
      .whereIn("id", ids);
    awsUtilities.deleteFiles(Objects);
    if (deleteRequest) {
      res.status(200).send({ message: "Artwork deleted" });
    } else {
      res.status(400).send();
    }
  });

  app.post("/api/artworks/edit", async (req, res) => {
    const { id, name, description, selectedCategories } = req.body;
    const newArt = await Artwork.query().patchAndFetchById(id, {
      name,
      description
    });
    const DeleteRelations = await newArt.$relatedQuery("categories").unrelate();
    if (typeof Array.isArray(selectedCategories)) {
      const RelateCategories = await newArt
        .$relatedQuery("categories")
        .relate(selectedCategories);
    }
    if (newArt) {
      res.status(200).send({ message: "All is well" });
    } else {
      res.status(400).send();
    }
  });

  // Get the categories in a JSON tree format, or normalized
  app.get("/api/categories", async (req, res) => {
    let response;
    let normalize = req.query.normalize;
    // Get all Categories (except for the dummy root)
    let categories = await Category.query()
      .orderBy("parent_id", "asc")
      .orderBy("order", "asc")
      .where("parent_id", "IS NOT", null);
    let baseCategories = [];
    if (typeof categories === "undefined") {
      res.status(204).send({ error: "No categories found" });
    } else {
      // Normalize
      if (normalize === "true") {
        let normalCategories = new Object();
        categories.forEach(category => {
          if (typeof normalCategories[category.id] === "undefined") {
            normalCategories[category.id] = new Object();
          }
          normalCategories[category.id] = {
            ...normalCategories[category.id],
            parent_id: category.parent_id,
            name: category.name,
            description: category.description,
            group_name: category.group_name
          };

          if (typeof category.parent_id === "number") {
            if (typeof normalCategories[category.parent_id] === "undefined") {
              normalCategories[category.parent_id] = new Object();
              normalCategories[category.parent_id].children = [];
            } else if (
              typeof normalCategories[category.parent_id].children ===
              "undefined"
            ) {
              normalCategories[category.parent_id].children = [];
            }
            normalCategories[category.parent_id].children.push(category.id);
          } else {
            baseCategories.push(category.id);
          }
        });
        categories = normalCategories;
      } else {
        // Turn them into tree structure using the arrayToTree package
        categories = arrayToTree(categories, {
          parentProperty: "parent_id",
          customId: "id"
        });
      }
      // Convert result into a javascript tree object
      res
        .status(200)
        .send({ categories: categories, baseCategories: baseCategories });
    }
  });

  // Fetch a single category (for whatever reason)
  app.get("/api/categories/:categoryId", async (req, res) => {
    const category = await Category.query()
      .where("id", req.params.categoryId)
      .first();
    res.send(category);
  });

  app.post("/api/categories/add", async (req, res) => {
    const { name, description, group_name, parent_id } = req.body;
    if (typeof parent_id === "undefined") {
      parent_id = 1;
    }
    const addResponse = await Category.query()
      .insert({
        name: name,
        group_name: group_name,
        description: description,
        parent_id: parent_id,
        order: generateRawPushOrder(
          "category",
          "order",
          { column: "parent_id", value: parent_id },
          100000
        )
      })
      .catch(error => console.log(error));
    if (typeof addResponse !== "undefined") {
      res.status(200).send({ message: "Category added successfuly!" });
    }
  });

  app.post("/api/categories/delete", async (req, res) => {
    // If category had a parent, transfer all of its children to the parent, unless received a deleteTree=true argument.
    const { ids } = req.body;
    let errors = [];
    if (typeof ids === undefined) {
      res.status(500).send({ error: "No categories id provided!" });
    }

    ids.forEach(async id => {
      // Update children's order to fit grandparent's ordering
      await injectOrder("category", "order", 100000, {
        column: "parent_id",
        value: id
      });
      // Update children's parent id (to point to grandparent)
      await Category.query()
        .patch({
          parent_id: Category.query()
            .select("parent_id")
            .where("id", id)
        })
        .where("parent_id", id)
        .debug();
      // Delete category tree
      const numDeleted = await Category.query()
        .delete()
        .where("id", id);
      if (numDeleted === 0) {
        errors.push("Failed to delete category " + id);
      }
    });
    if (errors.length !== 0) {
      res.status(500).send({ error: errors });
    } else {
      res.status(200).send("done");
    }
  });

  app.patch("/api/categories", async (req, res) => {
    const {
      id,
      parent_id,
      name,
      description,
      group_name,
      change_parent = false
    } = req.body;
    let updatedCategory = { parent_id, name, description, group_name };
    // If there was a change of parent then we need to give a new order value to avoid unique constraint conflict
    if (change_parent === true) {
      updatedCategory.order = generateRawPushOrder(
        "category",
        "order",
        { column: "parent_id", value: parent_id },
        100000
      );
    }
    const editedCategory = await Category.query()
      .patch(updatedCategory)
      .where("id", id)
      .returning("*")
      .debug();
    if (!editedCategory || !editedCategory.length) {
      res.status(401).send({ message: "Category not found!" });
    } else {
      res.status(200).send({
        message: "Edited category successfully",
        editedCategory: editedCategory
      });
    }
  });

  app.post("/api/categories/reorder", async (req, res) => {
    const { putAfter, currentId, parent_id } = req.body;
    const typeConstraint = {
      column: "parent_id",
      value: parent_id,
      constraintName: "category_order_parent_id_unique",
      constraintDeclaration: 'UNIQUE("parent_id","order")'
    };
    const response = await reorder(
      putAfter,
      currentId,
      Category,
      typeConstraint,
      { parent_id: parent_id }
    );
    if (typeof response.error !== "undefined") {
      res.status(400).send(response);
    } else {
      res.status(200).send(response);
    }
  });
};
