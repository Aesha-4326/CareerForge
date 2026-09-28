const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  generateAndSaveRoadmap,
  generateRoadmapPreview,
  answerCareerQuestionPreview,
  answerCareerQuestionAuthenticated,
  getLatestRoadmap,
  getRoadmapHistory
} = require("../controllers/guidanceController");

const router = express.Router();

router.post("/preview", generateRoadmapPreview);
router.post("/ask", answerCareerQuestionPreview);
router.use(protect, authorize("student", "admin"));

router.post("/generate", generateAndSaveRoadmap);
router.post("/ask-authenticated", answerCareerQuestionAuthenticated);
router.get("/latest", getLatestRoadmap);
router.get("/history", getRoadmapHistory);

module.exports = router;
