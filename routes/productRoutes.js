const { Router } = require("express");
const { getProducts, adminCreateProduct, adminDeleteProduct, getBestSellers, adminGetProducts, getProductById, adminUpdateProduct, adminDeleteImage } = require("../controllers/productController");
const { admin } = require("../middleware/admin");
const { protect } = require("../middleware/auth");
const upload = require("../utils/multer");
const router = Router();

// public routes:

router.get("/", getProducts);
router.get("/bestsellers", getBestSellers);
router.get("/get-one/:id", getProductById);

// admin routes:
router.use(protect);
router.use(admin);
router.get("/admin", adminGetProducts)
router.post("/admin", upload.array("images", 3), adminCreateProduct);
router.put("/admin/:id", upload.array("images", 3), adminUpdateProduct);
router.delete("/admin/:id", adminDeleteProduct);
router.delete("/admin/image/:imagePath/:productId", adminDeleteImage);

module.exports = router;