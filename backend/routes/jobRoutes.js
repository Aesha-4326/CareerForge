const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getJobs,
  getMyJobs,
  createJob,
  applyJob,
  getApplications,
  updateApplicationStatus
} = require("../controllers/jobController");

const router = express.Router();

router.get("/", getJobs);
router.get("/mine", protect, authorize("company"), getMyJobs);
router.post("/", protect, authorize("company", "admin"), createJob);
router.post("/apply", protect, authorize("student", "admin"), applyJob);
router.get("/applications", protect, getApplications);
router.patch("/applications/:id", protect, authorize("company", "admin"), updateApplicationStatus);

module.exports = router;
