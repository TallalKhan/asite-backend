# Asite Backend

A brief description of what this project does and who it's for

Asite is an apllication that helps to create events and book them. Asite backend has Restful Endpoints implemented using Node and Express.

The primary functionality involves 3 major actions:

- Adding a new event
- Recording a ticket transaction for an existing event
- Retrieving statistics around ticket sales

## Run Locally

Clone the project

```bash
  git clone https://github.com/TallalKhan/asite-backend.git
```

Go to the project directory

```bash
  cd asite-backend
```

Install dependencies

```bash
  npm install
```

Start the server for production

```bash
  npm start
```

Start the server for development

```bash
  npm run dev
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`APP_NAME`
`PROD_PORT`
`DEV_PORT`
`MONGO_URI`
`LOG_LEVEL`
`NODE_ENV`

## API Reference

#### Create an event

```http
  POST /create-event
```

| Req Body        | Type     | Description                          |
| :-------------- | :------- | :----------------------------------- |
| `name`          | `string` | **Required**. Name of event          |
| `date`          | `string` | **Required**. Date of event          |
| `capacity`      | `number` | **Required**. Total tickets of event |
| `costPerTicket` | `number` | **Required**. Price per ticket       |

#### Add transaction

```http
  POST /add-transaction
```

| Req Body   | Type     | Description                           |
| :--------- | :------- | :------------------------------------ |
| `event`    | `string` | **Required**. Unique event identifier |
| `nTickets` | `number` | **Required**. Number of tickets       |

#### Get monthly stats for last 12 months

```http
  GET /get-monthly-stats
```

| Req Body   | Type     | Description                           |
| :--------- | :------- | :------------------------------------ |
| `event`    | `string` | **Required**. Unique event identifier |
| `nTickets` | `number` | **Required**. Number of tickets       |

## API Documentation

[Postman Documentation](https://documenter.getpostman.com/view/5346627/2sAXxQeXiY)

## Tech Stack

**Server:** Node, Express

**Database:** MongoDB

**Test:** Jest

**Logs:** Winston

**API:** Postman

## Authors

- [@tallalkhan](https://github.com/TallalKhan)
