const { Model } = require("objection");

// Artwork model for the "artwork" table.
// Contains :
class Artwork extends Model {
  static get tableName() {
    return "artwork";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "image_key"],

      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "text" },
        image_key: { type: "string", minLength: 10, maxLength: 500 }
      }
    };
  }

  static get relationMappings() {
    return {
      categories: {
        relation: Model.ManyToManyRelation,
        modelClass: Category,
        join: {
          from: "artwork.id",
          through: {
            from: "artwork_category.artwork_id",
            to: "artwork_category.category_id"
          },
          to: "category.id"
        }
      }
    };
  }
}

// Category model - Tree structure
// Many to many relationship with Artworks
// One to (zero or) one relationship with itself
class Category extends Model {
  static get tableName() {
    return "category";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        id: { type: "integer" },
        name: { type: "string", maxLength: 255 },
        parent_id: { type: ["integer", null] },
        description: { type: "text" }
      }
    };
  }

  static get relationMappings() {
    return {
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: "category.parent_id",
          to: "category.id"
        }
      }
    };
  }
}

module.exports = { Artwork: Artwork, Category: Category };
