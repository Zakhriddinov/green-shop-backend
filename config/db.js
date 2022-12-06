const mongoose = require("mongoose");
require("dotenv").config();
const winston = require("winston");

const connectDB = async () => {
   try {
      const connecting = await mongoose.connect(process.env.MONGO_URI)
      winston.debug(`MongoDB connect to: ${connecting.connection.host}`.cyan.underline);
   } catch (error) {
      winston.error(`Error: ${error.message}`.red.underline);
      process.exit(1);
   }
}
module.exports = connectDB