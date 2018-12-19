const knex = require("../db/knex");
LocalStrategy = require("passport-local").Strategy;

// Admin authentication
module.exports = new LocalStrategy(async (username, password, done) => {
  const admin = await knex("user")
    .select("id", "name", "password")
    .where({ name: username, password: password })
    .first()
    .catch(error => done(error));
  if (typeof admin === "undefined") {
    return done(null, false, { message: "Incorrect username or password." });
  }
  return done(null, admin.id);
});
