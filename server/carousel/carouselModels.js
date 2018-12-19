const { Model } = require("objection");

// Carousel model for the "carousel" table.
// Contains :
class Carousel extends Model {
  static get tableName() {
    return "carousel";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "description", "image_key", "url"],

      properties: {
        id: { type: "integer" },
        order: { type: "integer" },
        url: { type: "string", maxLength: 500 },
        title: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "text" },
        image_key: { type: "string", minLength: 10, maxLength: 500 }
      }
    };
  }
}

module.exports = { Carousel };
