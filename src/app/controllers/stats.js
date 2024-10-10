/* Event controller for handling Statistics routes logic */
const Joi = require("joi");
const { logger } = require("../utils/winston");

module.exports = {
  getMonthlyStats: async (req, res) => {
    try {
      logger.info("Starting getting monthly stats of last 12 months");
      let currentDate = new Date();
      const last12Months = currentDate.setMonth(currentDate.getMonth() - 12);

      // Aggregation Pipeline to fetch specific stats from Events collection

      const stats = await db.Events.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $gte: ["$date", { $toDate: last12Months }] },
                { $lte: ["$date", { $toDate: new Date() }] },
              ],
            },
          },
        },
        {
          $addFields: {
            totalTicketsSold: {
              $sum: "$transactions.nTickets",
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$date",
              },
              month: {
                $month: "$date",
              },
            },
            revenue: {
              $sum: {
                $multiply: ["$costPerTicket", "$totalTicketsSold"],
              },
            },
            nEvents: {
              $sum: 1,
            },
            averageTicketsSold: {
              $avg: "$totalTicketsSold",
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$_id", "$$ROOT"],
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ]);

      logger.debug(
        `Stats fetched for last 12 months: ${JSON.stringify(stats)}`
      );

      res.status(200).json({
        stats,
        message: stats.length
          ? "Successfully retrieved statistics for last 12 Months."
          : "There are no statistics to show.",
      });
    } catch (error) {
      logger.error(
        `Error in getting monthly stats for last 12 months: ${error}`
      );

      res.status(400).json({
        error: error.message,
        message: "Error in getting monthly stats API!",
      });
    }
  },
};
