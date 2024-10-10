/* Event routes */

const eventsController = require("../controllers/events");

module.exports = (router) => {
  router.post("/create-event", eventsController.createEvent);

  router.post("/add-transaction", eventsController.addTransaction);
};
