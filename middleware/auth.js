const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
         token = req.headers.authorization.split(' ')[1]
         if (!token) {
            return res.status(403).send("A token is required authentication")
         }
         try {
            const decoted = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = await User.findById(decoted._id).select("-password")
            next()
         } catch (error) {
            return res.status(401).send("Unauthorized. Invalid Token")
         }

      } catch (error) {
         console.log(error);
         res.status(401)
         throw new Error("Not Authorized")
      }
   }
})

module.exports = { protect }