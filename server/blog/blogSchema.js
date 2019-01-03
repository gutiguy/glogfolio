const { Post, Tag } = require("./blogModels");

const { gql } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");
const { transaction } = require("objection");

const knex = Post.knex();

const PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT";

const typeDef = gql`
  scalar Date

  type PostDates {
    year: Int!
    month: Int!
  }

  type Post {
    id: ID
    posted_at: Date
    title: String
    content: String
    summary: String
    tags: [Tag]
  }

  input PostInput {
    title: String
    content: String
    posted_at: Date
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

  enum PublishStatus {
    DRAFT
    PUBLISHED
  }

  extend type Query {
    posts(ids: [ID], tags: [ID], publishStatus: PublishStatus): [Post]!
    tags(ids: [ID]): [Tag]!
    postDates(tags: [ID], publishStatus: PublishStatus): [PostDates]!
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
    addPost(addedPost: PostInput!, publishStatus: PublishStatus): Post!
    editPost(
      id: ID!
      publishStatus: PublishStatus
      editedPost: PostInput!
    ): Post!
    deletePost(id: ID!): Int!
  }

  extend type Tag {
    tags(ids: [ID]): [Tag]!
  }
`;

/* Utility functions */
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

function basicPostsQuery(ids, tags, publishStatus) {
  let getPosts = Post.query().leftJoinRelation("tags");
  if (Array.isArray(ids)) {
    getPosts = getPosts.whereIn("post.id", ids);
  }
  if (Array.isArray(tags) && tags.length) {
    getPosts = getPosts.whereIn("tags.id", tags);
  }
  if (publishStatus === PUBLISHED) {
    getPosts = getPosts.whereNotNull("post.posted_at");
  } else if (publishStatus === DRAFT) {
    getPosts = getPosts.whereNull("post.posted_at");
  }
  return getPosts;
}
/* End of utility functions */

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return value; // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
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
    async posts(_, { ids, publishStatus, tags, month, year }) {
      let getPosts = basicPostsQuery(ids, tags, publishStatus);
      if (month) {
        getPosts = getPosts.andWhere(
          knex.raw("EXTRACT(MONTH from posted_at)"),
          month
        );
      }
      if (year) {
        getPosts = getPosts.andWhere(
          knex.raw("EXTRACT(YEAR FROM posted_at)"),
          year
        );
      }
      return await getPosts.groupBy("post.id").orderBy("post.posted_at");
    },
    async postDates(_, { ids, publishStatus, tags }) {
      let getPostDates = basicPostsQuery(ids, tags, publishStatus).select(
        knex.raw("EXTRACT(YEAR FROM post.posted_at) AS year"),
        knex.raw("EXTRACT(MONTH FROM post.posted_at) AS month")
      );

      return await getPostDates
        .groupBy("year", "month")
        .orderBy("year", "month");
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
    async addPost(_, { addedPost, publishStatus = DRAFT }) {
      const { title, content, tags, summary } = addedPost;
      let { posted_at = null } = addedPost;
      if (publishStatus === PUBLISHED) {
        let d = new Date();
        posted_at = d.toISOString();
      }
      return transaction(knex, async trx => {
        const post = await Post.query(trx).insert({
          title,
          content,
          summary,
          posted_at
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
    async editPost(_, { editedPost, publishStatus, id }) {
      return transaction(knex, async trx => {
        if (publishStatus === DRAFT) {
          editedPost.posted_at = null;
        } else if (publishStatus === PUBLISHED) {
          let now = new Date();
          editedPost.posted_at = now.toISOString();
        }
        console.log(editedPost.posted_at);
        console.log(
          Post.query(trx)
            .patchAndFetchById(id, editedPost)
            .toString()
        );
        const updatedPost = await Post.query(trx).patchAndFetchById(
          id,
          editedPost
        );
        await updatedPost.$relatedQuery("tags", trx).unrelate();
        console.log(updatedPost);
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
