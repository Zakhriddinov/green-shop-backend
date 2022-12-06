const { Router } = require("express");
const { getOrders, getUserOrders, createOrder, getOrder, updateOrderToPaid, deleteOrder, updateOrderToDelivered, getOrderForAnalysis } = require("../controllers/orderController");
const { admin } = require("../middleware/admin");
const { protect } = require("../middleware/auth");
const router = Router();

// user routes:
router.use(protect);
router.get("/", getUserOrders);
router.get("/user/:id", getOrder)
router.post("/", createOrder);
router.put("/:id/pay", updateOrderToPaid)

// admin routes:
router.use(protect)
router.use(admin)
router.get("/admin", getOrders)
router.delete("/admin/:id", deleteOrder);
router.put("/:id/deliver", updateOrderToDelivered)
router.put("/analysis/:date", getOrderForAnalysis)
module.exports = router;