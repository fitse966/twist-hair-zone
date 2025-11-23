const { getDb } = require("../config/database");
const {
  getAvailableTimeSlots,
  isWeekend,
  formatDisplayDate,
  TIME_SLOTS,
} = require("../utils/timeSlots");

// Get available booking dates and slots
const getAvailability = async (req, res) => {
  try {
    const db = getDb();
    const availableDates = [];

    // Get next 8 weekends
    const weekendDates = require("../utils/timeSlots").getAvailableDates();

    console.log("📅 Weekend dates to check for booking:", weekendDates);

    // Check availability for each date
    for (const date of weekendDates) {
      // Get available slots (this function already checks disabled_slots table)
      const availableSlots = await getAvailableTimeSlots(db, date);

      console.log(`📅 ${date} - Available for booking:`, availableSlots);

      if (availableSlots.length > 0) {
        availableDates.push({
          date,
          displayDate: formatDisplayDate(date),
          availableSlots: availableSlots.map((slot) => ({
            value: slot,
            display: slot,
          })),
        });
      }
    }

    console.log(
      `✅ Booking page: ${availableDates.length} dates with available slots`
    );

    res.json({
      success: true,
      data: availableDates,
    });
  } catch (error) {
    console.error("Availability error:", error);

    // Fallback to sample data
    const weekendDates = require("../utils/timeSlots").getAvailableDates();
    const availableDates = weekendDates.map((date) => ({
      date,
      displayDate: formatDisplayDate(date),
      availableSlots: TIME_SLOTS.map((slot) => ({
        value: slot,
        display: slot,
      })),
    }));

    res.json({
      success: true,
      data: availableDates,
      note: "Development Mode - Sample Data",
    });
  }
};

// Create new booking
const createBooking = async (req, res) => {
  try {
    const db = getDb();
    const { name, email, phone, message, date, time_slot } = req.body;

    // Validation
    if (!name || !email || !phone || !date || !time_slot) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate time slot format
    if (!TIME_SLOTS.includes(time_slot)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time slot format",
      });
    }

    // Check if date is weekend
    if (!isWeekend(date)) {
      return res.status(400).json({
        success: false,
        message: "Bookings are only available on weekends",
      });
    }

    // ✅ CHECK IF SLOT IS DISABLED IN DATE CONTROLLER
    const [disabledSlots] = await db.execute(
      "SELECT time_slot FROM disabled_slots WHERE date = ? AND time_slot = ? AND enabled = 0",
      [date, time_slot]
    );

    if (disabledSlots.length > 0) {
      console.log(`❌ Booking rejected: ${date} - ${time_slot} is disabled`);
      return res.status(400).json({
        success: false,
        message:
          "This time slot is currently unavailable. Please choose another time.",
      });
    }

    // Check if user already has a booking for this date
    const [existingBookings] = await db.execute(
      "SELECT id FROM appointments WHERE email = ? AND date = ?",
      [email, date]
    );

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "❌ You already have a booking for this day. Please choose another date.",
      });
    }

    // Check if slot is available (not booked by others)
    const availableSlots = await getAvailableTimeSlots(db, date);
    if (!availableSlots.includes(time_slot)) {
      return res.status(400).json({
        success: false,
        message: "Selected time slot is no longer available",
      });
    }

    // Create booking
    const [result] = await db.execute(
      `INSERT INTO appointments (name, email, phone, message, date, time_slot, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [name, email, phone, message || "", date, time_slot]
    );

    console.log(`✅ New booking created: ${name} for ${date} at ${time_slot}`);

    res.json({
      success: true,
      message:
        "🎉 Your appointment request has been submitted successfully! We'll contact you soon.",
      bookingId: result.insertId,
    });
  } catch (error) {
    console.error("Booking error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "This time slot has already been booked by another customer",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating booking. Please try again.",
    });
  }
};

module.exports = {
  getAvailability,
  createBooking,
};
