const knex = require("../db/knex");
const { INIT_USER, INIT_PASSWORD } = process.env;
LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// Admin authentication
module.exports = new LocalStrategy(async (username, password, done) => {
  const admin = await knex("user")
    .select("id", "name", "password")
    .first();

  if (!admin && username === INIT_USER && password === INIT_PASSWORD) {
    return done(null, -1);
  } else if (admin.name === username) {
    const res = await bcrypt.compare(password, admin.password);
    if (res) {
      return done(null, admin.id);
    }
  }

  return done(null, false, { message: "Incorrect username or password." });
});
