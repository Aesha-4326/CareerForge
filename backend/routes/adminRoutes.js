const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getPlacementAnalytics,
  getStudentRoster,
  getUsers,
  updateUserAccount,
  getDrives,
  createDrive,
  updateDrive,
  deleteDrive
} = require("../controllers/adminController");

const router = express.Router();

// Strict Admin-only RBAC Middleware
router.use(protect, authorize("admin"));

router.get("/analytics", getPlacementAnalytics);
router.get("/students", getStudentRoster);
router.get("/users", getUsers);
router.patch("/users/:id", updateUserAccount);
router.get("/drives", getDrives);
router.post("/drives", createDrive);
router.put("/drives/:id", updateDrive);
router.delete("/drives/:id", deleteDrive);

module.exports = router;
