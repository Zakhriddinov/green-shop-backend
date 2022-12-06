const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { errorHandler } = require("../middleware/errorMiddleware");

module.exports = function (app) {
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: false }))
   app.use(cors());
   app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
   }));
   app.use(morgan('tiny'));

   // routes:
   app.use("/api/v1/products", require("../routes/productRoutes"));
   app.use("/api/v1/users", require("../routes/userRoutes"));
   app.use("/api/v1/categories", require("../routes/categoryRoutes"));
   app.use("/api/v1/orders", require("../routes/orderRoutes"));
   app.use(errorHandler)
}