const express = require("express");
const {
  adminLogin,
  getDashboardStats,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/adminController");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/login", adminLogin);

// Protected routes
router.get("/dashboard/stats", authenticateAdmin, getDashboardStats);
router.get("/appointments", authenticateAdmin, getAppointments);
router.patch(
  "/appointments/:id/status",
  authenticateAdmin,
  updateAppointmentStatus
);
router.delete("/appointments/:id", authenticateAdmin, deleteAppointment);

module.exports = router;
