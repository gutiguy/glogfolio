const { Post, Tag } = require("./blogModels");

const { gql } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");
const { transaction } = require("objection");

const knex = Post.knex();

const typeDef = gql`
  scalar Date

  type Post {
    id: ID
    updated_at: Date
    title: String
    content: String
    draft: Boolean
    summary: String
    tags: [Tag]
  }

  input PostInput {
    title: String
    content: String
    updated_at: Date
    draft: Boolean
    summary: String
    tags: [ID]
  }

  type Tag {
    id: ID!
    name: String
  }

  input TagInput {
    name: String!
  }

  input TagEditInput {
    id: ID!
    name: String!
  }

  extend type Query {
    posts(ids: [ID], tags: [ID], draft: Boolean): [Post]!
    tags(ids: [ID]): [Tag]!
  }

  extend type Mutation {
    addTags(addedTags: [TagInput]!): [Tag]!
    editTags(editedTags: [TagEditInput]!): [Tag]!
    deleteTags(ids: [ID]): Int!
    addEditAndDeleteTags(
      addedTags: [TagInput]
      editedTags: [TagEditInput]
      deletedTags: [ID]
    ): Boolean!
    addPost(addedPost: PostInput!): Post!
    editPost(id: ID!, editedPost: PostInput!): Post!
    deletePost(id: ID!): Int!
  }

  extend type Tag {
    tags(ids: [ID]): [Tag]!
  }
`;

function editTagsQuery(editedTags) {
  return transaction(knex, async trx => {
    let updatedTags = editedTags.map(tag =>
      Tag.query(trx)
        .patch({ name: tag.name })
        .where("id", tag.id)
        .returning("*")
        .then(data => data[0])
    );
    return Promise.all(updatedTags);
  });
}

function deleteTagsQuery(ids) {
  return Tag.query()
    .delete()
    .whereIn("id", ids);
}

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    }
  }),
  Post: {
    async tags(post) {
      if (post.tags) {
        return post.tags;
      }
      return await Tag.query()
        .joinRelation("post")
        .where("post.id", post.id);
    }
  },
  Query: {
    async posts(_, { ids, draft = "A", tags, month, year }) {
      let getPosts = Post.query().leftJoinRelation("tags");

      if (Array.isArray(ids)) {
        getPosts = getPosts.whereIn("post.id", ids);
      }
      if (month) {
        getPosts = getPosts.andWhere(
          knex.raw("EXTRACT(MONTH from updated_at)"),
          month
        );
      }
      if (year) {
        getPosts = getPosts.andWhere(
          knex.raw("EXTRACT(YEAR FROM updated_at)"),
          year
        );
      }
      if (Array.isArray(tags) && tags.length) {
        getPosts = getPosts.whereIn("tags.id", tags);
      }
      return await getPosts.groupBy("post.id").orderBy("post.updated_at");
    },
    async tags(_, { ids }) {
      let getTags = Tag.query();
      if (Array.isArray(ids)) {
        getTags = getTags.whereIn("id", ids);
      }
      return await getTags;
    }
  },
  Mutation: {
    async addPost(_, { addedPost }) {
      const { title, content, draft = true, tags, summary } = addedPost;
      return transaction(knex, async trx => {
        const post = await Post.query(trx).insert({
          title,
          content,
          draft,
          summary
        });
        if (Array.isArray(tags)) {
          return post
            .$relatedQuery("tags", trx)
            .relate(tags)
            .then(_ => {
              return post;
            });
        } else {
          return post;
        }
      });
    },
    async editPost(_, { editedPost, id }) {
      return transaction(knex, async trx => {
        const updatedPost = await Post.query(trx).patchAndFetchById(
          id,
          editedPost
        );
        await updatedPost.$relatedQuery("tags", trx).unrelate();
        if (Array.isArray(editedPost.tags) && editedPost.tags.length) {
          return updatedPost
            .$relatedQuery("tags")
            .relate(editedPost.tags)
            .then(() => {
              return { ...updatedPost, tags: null };
            });
        }
        return updatedPost;
      });
    },
    async deletePost(_, { id }) {
      return Post.query()
        .delete()
        .where("id", id);
    },
    async addTags(_, { addedTags }) {
      return await Tag.query().insert(addedTags);
    },
    async editTags(_, { editedTags }) {
      return editTagsQuery(editedTags);
    },
    async deleteTags(_, { ids }) {
      return deleteTagsQuery(ids);
    },
    async addEditAndDeleteTags(_, { addedTags, editedTags, deletedTags }) {
      try {
        if (addedTags) {
          await Tag.query().insert(addedTags);
        }
        if (editedTags) {
          await editTagsQuery(editedTags);
        }
        if (deletedTags) {
          await deleteTagsQuery(deletedTags);
        }
      } catch (e) {
        console.log(e);
        return false;
      }
      return true;
    }
  }
};

module.exports = { typeDef, resolvers };
