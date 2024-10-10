/* Event controller for handling Event routes logic */

const Joi = require("joi");
const { validate } = require("../utils/validator");
const { logger } = require("../utils/winston");

module.exports = {
  createEvent: async (req, res) => {
    try {
      logger.info("Starting create Event controller");

      const eventBody = req.body;
      const transactionSchema = Joi.object({
        name: Joi.string().required(),
        date: Joi.date().min("now"),
        capacity: Joi.number().integer().min(1).required(),
        costPerTicket: Joi.number().integer().greater(-1).required(),
      });

      await validate(transactionSchema, eventBody);

      const checkEventOnDate = await db.Events.exists({
        date: eventBody.date,
      });

      if (checkEventOnDate)
        throw new Error("An event on this date already exists!");

      const newEventBody = {
        ...eventBody,
        originalCapacity: eventBody.capacity,
        currentCapacity: eventBody.capacity,
      };

      const createdEvent = await db.Events.create(newEventBody);

      logger.debug(`New created event: ${JSON.stringify(createdEvent)}`);
      logger.info("Event created");

      res.status(200).json({
        uniqueIdentifier: createdEvent._id,
        message: `Event ${createdEvent.name} created successfully!!`,
      });
    } catch (error) {
      logger.error(`Error in create event controller: ${error}`);

      res
        .status(400)
        .json({ error: error.message, message: "Error in create event API" });
    }
  },

  addTransaction: async (req, res) => {
    try {
      logger.info("Starting add transaction controller");
      const { event, nTickets } = req.body;
      const transactionSchema = Joi.object({
        event: Joi.string().required(),
        nTickets: Joi.number().integer().min(1).required(),
      });

      await validate(transactionSchema, {
        event,
        nTickets,
      });

      const singleEvent = await db.Events.findOne({ _id: event });

      if (!singleEvent) throw new Error("No event found!");

      if (singleEvent.currentCapacity < nTickets)
        throw new Error("Not enough tickets!");

      const transactionEvent = await db.Events.findOneAndUpdate(
        { _id: event },
        {
          $inc: { currentCapacity: -"nTickets" },
          $push: { transactions: { nTickets, date: new Date() } },
        },
        {
          new: true,
        }
      );

      logger.debug(
        `Event updated with transaction: ${JSON.stringify(transactionEvent)}`
      );
      logger.info("Transaction added in event");

      res.status(200).json({
        message: `Congratulations! You bought ${nTickets} for ${
          transactionEvent.name
        } on ${new Date(transactionEvent.date).toDateString()}.`,
      });
    } catch (error) {
      logger.error(`Error in add transaction controller: ${error}`);
      res.status(400).json({
        error: error.message,
        message: "Error in add transcation API",
      });
    }
  },
};
