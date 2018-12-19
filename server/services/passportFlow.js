const passport = require("passport");
const adminAuth = require("../admin/authStrategy");
const knex = require("../db/knex");

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(adminAuth);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (id, done) => {
    const admin = await knex("user")
      .select()
      .where({ id: id })
      .first()
      .catch(error => done(error));
    if (typeof admin === "undefined") {
      done(null, false);
    }

    done(null, admin);
  });
};
