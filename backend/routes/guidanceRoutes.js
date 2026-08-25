const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  generateAndSaveRoadmap,
  generateRoadmapPreview,
  getLatestRoadmap,
  getRoadmapHistory
} = require("../controllers/guidanceController");

const router = express.Router();

router.post("/preview", generateRoadmapPreview);
router.use(protect, authorize("student", "admin"));

router.post("/generate", generateAndSaveRoadmap);
router.get("/latest", getLatestRoadmap);
router.get("/history", getRoadmapHistory);

module.exports = router;
