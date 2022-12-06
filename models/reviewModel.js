const { model, Schema } = require("mongoose");
const Joi = require("joi")

const reviewSchema = Schema({
   comment: { type: String, required: true },
   rating: { type: Number, required: true },
   user: {
      _id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true }
   }
}, {
   timestamps: true
})

function validatedReview(review) {
   const schema = Joi.object({
      comment: Joi.string().min(4).required(),
      rating: Joi.number().required()
   })
   schema.validate(review)
}
const Review = model("Review", reviewSchema);
module.exports = { Review, validatedReview };