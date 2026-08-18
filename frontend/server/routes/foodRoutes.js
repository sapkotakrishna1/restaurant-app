const express = require("express");

const router = express.Router();

const {
  getFoods,
  createFood,
  updateFood,
  deleteFood
} = require("../controllers/foodController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", getFoods);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createFood
);

router.put("/:id", updateFood);

router.delete("/:id", deleteFood);

module.exports = router;