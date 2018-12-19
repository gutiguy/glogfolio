const {
  Navigation,
  ExternalNavigation,
  PageNavigation
} = require("./navigationModels");

const { reorder } = require("../services/reorder");

const { insertNavigation, editNavigation } = require("./navigationUtils");
const { transaction } = require("objection");

const { gql } = require("apollo-server");

const knex = Navigation.knex();

const typeDef = gql`
  enum Type {
    E
    P
  }

  interface Navigation {
    id: ID!
    order: Int!
    type: Type!
    name: String!
    shown: Boolean!
  }

  type PageNavigation implements Navigation {
    id: ID!
    order: Int!
    type: Type!
    name: String!
    shown: Boolean!
    page: Page
  }

  type ExternalNavigation implements Navigation {
    id: ID!
    order: Int!
    type: Type!
    name: String!
    shown: Boolean!
    link: String!
  }

  input ExternalNavigationInput {
    name: String!
    shown: Boolean!
    link: String!
  }

  input PageNavigationInput {
    name: String!
    shown: Boolean!
    pageId: ID!
  }

  extend type Query {
    navigations(ids: [ID], shown: Boolean, type: Type): [Navigation]!
  }

  extend type Mutation {
    addExternalNavigation(
      addedNavigation: ExternalNavigationInput!
    ): ExternalNavigation!
    addPageNavigation(addedNavigation: PageNavigationInput!): PageNavigation!
    editExternalNavigation(
      id: ID!
      editedNavigation: ExternalNavigationInput!
    ): Boolean!
    editPageNavigation(
      id: ID!
      editedNavigation: PageNavigationInput!
    ): Boolean!
    deleteNavigations(ids: [ID]!): Int!
    reorderNavigations(afterId: ID!, currentId: ID!): Boolean
  }
`;

const resolvers = {
  Navigation: {
    __resolveType(obj) {
      if (obj.page) {
        return "PageNavigation";
      }

      if (obj.link) {
        return "ExternalNavigation";
      }

      return null;
    }
  },
  Query: {
    async navigations(_, { ids, shown = "A", type }) {
      let getOptions = Navigation.query().select(
        "navigation.id",
        "navigation.order",
        "navigation.name",
        "navigation.shown",
        "navigation.type",
        "navigation_external.link",
        "page.id AS page_id",
        "page.title",
        "page.perma"
      );
      getOptions = appendExternals(getOptions);
      getOptions = appendPages(getOptions);

      if (Array.isArray(ids)) {
        getOptions = getOptions.whereIn("navigation.id", ids);
      }
      if (shown !== "A" && typeof shown === "boolean") {
        getOptions = getOptions.andWhere("shown", shown);
      }
      if (type) {
        getOptions = getOptions.andWhere("navigation.type", type);
      }
      return getOptions.orderBy("order").then(data =>
        data.map(ele => {
          let page = false;
          if (ele.page_id) {
            page = { id: ele.page_id, perma: ele.perma, title: ele.title };
          }
          return {
            ...ele,
            page
          };
        })
      );
    }
  },
  Mutation: {
    async addExternalNavigation(_, { addedNavigation }) {
      const { name, shown, link } = addedNavigation;
      return transaction(knex, async trx => {
        const { id: navigation_id } = await insertNavigation({
          trx,
          name,
          shown,
          type: "E"
        });
        return ExternalNavigation.query(trx).insert({
          link,
          type: "E",
          navigation_id
        });
      });
    },
    async addPageNavigation(_, { addedNavigation }) {
      const { name, shown, pageId } = addedNavigation;
      return transaction(knex, async trx => {
        const { id: navigation_id } = await insertNavigation({
          trx,
          name,
          shown,
          type: "P"
        });
        return PageNavigation.query(trx).insert({
          page_id: parseInt(pageId, 10),
          type: "P",
          navigation_id
        });
      });
    },
    async editExternalNavigation(_, { editedNavigation, id }) {
      const { name, shown, link } = editedNavigation;
      return transaction(knex, async trx => {
        await editNavigation({
          trx,
          name,
          shown,
          id
        });

        return ExternalNavigation.query(trx)
          .patch({
            link
          })
          .where("navigation_id", id);
      });
    },
    async editPageNavigation(_, { editedNavigation, id }) {
      const { name, shown, pageId } = editedNavigation;
      return transaction(knex, async trx => {
        await editNavigation({
          trx,
          name,
          shown,
          id
        });

        return PageNavigation.query(trx)
          .patch({
            page_id: parseInt(pageId, 10)
          })
          .where("navigation_id", id);
      });
    },
    async deleteNavigations(_, { ids }) {
      return Navigation.query()
        .delete()
        .whereIn("id", ids);
    },
    async reorderNavigations(_, { afterId, currentId }) {
      const { status } = await reorder(afterId, currentId, Navigation);
      return status;
    }
  }
};

module.exports = { typeDef, resolvers };
function appendExternals(getOptions) {
  return getOptions.fullOuterJoin(
    "navigation_external",
    "navigation.id",
    "navigation_external.navigation_id"
  );
}

function appendPages(getOptions) {
  return getOptions
    .fullOuterJoin(
      "navigation_page",
      "navigation.id",
      "navigation_page.navigation_id"
    )
    .leftOuterJoin("page", "navigation_page.page_id", "page.id");
}
