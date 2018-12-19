const listSchema = require("../list/listSchema");
const pageSchema = require("../pages/pageSchema");
const navigationSchema = require("../navigation/navigationSchema");
const { makeExecutableSchema } = require("graphql-tools");
const gql = require("graphql-tag");

const Base = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

module.exports = makeExecutableSchema({
  typeDefs: [
    Base,
    listSchema.typeDef,
    pageSchema.typeDef,
    navigationSchema.typeDef
  ],
  resolvers: [
    listSchema.resolvers,
    pageSchema.resolvers,
    navigationSchema.resolvers
  ]
});
