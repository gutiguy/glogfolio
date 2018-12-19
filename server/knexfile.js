let { POSTGRES_URI } = process.env;

/* If ran from knex cli in development, load env variables and try again */
if (!POSTGRES_URI) {
  require("dotenv").config();
  POSTGRES_URI = process.env.POSTGRES_URI;
}

module.exports = {
  client: "postgresql",
  connection: POSTGRES_URI,
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};
