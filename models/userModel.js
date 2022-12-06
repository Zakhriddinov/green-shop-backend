const { model, Schema } = require("mongoose");
const Joi = require("joi");


const userSchema = Schema({
   firstName: {
      type: String,
      required: true
   },
   lastName: {
      type: String,
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   phone: {
      type: String
   },
   avatar: {
      String
   },
   cloudinary_id: {
      type: String
   },
   country: {
      type: String
   },
   city: {
      type: String
   },
   address: {
      type: String
   },
   state: {
      type: String
   },
   zipCode: {
      type: Number
   },
   password: {
      type: String,
      required: true
   },
   isAdmin: {
      type: Boolean,
      required: true,
      default: false
   }
}, {
   timestamps: true
})

function validateUser(user) {
   const schema = Joi.object({
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string(),
      email: Joi.string().min(5).max(255).required(),
      password: Joi.string().min(6).max(255).required(),
      city: Joi.string(),
      zipCode: Joi.number(),
      address: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      phone: Joi.string().min(9).max(255)
   })
   return schema.validate(user);
}
const User = model("User", userSchema);
module.exports = { User, validateUser }