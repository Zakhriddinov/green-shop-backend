const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();

require("colors");
const winston = require("winston")

// connect database
connectDB();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/prod")(app)

const PORT = process.env.PORT || 5000;
app.listen(PORT, winston.info(`Server started on port ${PORT}`));