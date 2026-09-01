const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
} = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

module.exports = router;