const Order = require("../models/orderModel.js");
const ObjectId = require("mongodb").ObjectId;
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const { payOrderEmailTemplate } = require("../utils/transporter.js");
const { Product } = require("../models/productModel.js");

const getUserOrders = asyncHandler(async (req, res) => {
   try {
      const orders = await Order.find({ user: ObjectId(req.user._id) })
      res.send(orders)
   } catch (error) {
      console.log(error);
   }
})
const getOrders = asyncHandler(async (req, res) => {
   try {
      const orders = await Order.find({}).populate("user", "-password").sort({ paymentMethod: "desc" })
      res.send(orders)
   } catch (error) {
      console.log(error);
   }
})
const createOrder = asyncHandler(async (req, res) => {
   try {
      const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, orderNotes } = req.body

      if (!(orderItems || itemsPrice || totalPrice || paymentMethod)) {
         return res.status(400).send("All inputs are required")
      }
      let ids = orderItems.map((item) => {
         return item.productID
      })
      let qty = orderItems.map(item => {
         return Number(item.quantity)
      })
      await Product.find({ _id: { $in: ids } }).then(products => {
         products.forEach(function (product, idx) {
            product.sales += qty[idx];
            product.save();
         })
      })
      const newOrder = new Order({
         orderItems: orderItems.map((x) => ({ ...x })),
         shippingAddress: shippingAddress,
         paymentMethod: paymentMethod,
         itemsPrice: itemsPrice,
         shippingPrice: shippingPrice,
         taxPrice: taxPrice,
         totalPrice: totalPrice,
         orderNotes,
         user: ObjectId(req.user._id),
      })
      const order = await newOrder.save();
      res.status(201).send(order)
   } catch (error) {
      console.log(error);
   }
})
const getOrder = asyncHandler(async (req, res) => {
   try {
      const order = await Order.findById(req.params.id)
      if (order) {
         res.send(order)
      } else {
         res.status(404).send({ message: "Order Not found" })
      }
   } catch (error) {
      console.log(error);
   }
})
const updateOrderToPaid = asyncHandler(async (req, res) => {
   try {
      const order = await Order.findById(req.params.id).populate(
         'user',
         'email firstName'
      );
      if (order) {
         order.isPaid = true;
         order.paidAt = Date.now();
         order.paymentResult = {
            id: req.body._id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
         }
         const updateOrder = await order.save();
         var smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
               user: process.env.FROM_USER_EMAIL,
               pass: process.env.FROM_USER_PASSWORD
            },
            port: 465,
            host: "smtp.gmail.com"
         });
         var mailOptions = {
            from: process.env.FROM_USER_EMAIL,
            to: order.user.email,
            subject: `${order.user.email}`,
            text: "Hello world",
            html: payOrderEmailTemplate(order)
         }

         smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
               console.log(error);
            } else {
               console.log("Message sent: " + response.message);
            }
         });

         res.send({ order: updateOrder });
      }
   } catch (error) {
      console.log(error);
   }
})
const deleteOrder = asyncHandler(async (req, res) => {
   try {
      const order = await Order.findById(req.params.id)
      if (order) {
         await order.remove();
         res.send({ success: true })
      }
   } catch (error) {
      console.log(error);
   }
})
const updateOrderToDelivered = asyncHandler(async (req, res) => {
   try {
      const order = await Order.findById(req.params.id);
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updateOrder = await order.save();
      res.send(updateOrder)
   } catch (error) {
      console.log(error);
   }
})
const getOrderForAnalysis = asyncHandler(async (req, res) => {
   try {
      const start = new Date(req.params.date);
      start.setHours(0, 0, 0, 0)
      const end = new Date(req.params.date)
      end.setHours(23, 59, 59, 999)
      const order = await Order.find({
         createAt: {
            $gte: start,
            $lte: end
         }
      }).sort({ createAt: "asc" });
      res.send(order)
   } catch (error) {
      console.log(error);
   }
})

module.exports = {
   getUserOrders,
   getOrders,
   createOrder,
   getOrder,
   updateOrderToPaid,
   deleteOrder,
   updateOrderToDelivered,
   getOrderForAnalysis
}