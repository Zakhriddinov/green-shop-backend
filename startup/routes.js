const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { errorHandler } = require("../middleware/errorMiddleware");
const jwt = require("jsonwebtoken");
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
   app.get('/api/v1/get-token', (req, res) => {
      try {
         const accessToken = req.headers.authorization.split(' ')[1]
         const decoted = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
         return res.json({ token: decoted.email, isAdmin: decoted.isAdmin })
      } catch (error) {
         return res.status(401).send("Unauthorized. Invalid Token");
      }
   });

   app.use("/api/v1/products", require("../routes/productRoutes"));
   app.use("/api/v1/users", require("../routes/userRoutes"));
   app.use("/api/v1/categories", require("../routes/categoryRoutes"));
   app.use("/api/v1/orders", require("../routes/orderRoutes"));
   app.use(errorHandler)
}