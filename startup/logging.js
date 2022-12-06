require("winston-mongodb");
const winston = require("winston");

module.exports = function () {
   winston.add(new winston.transports.Console())
   winston.add(new winston.transports.File({ filename: "log/vd-log.log", level: 'error' }))
   winston.add(new winston.transports.MongoDB({ db: process.env.MONGO_URI, level: 'info' }))
   winston.exceptions.handle(new winston.transports.Console(), new winston.transports.File({ filename: "log/vd-log.log" }))

   process.on("unhandledRejection", ex => {
      throw ex
   });
}