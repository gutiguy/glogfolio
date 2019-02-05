const passport = require("passport");
const adminAuth = require("../admin/authStrategy");
const knex = require("../db/knex");

const { INIT_USER } = process.env;

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(adminAuth);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    let username;
    if (user === -1) {
      username = INIT_USER;
    } else {
      let resObject = await knex("user")
        .select("name")
        .where("id", user)
        .first();

      username = resObject.name;
    }

    done(null, { id: user, username });
  });
};
