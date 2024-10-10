/* Statistic routes */

const statsController = require("../controllers/stats");

module.exports = (router) => {
  router.get("/get-monthly-stats", statsController.getMonthlyStats);
};
