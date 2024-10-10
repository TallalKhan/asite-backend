/* Winston for logging important and helpful logs */

require("dotenv").config();
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  defaultMeta: { service: process.env.APP_NAME },
  transports: [new winston.transports.Console()],
});
module.exports = { logger };
