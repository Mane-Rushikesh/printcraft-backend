const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

// ===============================
// CUSTOMER ROUTES
// ===============================

// Create Order
router.post(
  "/",
  authMiddleware,
  createOrder
);

// My Orders
router.get(
  "/user/:user_id",
  authMiddleware,
  getMyOrders
);


// ===============================
// ADMIN ROUTES
// IMPORTANT: These must come BEFORE /:id
// ===============================

// Get All Orders
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// Update Order Status
router.put(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);


// ===============================
// ORDER DETAILS
// ===============================

router.get(
  "/:id",
  authMiddleware,
  getOrderDetails
);

module.exports = router;