require("dotenv").config();
const { Model } = require("objection");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const { PORT, SESSION_SECRET, CLIENT_URL } = process.env;
const cors = require("cors");
const knex = require("./db/knex");

// Connect Objection models to the database using knex.
// (order is important here - since I'm relying on that to access the knex object globally in the graphql schema files)
Model.knex(knex);
const apollo = require("./graphql/server");

apollo.applyMiddleware({ app });

app.use(
  session({ secret: SESSION_SECRET, saveUninitialized: false, resave: true })
);
app.use(flash());

if (typeof CLIENT_URL === "string" && CLIENT_URL !== "") {
  app.use(cors({ origin: CLIENT_URL }));
} else {
  app.use(cors());
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require("./services/passportFlow")(app);
app.use(function(req, _, next) {
  req.headers["if-none-match"] = "no-match-for-this";
  next();
});

// Routes
require("./portfolio/portfolioRoutes")(app);
require("./admin/adminRoutes")(app);
require("./list/listRoutes")(app);
require("./carousel/carouselRoutes")(app);
require("./services/getSignedUrls")(app);

app.listen(PORT, () => console.log("Listening on port: ", PORT));
