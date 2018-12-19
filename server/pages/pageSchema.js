const { Page } = require("./pageModels");
const { gql } = require("apollo-server");

const typeDef = gql`
  type Page {
    id: ID!
    title: String!
    perma: String!
    content: String!
  }

  input PageInput {
    title: String!
    perma: String!
    content: String!
  }

  extend type Query {
    pages(ids: [ID]): [Page]!
  }

  extend type Mutation {
    addPage(addedPage: PageInput!): Page!
    editPage(id: ID!, editedPage: PageInput!): Boolean!
    deletePages(ids: [ID]!): Int!
  }
`;

const resolvers = {
  Query: {
    async pages(_, { ids }) {
      let getPage = Page.query().select();
      if (Array.isArray(ids)) {
        getPage = getPage.whereIn("id", ids);
      }
      return getPage;
    }
  },
  Mutation: {
    async addPage(_, { addedPage }) {
      return Page.query()
        .insert(addedPage)
        .then(data => ({ id: data.id, ...addedPage }));
    },
    async editPage(_, { id, editedPage }) {
      return Page.query()
        .patchAndFetchById(id, editedPage)
        .then(() => true)
        .catch(() => false);
    },
    async deletePages(_, { ids }) {
      return Page.query()
        .delete()
        .whereIn("id", ids);
    }
  }
};

module.exports = { typeDef, resolvers };
