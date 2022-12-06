const { Router } = require("express");
const { getCategories, newCategory, deleteCategory } = require("../controllers/categoryController");
const { admin } = require("../middleware/admin");
const { protect } = require("../middleware/auth");
const router = Router();

// puplic routes:
router.get("/", getCategories);

// admin routes:
router.use(protect);
router.use(admin);
router.post("/", newCategory);
router.delete("/:category", deleteCategory);

module.exports = router;