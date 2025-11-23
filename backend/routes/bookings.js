const express = require("express");
const {
  getAvailability,
  createBooking,
} = require("../controllers/bookingController");

const router = express.Router();

// Public routes for customer bookings
router.get("/availability", getAvailability);
router.post("/", createBooking);

module.exports = router;
