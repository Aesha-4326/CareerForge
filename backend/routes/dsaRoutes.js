const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  submitSolution,
  getDsaStats,
  getSubmissionHistory
} = require("../controllers/dsaController");

const router = express.Router();

router.use(protect, authorize("student", "admin"));

router.post("/submit", submitSolution);
router.get("/stats", getDsaStats);
router.get("/history", getSubmissionHistory);

module.exports = router;
