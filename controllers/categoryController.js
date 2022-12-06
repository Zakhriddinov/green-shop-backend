const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");

// public routes:
const getCategories = asyncHandler(async (req, res) => {
   try {
      const categories = await Category.find().sort({ name: "asc" })
      return res.json(categories)
   } catch (error) {
      console.log(error);
   }
})
// admin routes:
const newCategory = asyncHandler(async (req, res) => {
   try {
      const { category } = req.body
      if (!category) {
         return res.status(400).send("Category input is requried")
      }
      const categoryExists = await Category.findOne({ name: category });
      if (categoryExists) {
         return res.status(400).send("Category already exists")
      } else {
         const categoryCreated = await Category.create({
            name: category
         })
         res.status(201).send({ categoryCreated })
      }
   } catch (error) {
      console.log(error);
   }
})
const deleteCategory = asyncHandler(async (req, res) => {
   try {
      if (req.params.category !== "Choose category") {
         const categoryExists = await Category.findOne({
            name: decodeURIComponent(req.params.category)
         })
         await categoryExists.remove()
         res.json({ categoryDeleted: true })
      }
   } catch (error) {
      console.log(error);
   }
})
module.exports = {
   getCategories,
   newCategory,
   deleteCategory
}