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
    tags: [Tag]
  }

  input PostInput {
    title: String
    content: String
    updated_at: Date
    draft: Boolean
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
    posts(ids: [ID], tags: [Int], draft: Boolean): [Post]!
    tags(ids: [ID]): [Tag]!
  }

  extend type Mutation {
    addTags(addedTags: [TagInput]!): [Tag]!
    editTags(editedTags: [TagEditInput]!): [Tag]!
    deleteTags(ids: [ID]): Int!
    addPost(addedPost: PostInput!): Post!
    editPost(id: ID!, editedPost: PostInput!): Post!
    deletePost(id: ID!): Int!
  }

  extend type Tag {
    tags(ids: [ID]): [Tag]!
  }
`;

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
  Tag: {
    async tags(post, { ids }) {
      console.log(post);
    }
  },
  Query: {
    async posts(_, { ids, draft = "A", tags }) {
      let getPosts = Post.query().eager("tags");

      if (Array.isArray(ids)) {
        getPosts = getPosts.whereIn("id", ids);
      }
      return await getPosts;
    },
    async tags(obj, { ids }) {
      let getTags = Tag.query();
      console.log("here", obj);
      if (Array.isArray(ids)) {
        getTags = getTags.whereIn("id", ids);
      }
      return await getTags;
    }
  },
  Mutation: {
    async addPost(_, { addedPost }) {
      const { title, content, draft = true, tags } = addedPost;
      return transaction(knex, async trx => {
        const post = await Post.query(trx).insert({ title, content, draft });
        console.log("post", post);
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
            .then(_ => {
              console.log(_);
              return updatedPost;
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
    },
    async deleteTags(_, { ids }) {
      return Tag.query()
        .delete()
        .whereIn("id", ids);
    }
  }
};

module.exports = { typeDef, resolvers };
