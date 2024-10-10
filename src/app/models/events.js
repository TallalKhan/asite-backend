const mongoose = require("mongoose");

const EventsModel = function () {
  let eventsSchema = mongoose.Schema(
    {
      name: { type: String, requird: true },
      date: { type: Date, requird: true },
      originalCapacity: { type: Number, min: 0, requird: true },
      currentCapacity: { type: Number, min: 0, requird: true },
      costPerTicket: { type: Number, min: 0, requird: true },
      transactions: [
        {
          nTickets: { type: Number, min: 0, requird: true },
          date: { type: Date, requird: true },
        },
      ],
    },
    { collection: "Events", timestamps: true }
  );
  return mongoose.model("Events", eventsSchema);
};

module.exports = new EventsModel();
