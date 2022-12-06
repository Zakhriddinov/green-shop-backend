const { User, validateUser } = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { hashPassword } = require("../utils/hashedPassword");
const { cloudinary } = require("../utils/cloudinary");
const { Review, validatedReview } = require("../models/reviewModel");
const { Product } = require("../models/productModel");

// user controllers:
const getMe = asyncHandler(async (req, res) => {
   try {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
         return res.status(404).send("Bunday foydalanuvchi mavjud emas")
      }
      return res.send(user)
   } catch (error) {
      console.log(error);
   }
})
const userProfileChange = asyncHandler(async (req, res) => {
   try {
      const { error } = validateUser(req.body);
      if (error) {
         return res.status(400).send(error.details[0].message)
      }

      const user = await User.findById(req.user._id)
      user.firstName = req.body.firstName || user.firstName
      user.email = req.body.email || user.email
      user.lastName = req.body.lastName
      user.phone = req.body.phone
      user.country = req.body.country
      user.city = req.body.city
      user.address = req.body.address
      user.state = req.body.state
      user.zipCode = req.body.zipCode
      if (req.body.password !== user.password) {
         user.password = hashPassword(req.body.password)
      }
      await user.save();

      res.json({
         _id: user._id,
         firstName: user.firstName,
         email: user.email,
         isAdmin: user.isAdmin
      })
   } catch (error) {
      console.log(error);
   }
})
const uploadImage = asyncHandler(async (req, res) => {
   try {
      let user = await User.findById(req.params.id);

      // Delete image from cloduniary
      if (user.cloudinary_id) {
         await cloudinary.uploader.destroy(user.cloudinary_id)
      }
      // Upload image to cloudinary
      let result;
      if (req.file) {
         result = await cloudinary.uploader.upload(req.file.path, { folder: "green-shop" })
      }
      const data = {
         avatar: result?.secure_url || user.avatar,
         cloudinary_id: result?.public_id || user.cloudinary_id
      }
      user = await User.findByIdAndUpdate(req.params.id, data, { new: true })
      res.json(user)
   } catch (error) {
      console.log(error);
   }
})

// admin controllers:
const deleteUser = asyncHandler(async (req, res) => {
   try {
      const user = await User.findByIdAndRemove(req.params.id)
      if (!user) {
         return res.status(404).send("Berilgan IDga teng bo'lmagan toifa")
      }
      await cloudinary.uploader.destroy(user.cloudinary_id)
      res.status(200).send({ success: true })
   } catch (error) {
      console.log(error);
   }
})
const getUsers = asyncHandler(async (req, res) => {
   try {
      const users = await User.find({}).select("-password")
      return res.json(users)
   } catch (error) {
      console.log(error);
   }
})
const getUser = asyncHandler(async (req, res) => {
   try {
      const user = await User.findById(req.params.id).select("firstName email isAdmin")
      if (!user) {
         return res.status(404).send("User not found")
      }
      return res.send(user)
   } catch (error) {
      console.log(error);
   }
})

// write review
const writeReview = async (req, res) => {
   try {

      let session = await Review.startSession();

      // get comment, rating from request.body:
      const { comment, rating } = req.body;
      // validate request:
      if (!(comment && rating)) {
         return res.status(400).send("All inputs are required");
      }

      // create review id manually because it is needed also for saving in Product collection
      const ObjectId = require("mongodb").ObjectId;
      let reviewId = ObjectId();

      session.startTransaction();
      await Review.create([
         {
            _id: reviewId,
            comment: comment,
            rating: Number(rating),
            user: { _id: req.user._id, name: req.user.firstName }
         }
      ], { session: session })

      const product = await Product.findById(req.params.productId).populate("reviews").session(session);

      const alreadyReviewed = product.reviews.find((r) => r.user._id.toString() === req.user._id.toString());
      if (alreadyReviewed) {
         await session.abortTransaction();
         session.endSession();
         return res.status(400).send("product already reviewed");
      }

      let prc = [...product.reviews];
      prc.push({ rating: rating });
      product.reviews.push(reviewId);
      if (product.reviews.length === 1) {
         product.rating = Number(rating);
         product.reviewsNumber = 1;
      } else {
         product.reviewsNumber = product.reviews.length;
         let ratingCalc = prc.map((item) => Number(item.rating)).reduce((sum, item) => sum + item, 0) / product.reviews.length;
         product.rating = Math.round(ratingCalc)
      }
      await product.save();

      await session.commitTransaction();
      session.endSession();
      res.send('review created')
   } catch (err) {
      await session.abortTransaction();
      console.log(err)
   }
}
module.exports = {
   getMe,
   deleteUser,
   getUsers,
   getUser,
   userProfileChange,
   uploadImage,
   writeReview
}