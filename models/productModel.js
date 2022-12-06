const { model, Schema } = require("mongoose");

const productSchema = Schema({
   title: {
      type: String,
      requried: true
   },
   description: {
      type: String,
      required: true
   },
   price: {
      type: Number,
      requried: true
   },
   rating: {
      type: Number
   },
   count: {
      type: Number,
      required: true
   },
   size: [
      {
         type: String,
         enum: ["s", "m", "l", "xl"],
         required: true
      }
   ],
   tags: [
      {
         type: String,
         required: true
      }
   ],
   category: {
      type: String,
      required: true
   },
   reviewsNumber: {
      type: Number,
      default: 0,
   },
   sales: {
      type: Number,
      default: 0
   },
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: "Review"
      }
   ],
   images: { type: Object }
}, {
   timestamps: true
});

const Product = model("Product", productSchema);
module.exports = { Product };