const { getDb } = require("../config/database");
const {
  getAvailableDates: getSystemDates,
  TIME_SLOTS,
} = require("../utils/timeSlots");
const moment = require("moment-timezone");

// Helper function to format display date
const formatDisplayDate = (dateStr) => {
  return moment(dateStr)
    .tz(process.env.TIMEZONE || "America/Winnipeg")
    .format("dddd, MMMM D, YYYY");
};

// Get all available dates and slots
const getAvailableDates = async (req, res) => {
  try {
    const db = getDb();

    // Get system available dates (8 weekend dates)
    const systemDates = getSystemDates();
    console.log("📅 System dates from timeSlots:", systemDates);

    // Get disabled slots from database
    const [disabledSlots] = await db.execute(
      "SELECT date, time_slot FROM disabled_slots WHERE enabled = 0"
    );

    console.log("🚫 Disabled slots from database:", disabledSlots);

    // Create availability structure
    const availability = [];

    for (const date of systemDates) {
      // Find disabled slots for this date
      const disabledForDate = disabledSlots.filter((slot) => {
        const slotDate =
          slot.date instanceof Date
            ? moment(slot.date).format("YYYY-MM-DD")
            : slot.date;
        return slotDate === date;
      });

      console.log(
        `📅 ${date} - Disabled slots:`,
        disabledForDate.map((s) => s.time_slot)
      );

      // Create slots array with availability status
      const allSlots = TIME_SLOTS.map((slot) => {
        const isDisabled = disabledForDate.some(
          (disabled) => disabled.time_slot === slot
        );
        return {
          value: slot,
          display: slot,
          available: !isDisabled,
          disabled: isDisabled,
        };
      });

      const availableSlotsCount = allSlots.filter(
        (slot) => slot.available
      ).length;
      const disabledSlotsCount = allSlots.filter(
        (slot) => !slot.available
      ).length;

      availability.push({
        date: date,
        displayDate: formatDisplayDate(date),
        availableSlots: allSlots,
        bookedCount: 0,
        disabledCount: disabledSlotsCount,
        totalSlots: TIME_SLOTS.length,
        availableSlotsCount: availableSlotsCount,
      });
    }

    console.log("✅ Final availability data:", availability.length, "dates");

    res.json({
      success: true,
      data: availability,
    });
  } catch (error) {
    console.error("Get available dates error:", error);

    // Fallback to sample data
    const systemDates = getSystemDates();
    const availability = systemDates.map((date) => ({
      date: date,
      displayDate: formatDisplayDate(date),
      availableSlots: TIME_SLOTS.map((slot) => ({
        value: slot,
        display: slot,
        available: true,
        disabled: false,
      })),
      bookedCount: 0,
      disabledCount: 0,
      totalSlots: TIME_SLOTS.length,
      availableSlotsCount: TIME_SLOTS.length,
    }));

    res.json({
      success: true,
      data: availability,
      note: "Development Mode - Sample Data",
    });
  }
};

// Get deleted slots
const getDeletedSlots = async (req, res) => {
  try {
    const db = getDb();

    const [deletedSlots] = await db.execute(
      "SELECT * FROM disabled_slots WHERE enabled = 0 ORDER BY date, time_slot"
    );

    // Format dates properly for frontend
    const formattedSlots = deletedSlots.map((slot) => {
      const dateStr =
        slot.date instanceof Date
          ? moment(slot.date).format("YYYY-MM-DD")
          : slot.date;

      return {
        ...slot,
        date: dateStr,
        displayDate: formatDisplayDate(dateStr),
      };
    });

    res.json({
      success: true,
      data: formattedSlots,
    });
  } catch (error) {
    console.error("Get deleted slots error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching deleted slots",
    });
  }
};

// Delete a time slot (disable it) - FIXED
const deleteDateSlot = async (req, res) => {
  try {
    const db = getDb();
    const { date, time_slot } = req.params;

    console.log(`🗑️ DELETE request: ${date} - ${time_slot}`);

    // Validate slot format
    if (!TIME_SLOTS.includes(time_slot)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time slot",
      });
    }

    // Check if slot already exists in disabled_slots
    const [existing] = await db.execute(
      "SELECT * FROM disabled_slots WHERE date = ? AND time_slot = ?",
      [date, time_slot]
    );

    if (existing.length > 0) {
      // Update existing record to disabled
      await db.execute(
        "UPDATE disabled_slots SET enabled = 0 WHERE date = ? AND time_slot = ?",
        [date, time_slot]
      );
      console.log(
        `✅ Updated existing slot to disabled: ${date} - ${time_slot}`
      );
    } else {
      // Insert new disabled slot
      await db.execute(
        "INSERT INTO disabled_slots (date, time_slot, enabled) VALUES (?, ?, 0)",
        [date, time_slot]
      );
      console.log(`✅ Inserted new disabled slot: ${date} - ${time_slot}`);
    }

    // Verify the change
    const [verify] = await db.execute(
      "SELECT * FROM disabled_slots WHERE date = ? AND time_slot = ? AND enabled = 0",
      [date, time_slot]
    );

    if (verify.length > 0) {
      console.log(`✅ VERIFIED: Slot ${date} - ${time_slot} is now disabled`);
    }

    res.json({
      success: true,
      message: "Time slot disabled successfully",
    });
  } catch (error) {
    console.error("❌ Delete date slot error:", error);
    res.status(500).json({
      success: false,
      message: "Error disabling time slot: " + error.message,
    });
  }
};

// Restore a time slot (enable it) - FIXED
const restoreDateSlot = async (req, res) => {
  try {
    const db = getDb();
    const { date, time_slot } = req.body;

    console.log(`🔄 RESTORE request: ${date} - ${time_slot}`);

    if (!date || !time_slot) {
      return res.status(400).json({
        success: false,
        message: "Date and time slot are required",
      });
    }

    // Validate slot format
    if (!TIME_SLOTS.includes(time_slot)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time slot format",
      });
    }

    // Check if slot exists in disabled_slots
    const [existing] = await db.execute(
      "SELECT * FROM disabled_slots WHERE date = ? AND time_slot = ?",
      [date, time_slot]
    );

    if (existing.length > 0) {
      // Update to enabled
      await db.execute(
        "UPDATE disabled_slots SET enabled = 1 WHERE date = ? AND time_slot = ?",
        [date, time_slot]
      );
      console.log(`✅ Updated slot to enabled: ${date} - ${time_slot}`);
    } else {
      // Insert as enabled
      await db.execute(
        "INSERT INTO disabled_slots (date, time_slot, enabled) VALUES (?, ?, 1)",
        [date, time_slot]
      );
      console.log(`✅ Inserted new enabled slot: ${date} - ${time_slot}`);
    }

    // Verify the change
    const [verify] = await db.execute(
      "SELECT * FROM disabled_slots WHERE date = ? AND time_slot = ? AND enabled = 1",
      [date, time_slot]
    );

    if (verify.length > 0) {
      console.log(`✅ VERIFIED: Slot ${date} - ${time_slot} is now enabled`);
    }

    res.json({
      success: true,
      message: "Time slot restored successfully",
    });
  } catch (error) {
    console.error("❌ Restore date slot error:", error);
    res.status(500).json({
      success: false,
      message: "Error restoring time slot: " + error.message,
    });
  }
};

module.exports = {
  getAvailableDates,
  getDeletedSlots,
  deleteDateSlot,
  restoreDateSlot,
};
