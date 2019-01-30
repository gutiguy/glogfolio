const passport = require("passport");
const adminAuth = require("../admin/authStrategy");

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(adminAuth);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (_, done) => {
    done(null, {});
  });
};
