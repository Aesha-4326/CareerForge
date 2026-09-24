const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  submitSolution,
  runCode,
  getDsaStats,
  getSubmissionHistory
} = require("../controllers/dsaController");

const router = express.Router();

router.use(protect, authorize("student", "admin"));

router.post("/run", runCode);
router.post("/submit", submitSolution);
router.get("/stats", getDsaStats);
router.get("/history", getSubmissionHistory);

module.exports = router;
