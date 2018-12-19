/* listSchema.js */
const { gql } = require("apollo-server");
const { List, ListType } = require("./listModels");
const {
  normalizeTable,
  generateRawPushOrder
} = require("../services/reorder.js");
const { raw } = require("objection");

const typeDef = gql`
  type List {
    id: ID!
    order: Int!
    name: String!
    link: String!
    listType: ListType
  }

  input ListInput {
    name: String!
    link: String!
    listTypeId: ID!
  }

  type ListType {
    id: ID!
    name: String!
    lists: [List]
  }

  extend type Query {
    lists: [List]
    listTypes: [ListType]
  }

  extend type Mutation {
    addList(addedList: ListInput!): List!
    editList(id: ID!, editedList: ListInput!): List!
    deleteLists(ids: [ID]!): ID
    reorderLists(afterId: ID, currentId: ID!, listTypeId: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    async lists() {
      return List.query().orderBy("order", "asc");
    },
    listTypes() {
      return ListType.query().then(obj => {
        return obj.map(ele => {
          return { ...ele, name: ele.type };
        });
      });
    }
  },
  Mutation: {
    async addList(_, args) {
      const { name, link, listTypeId } = args.addedList;
      return List.query().insert({
        name,
        link,
        list_type_id: listTypeId,
        order: generateRawPushOrder(
          "list",
          "order",
          { column: "list_type_id", value: listTypeId },
          10000
        )
      });
    },
    editList(_, args) {
      const { name, link, listTypeId } = args.editedList;
      const id = args.id;
      return List.query()
        .patch({ name, link, list_type_id: listTypeId })
        .where("id", id)
        .returning("*")
        .then(data => {
          return data[0];
        });
    },
    async deleteLists(_, args) {
      const { ids } = args;
      return List.query()
        .delete()
        .whereIn("id", ids);
    },
    async reorderLists(_, args) {
      const { afterId, currentId, listTypeId } = args;
      let reorderedList;
      // If afterId wasn't specified simply unshift currentId :
      if (typeof afterId === "undefined" && typeof currentId === "string") {
        reorderedList = await List.query()
          .patch({
            order: raw('COALESCE((SELECT min("order")-1000 FROM "list"),0)')
          })
          .where("id", currentId)
          .then(() => true)
          .catch(err => {
            console.log(err);
            return false;
          });
      } else {
        reorderedList = await List.query()
          .patch({
            order: raw(
              'COALESCE((SELECT ("order"+(SELECT min("order") FROM "list" WHERE "order">(SELECT "order" FROM "list" WHERE "id"=?) AND list_type_id=?))/2 FROM "list" WHERE "id"=?), (SELECT max("order")+1000 FROM "list") ,0)',
              [afterId, listTypeId, afterId]
            )
          })
          .where("id", currentId)
          .andWhere("list_type_id", listTypeId)
          .then(() => {
            return true;
          })
          .catch(async () => {
            // If there was an issue entering, assume the orders need renormalization (to make room between them), so do that and try again
            return normalizeTable(
              "list",
              "order",
              [
                'ALTER TABLE "list" DROP CONSTRAINT "list_order_list_type_id_unique";',
                'ALTER TABLE "list"	ADD CONSTRAINT "list_order_list_type_id_unique" UNIQUE("order","list_type_id");'
              ],
              100000
            )
              .then(() => true)
              .catch(err => {
                console.log(err);
                return false;
              });
          });
      }
      return !!reorderedList;
    }
  },
  List: {
    listType(parent) {
      return ListType.query()
        .where("id", parent.list_type_id)
        .then(res => {
          res[0].name = res[0].type;
          return res[0];
        });
    }
  },
  ListType: {
    lists(parent, args, root, ast) {
      return List.query()
        .where("list_type_id", parent.id)
        .orderBy("order", "asc");
    }
  }
};

module.exports = { typeDef, resolvers };
