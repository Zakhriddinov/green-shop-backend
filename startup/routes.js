const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { errorHandler } = require("../middleware/errorMiddleware");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

module.exports = function (app) {
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: false }))
   app.use(cors());
   app.use(cookieParser());
   app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
   }));
   app.use(morgan('tiny'));

   // routes:
   app.get("/api/v1/get-token", (req, res) => {
      try {
         const accessToken = req.cookies["access_token"];
         const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
         return res.json({ token: decoded.email, isAdmin: decoded.isAdmin });
      } catch (err) {
         return res.status(401).send("Unauthorized. Invalid Token");
      }
   })

   app.get("/api/v1/logout", (req, res) => {
      return res.clearCookie("access_token").send("access token cleared");
   });

   app.use("/api/v1/products", require("../routes/productRoutes"));
   app.use("/api/v1/users", require("../routes/userRoutes"));
   app.use("/api/v1/categories", require("../routes/categoryRoutes"));
   app.use("/api/v1/orders", require("../routes/orderRoutes"));
   app.use(errorHandler)
}