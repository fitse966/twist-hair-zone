const express = require("express");
const {
  getAvailableDates,
  getDeletedSlots,
  deleteDateSlot,
  restoreDateSlot,
} = require("../controllers/dateController");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

// Protected routes
router.get("/available-dates", authenticateAdmin, getAvailableDates);
router.get("/deleted-slots", authenticateAdmin, getDeletedSlots);
router.delete("/slot/:date/:time_slot", authenticateAdmin, deleteDateSlot);
router.post("/restore-slot", authenticateAdmin, restoreDateSlot);

module.exports = router;
