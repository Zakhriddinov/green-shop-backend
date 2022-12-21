const Joi = require("joi")
const asyncHandler = require("express-async-handler");
const { hashPassword, comparePasswords } = require("../utils/hashedPassword");
const generateAuthToken = require("../utils/generateAuthToken");
const { User, validateUser } = require("../models/userModel");

const register = asyncHandler(async (req, res) => {
   try {
      const { firstName, email, password } = req.body;
      const { error } = validateUser(req.body);
      if (error) {
         return res.status(400).send(error.details[0].message);
      }

      let userExists = await User.findOne({ email })
      if (userExists) {
         return res.status(400).send("user exists")
      } else {
         const hashedPassword = hashPassword(password);
         const user = await User.create({
            firstName, email, password: hashedPassword
         })
         res.header("x-auth-token", generateAuthToken(user._id, user.firstName, user.email, user.isAdmin)).status(201).json({
            _id: user._id,
            firstName: user.firstName,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateAuthToken(user._id, user.firstName, user.email, user.isAdmin)
         })
      }
   } catch (error) {
      console.log(error);
   }
})
const login = asyncHandler(async (req, res) => {
   try {
      const { error } = validate(req.body)
      if (error) {
         return res.status(400).send(error.details[0].message)
      }
      const { email, password } = req.body
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).send("Bunday foydalanuvchi mavjud emas!")
      }
      if (user && comparePasswords(password, user.password)) {
         return res.header('x-auth-token', generateAuthToken(user._id, user.firstName, user.email, user.isAdmin)).json({
            _id: user._id,
            firstName: user.firstName,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateAuthToken(user._id, user.firstName, user.email, user.isAdmin)
         })
      }
   } catch (error) {
      console.log(error);
   }
})
function validate(req) {
   const schema = Joi.object({
      email: Joi.string().min(5).max(255).required(),
      password: Joi.string().min(6).max(255).required()
   })
   return schema.validate(req)
}

module.exports = {
   register,
   login
}