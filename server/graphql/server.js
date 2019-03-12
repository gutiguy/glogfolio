const { ApolloServer } = require("apollo-server-express");
const { GraphQLError } = require("graphql/error");
const schema = require("./schema");

module.exports = new ApolloServer({
  schema,
  formatError: error => {
    console.log(error);
    return new GraphQLError(
      "Internal server error",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { code: 500 }
    );
  }
});
