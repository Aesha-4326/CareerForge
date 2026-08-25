const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  analyzeAndSaveResume,
  getCurrentResume,
  getResumeHistory
} = require("../controllers/resumeController");

const router = express.Router();

router.use(protect, authorize("student", "admin"));

router.post("/analyze", analyzeAndSaveResume);
router.get("/latest", getCurrentResume);
router.get("/history", getResumeHistory);

module.exports = router;
