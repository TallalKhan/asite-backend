const eventReqPayload = {
  name: "Paint Show",
  date: "2024/10/22",
  capacity: 100,
  costPerTicket: 8,
};

const eventResPayload = {
  _id: "6705113fa48683cf85efebb2",
  name: "Paint Show",
  date: {
    $date: "2024-04-22T00:00:00.000Z",
  },
  originalCapacity: 100,
  currentCapacity: 100,
  costPerTicket: 8,
  transactions: [],
  createdAt: "2024-10-08T11:02:23.336Z",
  updatedAt: "2024-10-08T11:02:23.336Z",
};

const eventAddTransactionResPayload = {
  _id: "6705113fa48683cf85efebb2",
  name: "Paint Show",
  date: {
    $date: "2024-04-22T00:00:00.000Z",
  },
  originalCapacity: 100,
  currentCapacity: 88,
  costPerTicket: 8,
  transactions: [
    {
      nTickets: 12,
      date: "2024-10-07T21:28:07.852Z",
      _id: "670452670df545730c7a882c",
    },
  ],
  createdAt: "2024-10-08T11:02:23.336Z",
  updatedAt: "2024-10-08T11:02:23.336Z",
};

const transactionPayload = {
  event: "6705113fa48683cf85efebb2",
  nTickets: 5,
};

const monthlyStatsResolvedPayload = [
  {
    year: 2023,
    month: 11,
    revenue: 520,
    nEvents: 1,
    averageTicketsSold: 26,
  },
  {
    year: 2023,
    month: 12,
    revenue: 139250,
    nEvents: 1,
    averageTicketsSold: 557,
  },
  {
    year: 2024,
    month: 4,
    revenue: 2300,
    nEvents: 1,
    averageTicketsSold: 92,
  },
];

module.exports = {
  eventReqPayload,
  eventResPayload,
  eventAddTransactionResPayload,
  transactionPayload,
  monthlyStatsResolvedPayload,
};
