const asyncHandler = require("express-async-handler");
const recordsPerPage = require("../config/pagination");
const { Product } = require("../models/productModel");
const { cloudinaryImageUploadMethod, cloudinaryImageDeleteMethod } = require("../utils/cloudinary");

// public controllers:
const getProducts = asyncHandler(async (req, res) => {
   try {
      let query = {};
      let queryCondition = false;
      const { category, priceFrom, priceTo, size } = req.query;

      let priceQueryCondition = {};
      if (priceFrom || priceTo) {
         queryCondition = true;
         if (priceFrom && priceTo) {
            priceQueryCondition = { price: { $gte: priceFrom, $lte: priceTo } }
         } else if (priceFrom) {
            priceQueryCondition = { price: { $gte: priceFrom } }
         } else if (priceTo) {
            priceQueryCondition = { price: { $lte: priceTo } }
         }
      }

      let categoryQueryCondition = {};
      if (category) {
         queryCondition = true;
         let a = category.split(",").map(item => {
            if (item) return new RegExp("^" + item)
         })
         categoryQueryCondition = {
            category: { $in: a }
         }
      }
      let searchQuery = req.params.search || ""
      let searchQueryCondition = {};
      if (searchQuery) {
         queryCondition = true;
         searchQueryCondition = {
            title: {
               $regex: searchQuery,
               $options: 'i'
            }
         }
      }

      if (queryCondition) {
         query = {
            $and: [
               priceQueryCondition,
               categoryQueryCondition,
               searchQueryCondition
            ]
         }
      }

      // sort by name, price etc
      let sort = {};
      const sortOption = req.query.sort || "";
      if (sortOption) {
         let sortOpt = sortOption.split("_");
         sort = { [sortOpt[0]]: Number(sortOpt[1]) }
      }
      // pagination
      const pageNum = Number(req.query.pageNum) || 1;
      const totalProducts = await Product.countDocuments(query)
      const products = await Product
         .find(query)
         .skip(recordsPerPage * (pageNum - 1))
         .limit(recordsPerPage)
         .sort(sort)
      return res.status(200).json({
         products,
         pageNum,
         paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage)
      })
   } catch (error) {
      console.log(error);
   }
})
const getBestSellers = asyncHandler(async (req, res) => {
   try {
      const product = await Product.aggregate([
         { $sort: { category: 1, sales: -1 } },
         { $group: { _id: "$category", doc_with_max_sales: { $first: "$$ROOT" } } },
         { $replaceWith: "$doc_with_max_sales" },
         { $match: { sales: { $gt: 0 } } },
         { $project: { _id: 1, title: 1, images: 1, price: 1 } },
         { $limit: 1 }
      ])
      res.json(product)
   } catch (error) {
      console.log(error);
   }
})
const getProductById = asyncHandler(async (req, res) => {
   try {
      const product = await Product.findById(req.params.id).populate("reviews")
      if (!product) {
         res.status(404)
         throw new Error("Berilgan IDga teng bo'lmagan toifa")
      }
      res.status(200).json(product)
   } catch (error) {
      console.log(error);
   }
})
// admin controllers:
const adminCreateProduct = asyncHandler(async (req, res) => {
   try {
      const { title, description, price, count, category, tags, size } = req.body
      if (!(title || description || price || count || category || tags || size)) {
         return res.status(400).send("Already all input")
      }

      const urls = [];
      const files = req.files;
      for (const file of files) {
         const { path } = file;
         const newPath = await cloudinaryImageUploadMethod(path);
         urls.push(newPath)
      }
      const product = new Product({
         title,
         description,
         price,
         count,
         category,
         tags,
         size,
         images: urls.map(url => url)
      });
      const products = await product.save();
      res.status(201).send(products)
   } catch (error) {
      console.log(error);
   }
})
const adminDeleteProduct = asyncHandler(async (req, res) => {
   try {
      const product = await Product.findByIdAndRemove(req.params.id);
      if (!product) {
         return res.status(404).send("Berilgan IDga teng bo'lmagan toifa");
      }
      for (const file of product.images) {
         await cloudinaryImageDeleteMethod(file)
      }
      res.status(200).json({ success: true })
   } catch (error) {
      console.log(error);
   }
})
const adminUpdateProduct = asyncHandler(async (req, res) => {
   try {
      let product = await Product.findById(req.params.id)
      const { title, description, count, price, category, size, tags } = req.body;

      const urls = [];
      if (product.images.length <= 3) {
         const files = req.files;
         for (const file of files) {
            const { path } = file;
            const newPath = await cloudinaryImageUploadMethod(path);
            urls.push(newPath)
         }
      }

      product.title = title || product.title;
      product.price = price || product.price;
      product.category = category || product.category;
      product.description = description || product.description;
      product.count = count || product.count;
      product.size = size || product.size;
      product.tags = tags || product.tags;
      product.images = urls.map(url => url) || product.images
      await product.save()
      return res.json({ new: true })
   } catch (error) {
      console.log(error);
   }
})
const adminDeleteImage = asyncHandler(async (req, res) => {
   try {
      const imagePath = req.params.imagePath;
      const file = {
         public_id: `green-shop/${imagePath}`
      }
      await cloudinaryImageDeleteMethod(file)
      await Product.findByIdAndUpdate({ _id: req.params.productId }, { $pull: { images: { public_id: `green-shop/${imagePath}` } } })
      console.log(file);
      return res.end()
   } catch (error) {
      console.log(error);
   }
});
const adminGetProducts = asyncHandler(async (req, res) => {
   try {
      const products = await Product.find({})
         .sort({ category: 1 })
         .select("title price category")
      res.status(200).json(products)
   } catch (error) {
      console.log(error);
   }
});

module.exports = {
   getProducts,
   adminCreateProduct,
   adminDeleteProduct,
   getBestSellers,
   adminGetProducts,
   getProductById,
   adminUpdateProduct,
   adminDeleteImage
}