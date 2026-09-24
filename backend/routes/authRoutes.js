const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail
} = require("../controllers/authController");
const { rateLimit } = require("../middleware/securityMiddleware");

const router = express.Router();

router.post("/register", rateLimit({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "register" }), registerUser);
router.post("/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "login" }), loginUser);
router.post("/password-reset/request", rateLimit({ windowMs: 60 * 60 * 1000, max: 5, keyPrefix: "reset" }), requestPasswordReset);
router.post("/password-reset/confirm", rateLimit({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "reset-confirm" }), resetPassword);
router.post("/verify-email", rateLimit({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "verify" }), verifyEmail);

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "You are authenticated!",
    user: req.user
  });
});

module.exports = router;
