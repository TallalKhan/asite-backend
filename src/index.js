require("dotenv").config();
const createServer = require("./server");

const mongoose = require("mongoose");

const isDevelopment = process.env.NODE_ENV === "development";

// If running on production you can use different port for development
const port = isDevelopment
  ? process.env.DEV_PORT
  : process.env.PROD_PORT || 8080;

let mongoString = process.env.MONGO_URI;

// Connection options
const options = {};

// Establish the connection
mongoose
  .connect(mongoString, options)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);

    // Handle specific error conditions
    if (error.name === "MongoNetworkError") {
      console.error("Network error occurred. Check your MongoDB server.");
    } else if (error.name === "MongooseServerSelectionError") {
      console.error(
        "Server selection error. Ensure" + " MongoDB is running and accessible."
      );
    } else {
      // Handle other types of errors
      console.error("An unexpected error occurred:", error);
    }
  });

createServer().listen(port, () => {
  console.log(
    `Server started on ${port} in ${process.env.NODE_ENV} environment`
  );
});
