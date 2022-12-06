const { Router } = require("express");
const { register, login } = require("../controllers/authController");
const { getMe, deleteUser, getUsers, getUser, userProfileChange, uploadImage, writeReview } = require("../controllers/userController");
const { admin } = require("../middleware/admin");
const { protect } = require("../middleware/auth");
const upload = require("../utils/multer");
const router = Router();

// public routes:
router.post("/register", register);
router.post("/login", login);

// user route: 
router.get("/me", protect, getMe);
router.put("/profile", protect, userProfileChange);
router.put("/profile/:id", protect, upload.single("images"), uploadImage);
router.post("/review/:productId", protect, writeReview)

// admin route:
router.use(protect);
router.use(admin);
router.delete("/admin/:id", deleteUser);
router.get("/admin", getUsers);
router.get("/admin/:id", getUser);

module.exports = router;