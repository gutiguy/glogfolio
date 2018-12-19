const { Model } = require("objection");

// Page model for the "Page" table.
// Contains :
class Navigation extends Model {
  static get tableName() {
    return "navigation";
  }

  static get idColumn() {
    return ["type", "id"];
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "shown", "type"],
      properties: {
        id: { type: "integer" },
        type: { type: "string", enum: ["E", "P"] },
        order: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 60 },
        shown: { type: "boolean" }
      }
    };
  }
}

class PageNavigation extends Model {
  static get tableName() {
    return "navigation_page";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["navigation_id", "page_id"],
      properties: {
        id: { type: "integer" },
        type: { type: "string", enum: ["P"], default: "P" },
        page_id: { type: "integer" },
        navigation_id: { type: "integer" }
      }
    };
  }

  static get relationMappings() {
    return {
      navigation: {
        relation: Model.HasOneRelation,
        modelClass: Navigation,
        join: {
          from: ["navigation.type", "navigation.id"],
          to: ["navigation_page.type", "navigation_page.navigation_id"]
        }
      }
    };
  }
}

class ExternalNavigation extends Model {
  static get tableName() {
    return "navigation_external";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["navigation_id", "link", "type"],
      properties: {
        id: { type: "integer" },
        type: { type: "string", enum: ["E"], default: "E" },
        link: { type: "text" },
        navigation_id: { type: "integer" }
      }
    };
  }

  static get relationMappings() {
    return {
      navigation: {
        relation: Model.HasOneRelation,
        modelClass: Navigation,
        join: {
          from: ["navigation.type", "navigation.id"],
          to: ["navigation_external.type", "navigation_external.navigation_id"]
        }
      }
    };
  }
}

module.exports = { Navigation, PageNavigation, ExternalNavigation };
