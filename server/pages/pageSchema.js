const { Page } = require("./pageModels");
const { Navigation } = require("../navigation/navigationModels");
const { gql } = require("apollo-server");

const { transaction } = require("objection");

const knex = Page.knex();

const typeDef = gql`
  type Page {
    id: ID!
    title: String!
    perma: String!
    content: String!
    draft: Boolean!
  }

  input PageInput {
    title: String!
    perma: String!
    content: String!
    draft: Boolean
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

function editQuery(id, query, editedPage) {
  return query
    .patchAndFetchById(id, editedPage)
    .then(() => true)
    .catch(() => false);
}

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
      if (editedPage.draft === true) {
        return transaction(knex, async trx => {
          await editQuery(id, Page.query(trx), editedPage);
          return Navigation.query(trx)
            .from(knex.raw("navigation USING navigation_page"))
            .delete()
            .where("navigation_page.page_id", id);
        });
      }
      return editQuery(id, Page.query(), editedPage);
    },
    async deletePages(_, { ids }) {
      return Page.query()
        .delete()
        .whereIn("id", ids);
    }
  }
};

module.exports = { typeDef, resolvers };
