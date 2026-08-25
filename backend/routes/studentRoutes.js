const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getStudentProfile,
  updateStudentProfile
} = require("../controllers/studentController");

const router = express.Router();

router.use(protect, authorize("student", "admin"));

router.get("/profile", getStudentProfile);
router.put("/profile", updateStudentProfile);

module.exports = router;
