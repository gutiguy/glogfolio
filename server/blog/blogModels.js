const { Model } = require("objection");

// Page model for the "Page" table.
// Contains :
class Post extends Model {
  static get tableName() {
    return "post";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "content", "summary"],
      properties: {
        id: { type: "integer" },
        title: { type: "string", maxLength: 255 },
        content: { type: "text" },
        summary: { type: "string", maxLength: 500 },
        posted_at: {
          anyOf: [{ type: "string", format: "date-time" }, { type: "null" }]
        }
      }
    };
  }

  static get relationMappings() {
    return {
      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: Tag,
        join: {
          from: "post.id",
          through: {
            from: "post_tag.post_id",
            to: "post_tag.tag_id"
          },
          to: "tag.id"
        }
      }
    };
  }
}

class Tag extends Model {
  static get tableName() {
    return "tag";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", maxLength: 100 }
      }
    };
  }

  static get relationMappings() {
    return {
      post: {
        relation: Model.ManyToManyRelation,
        modelClass: Post,
        join: {
          from: "tag.id",
          through: {
            from: "post_tag.tag_id",
            to: "post_tag.post_id"
          },
          to: "post.id"
        }
      }
    };
  }
}

module.exports = { Post, Tag };
