const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  analyzeResume,
  saveResume,
  getCurrentResume,
  getResumeHistory,
  deleteCurrentResume
} = require("../controllers/resumeController");

const router = express.Router();

router.use(protect, authorize("student", "admin"));

router.post("/analyze", analyzeResume);
router.post("/save", saveResume);
router.get("/latest", getCurrentResume);
router.get("/history", getResumeHistory);
router.delete("/latest", deleteCurrentResume);

module.exports = router;
