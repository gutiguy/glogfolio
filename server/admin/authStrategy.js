const knex = require("../db/knex");
const { INIT_USER, INIT_PASSWORD } = process.env;
LocalStrategy = require("passport-local").Strategy;

// Admin authentication
module.exports = new LocalStrategy(async (username, password, done) => {
  const admin = await knex("user")
    .select("id", "name", "password")
    .first();

  if (!admin) {
    if (username === INIT_USER && password === INIT_PASSWORD) {
      return done(null, -1);
    }
    return done(null, false, { message: "Incorrect username or password." });
  }
  return done(null, admin.id);
});
