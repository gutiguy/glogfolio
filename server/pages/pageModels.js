const { Model } = require("objection");

// Page model for the "Page" table.
// Contains :
class Page extends Model {
  static get tableName() {
    return "page";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "content", "perma"],
      properties: {
        id: { type: "integer" },
        perma: { type: "string", maxLength: 20 },
        title: { type: "string", minLength: 1, maxLength: 255 },
        content: { type: "text" },
        draft: { type: "boolean" }
      }
    };
  }
}

module.exports = { Page };
