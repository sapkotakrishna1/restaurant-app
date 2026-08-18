const express = require("express");


const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  cancelMyOrder
} = require("../controllers/orderController");

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");


// Create order
router.post(
  "/",
  authMiddleware,
  createOrder
);


// My orders
router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);


// All orders
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// Customer cancels own order

router.put(
  "/:id/cancel",
  authMiddleware,
  cancelMyOrder
);

// Update order status
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);


// Admin dashboard statistics

router.get(
  "/dashboard/stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);




module.exports = router;