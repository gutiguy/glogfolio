const passport = require("passport");
const knex = require("../db/knex");
const requireLogin = require("../middlewares/requireLogin");
const { INIT_PASSWORD } = process.env;
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = app => {
  app.post(
    "/api/login",
    passport.authenticate("local", { failureFlash: true }),
    (_, res) => {
      res.sendStatus(200);
    }
  );

  app.post("/api/logout", (req, res) => {
    req.logout();
    res.sendStatus(200);
  });

  app.post("/api/admin/change_info", requireLogin, async (req, res) => {
    const { username, newPassword, password } = req.body;

    const admin = await knex("user")
      .select("id", "password")
      .first();

    if (admin) {
      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        res.sendStatus(400);
        return;
      }
    } else if (!(req.user.id === -1 && password === INIT_PASSWORD)) {
      res.sendStatus(400);
      return;
    }

    let newHash;
    if (newPassword) {
      if (newPassword.length < 6) {
        res.sendStatus(400);
        return;
      }
      newHash = await bcrypt.hash(newPassword, saltRounds);
    }

    if (admin) {
      await knex("user")
        .update({
          name: username,
          password: newHash
        })
        .where("id", admin.id);
    } else {
      await knex("user").insert({
        name: username,
        password: newHash
      });
    }

    res.sendStatus(200);
  });

  app.get("/api/current_user", requireLogin, (req, res) => {
    if (!req.user) {
      res.sendStatus(201);
    } else {
      res.status(200).send({ username: req.user.username });
    }
  });
};
