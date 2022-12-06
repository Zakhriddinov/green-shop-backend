const jwt = require("jsonwebtoken");

const generateAuthToken = (_id, firstName, email, isAdmin) => {
   return jwt.sign(
      { _id, firstName, email, isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
   )
}
module.exports = generateAuthToken