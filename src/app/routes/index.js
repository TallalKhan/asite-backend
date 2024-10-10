const events = require("./events");
const stats = require("./stats");

module.exports = (router) => {
  events(router);
  stats(router);
};
