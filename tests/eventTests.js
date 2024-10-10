const { MongoClient } = require("mongodb");
const SuperTest = require("supertest");
const startServer = require("../src/server");
const Events = require("../src/app/models/events");

const {
  eventReqPayload,
  eventResPayload,
  eventAddTransactionResPayload,
  transactionPayload,
  monthlyStatsResolvedPayload,
} = require("../__data__/eventData");
/**
 * This is a dummy test file to establish the skeleton framework for the project
 * The tests below assures the basic expressJS server has been established and responding,
 * and an in memory mongodb database has been setup for integration testing.
 *
 * Feel free to remove the entire file.
 */

jest.mock("../src/app/models/events");

describe("Asite API tests", () => {
  let server;
  let agent;

  beforeAll(async () => {
    server = await startServer().listen(8888);
    agent = await SuperTest(server);
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await server.close();
  });

  it("Express server test", async () => {
    const res = await agent.get("/").expect(200);
    expect(res.text).toEqual("Welcome to Asite test backend");
  });

  it("Mongo connection test", async () => {
    const conn = await MongoClient.connect("mongodb://127.0.0.1:27227");
    const db = await conn.db("test");
    const col = await db.collection("testCol");

    const dummyBson = { _id: 1, test: 1 };
    await col.insertOne(dummyBson);

    await expect(col.findOne({ _id: dummyBson._id })).resolves.toEqual(
      dummyBson
    );
    await conn.close();
  });

  it("Create an event with 200 response and success message", async () => {
    Events.create.mockResolvedValue(eventResPayload);
    Events.exists.mockResolvedValue(false);

    const responseCreateEvent = await agent
      .post("/create-event")
      .send(eventReqPayload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200);

    expect(responseCreateEvent.body.uniqueIdentifier).not.toBe(null);
    expect(responseCreateEvent.body.message).toEqual(
      "Event Paint Show created successfully!!"
    );
  });

  it("Return an error if an event already exists on one day", async () => {
    Events.create.mockResolvedValue(eventResPayload);
    Events.exists.mockResolvedValue(true);

    const responseCreateEvent = await agent
      .post("/create-event")
      .send(eventReqPayload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);

    expect(responseCreateEvent.body.error).toEqual(
      "An event on this date already exists!"
    );
  });

  it("Add a ticket transaction with 200 response", async () => {
    Events.findOne.mockResolvedValue(eventResPayload);
    Events.findOneAndUpdate.mockResolvedValue(eventAddTransactionResPayload);

    const responseCreateEvent = await agent
      .post("/add-transaction")
      .send(transactionPayload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(200);

    expect(responseCreateEvent.body.message).toEqual(
      `Congratulations! You bought ${transactionPayload.nTickets} for ${
        eventAddTransactionResPayload.name
      } on ${new Date(eventAddTransactionResPayload.date).toDateString()}.`
    );
  });

  it("Add a ticket transaction with not enough tickets showing error response 400", async () => {
    Events.findOne.mockResolvedValue(eventResPayload);
    Events.findOneAndUpdate.mockResolvedValue(eventAddTransactionResPayload);

    const responseCreateEvent = await agent
      .post("/add-transaction")
      .send({
        event: "6705113fa48683cf85efebb2",
        nTickets: 500,
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);

    expect(responseCreateEvent.body.error).toEqual("Not enough tickets!");
    expect(responseCreateEvent.body.message).toEqual(
      "Error in add transcation API"
    );
  });

  it("Add a ticket transaction with no event found showing error response 400", async () => {
    Events.findOne.mockResolvedValue(null);
    Events.findOneAndUpdate.mockResolvedValue(eventAddTransactionResPayload);

    const responseCreateEvent = await agent
      .post("/add-transaction")
      .send({
        event: "6705113fa48683cf85efebb2",
        nTickets: 5,
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect(400);

    expect(responseCreateEvent.body.error).toEqual("No event found!");
    expect(responseCreateEvent.body.message).toEqual(
      "Error in add transcation API"
    );
  });

  it("Get monthly stats of last 12 months with 200 response", async () => {
    const aggregateMock = jest
      .fn()
      .mockResolvedValue(monthlyStatsResolvedPayload);
    Events.aggregate = aggregateMock;

    const responseCreateEvent = await agent
      .get("/get-monthly-stats")
      .expect(200);

    expect(responseCreateEvent.body.stats).toEqual(monthlyStatsResolvedPayload);
    expect(responseCreateEvent.body.message).toEqual(
      "Successfully retrieved statistics for last 12 Months."
    );
  });

  it("Get no stats result with 200 response", async () => {
    const aggregateMock = jest.fn().mockResolvedValue([]);
    Events.aggregate = aggregateMock;

    const responseCreateEvent = await agent
      .get("/get-monthly-stats")
      .expect(200);

    expect(responseCreateEvent.body.stats).toEqual([]);
    expect(responseCreateEvent.body.message).toEqual(
      "There are no statistics to show."
    );
  });

  it("Get stats with error in aggregaion with 400 response", async () => {
    const aggregateMock = jest
      .fn()
      .mockRejectedValue(new Error("Error in aggregation query!"));
    Events.aggregate = aggregateMock;

    const responseCreateEvent = await agent
      .get("/get-monthly-stats")
      .expect(400);

    expect(responseCreateEvent.body.error).toEqual(
      "Error in aggregation query!"
    );
    expect(responseCreateEvent.body.message).toEqual(
      "Error in getting monthly stats API!"
    );
  });
});
