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

const path = require("path");
if (process.env.NODE_ENV === "production") {
   app.get("/", (req, res) => {
      res.json({ message: "API running..." });
   })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, winston.info(`Server started on port ${PORT}`));