const { Model } = require("objection");

// Page model for the "Page" table.
// Contains :
class Post extends Model {
  static get tableName() {
    return "post";
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "content"],
      properties: {
        id: { type: "integer" },
        title: { type: "string", maxLength: 255 },
        draft: { type: "boolean" },
        content: { type: "text" }
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
      tags: {
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
