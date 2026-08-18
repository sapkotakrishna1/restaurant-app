const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/authController");

const {
  googleAuth
} = require("../controllers/googleAuthController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// ===============================
// REGISTER
// ===============================

router.post(
  "/register",
  registerUser
);


// ===============================
// LOGIN
// ===============================

router.post(
  "/login",
  loginUser
);


// ===============================
// GOOGLE AUTH
// ===============================

router.post(
  "/google",
  googleAuth
);


// ===============================
// PROFILE
// ===============================

router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "You are authenticated",
      user: req.user
    });
  }
);


// ===============================
// ADMIN TEST
// ===============================

router.get(
  "/admin-test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.user
    });
  }
);


module.exports = router;