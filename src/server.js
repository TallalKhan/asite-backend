require("dotenv").config();
const express = require("express");
const allRoutes = require("./app/routes/index");
const createService = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
      message: "Something went wrong",
      error: process.env.NODE_ENV === "production" ? {} : err.stack,
    });
  });
  app.get("/", (req, res) => {
    res.status(200).send(`Welcome to Asite ${process.env.NODE_ENV} backend`);
  });

  global.db = require("./app/models/index");
  allRoutes(app);
  return app;
};

module.exports = createService;
