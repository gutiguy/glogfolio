const { Model } = require("objection");

// Contains :
class List extends Model {
  static get tableName() {
    return "list";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "link"],

      properties: {
        id: { type: "integer" },
        order: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        link: { type: "string", minLength: 10, maxLength: 500 },
        list_type_id: { type: "integer" }
      }
    };
  }

  static get relationMappings() {
    return {
      list_type: {
        relation: Model.BelongsToOneRelation,
        modelClass: ListType,
        join: {
          from: "list.id",
          to: "list_type.id"
        }
      }
    };
  }
}

class ListType extends Model {
  static get tableName() {
    return "list_type";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["type"],

      properties: {
        id: { type: "integer" },
        type: { type: "string", minLength: 1, maxLength: 255 }
      }
    };
  }

  static get relationMappings() {
    return {
      lists: {
        relation: Model.HasManyRelation,
        modelClass: List,
        join: {
          from: "list_type.id",
          to: "list.list_type_id"
        }
      }
    };
  }
}

module.exports = { List, ListType };
