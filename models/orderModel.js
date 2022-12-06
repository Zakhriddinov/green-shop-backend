const { model, Schema } = require("mongoose");

const orderSchema = Schema({
   user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
   },
   itemsPrice: { type: Number, required: true },
   shippingPrice: { type: Number, required: true },
   totalPrice: { type: Number, required: true },
   orderItems: [
      {
         title: { type: String, required: true },
         price: { type: String, required: true },
         image: { type: String },
         quantity: { type: String, required: true },
         count: { type: Number, required: true }
      }
   ],
   orderNotes: {
      type: String
   },
   shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: {
         type: String,
         required: true
      },
      country: {
         type: String,
         required: true
      },
      zipCode: {
         type: String,
         required: true
      },
      city: {
         type: String,
         required: true
      },
      state: {
         type: String,
         required: true
      },
      phone: {
         type: String,
         required: true
      },
      location: {
         lat: Number,
         lng: Number,
         address: String,
         name: String,
         vicinity: String,
         googleAddressId: String
      }
   },
   paymentMethod: {
      type: String,
      required: true
   },
   transactionResult: {
      status: { type: String },
      createTime: { type: String },
      amount: { type: Number }
   },
   taxPrice: {
      type: Number,
      required: true
   },
   isPaid: {
      type: Boolean,
      required: true,
      default: false
   },
   paidAt: {
      type: Date
   },
   isDelivered: {
      type: Boolean,
      required: true,
      default: false
   },
   deliveredAt: {
      type: Date
   },
   paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
   }
}, {
   timestamps: true
})

const Order = model("Order", orderSchema);
module.exports = Order;