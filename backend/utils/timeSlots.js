const moment = require("moment-timezone");

// Define time slots in the correct format
const TIME_SLOTS = ["10 am - 12 pm", "2 pm - 4 pm", "5 pm - 7 pm"];

const getAvailableDates = () => {
  const timezone = process.env.TIMEZONE || "America/Winnipeg";
  const availableDates = [];

  // Use UTC to avoid timezone shifting bullshit
  const today = moment().utc().startOf("day");

  console.log(
    "🔄 Generating weekend dates starting from:",
    today.format("YYYY-MM-DD dddd")
  );

  // Generate next 30 days and filter weekends
  for (let i = 0; i < 30; i++) {
    const date = today.clone().add(i, "days");
    const dayOfWeek = date.day(); // 0 = Sunday, 6 = Saturday

    console.log(
      `Checking ${date.format("YYYY-MM-DD")} - ${date.format(
        "dddd"
      )} - Day ${dayOfWeek}`
    );

    // ONLY include Saturdays (6) and Sundays (0) - NO FUCKING FRIDAYS!
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      const dateStr = date.format("YYYY-MM-DD");
      const dayName = date.format("dddd");
      availableDates.push(dateStr);
      console.log(`✅ ADDED ${dateStr} (${dayName})`);
    } else {
      console.log(
        `❌ SKIPPED ${date.format("YYYY-MM-DD")} (${date.format(
          "dddd"
        )}) - NOT WEEKEND`
      );
    }
  }

  console.log(`📅 Total weekend dates found: ${availableDates.length}`);

  // Make sure we return exactly the same dates as Booking Form
  const finalDates = availableDates.slice(0, 8);
  console.log("🎯 FINAL DATES FOR SYSTEM:", finalDates);
  return finalDates;
};

const getAvailableTimeSlots = async (db, date) => {
  try {
    const allSlots = TIME_SLOTS;

    // Get booked slots for this date (PostgreSQL version)
    const bookedResult = await db.query(
      "SELECT time_slot FROM appointments WHERE date = $1 AND status IN ('pending', 'confirmed')",
      [date]
    );

    const bookedSlotValues = bookedResult.rows.map((slot) => slot.time_slot);

    // Get disabled slots from Date Controller (PostgreSQL version)
    const disabledResult = await db.query(
      "SELECT time_slot FROM disabled_slots WHERE date = $1 AND enabled = false",
      [date]
    );

    const disabledSlotValues = disabledResult.rows.map(
      (slot) => slot.time_slot
    );

    // Filter out booked and disabled slots
    const availableSlots = allSlots.filter(
      (slot) =>
        !bookedSlotValues.includes(slot) && !disabledSlotValues.includes(slot)
    );

    console.log(`📅 ${date} - Available slots:`, availableSlots);
    return availableSlots;
  } catch (error) {
    console.error("Error getting available time slots:", error);
    return [];
  }
};

const isWeekend = (date) => {
  // Use UTC to avoid timezone bullshit
  const momentDate = moment.utc(date);
  const dayOfWeek = momentDate.day();
  const isWeekendDay = dayOfWeek === 6 || dayOfWeek === 0; // Saturday or Sunday ONLY
  console.log(
    `📅 ${date} is ${momentDate.format("dddd")} - Weekend: ${isWeekendDay}`
  );
  return isWeekendDay;
};

const formatDisplayDate = (dateStr) => {
  // FIX: Use moment.utc() instead of moment().utc() to preserve the correct day
  return moment.utc(dateStr).format("dddd, MMMM D, YYYY");
};

// Helper function to check if a specific date+slot is available
const isSlotAvailable = async (db, date, time_slot) => {
  try {
    // Check if slot is booked
    const bookedResult = await db.query(
      "SELECT id FROM appointments WHERE date = $1 AND time_slot = $2 AND status IN ('pending', 'confirmed')",
      [date, time_slot]
    );

    // Check if slot is disabled in Date Controller
    const disabledResult = await db.query(
      "SELECT id FROM disabled_slots WHERE date = $1 AND time_slot = $2 AND enabled = false",
      [date, time_slot]
    );

    return bookedResult.rows.length === 0 && disabledResult.rows.length === 0;
  } catch (error) {
    console.error("Error checking slot availability:", error);
    return false;
  }
};

// Get all disabled slots for a specific date (for Date Controller)
const getDisabledSlots = async (db, date) => {
  try {
    const disabledResult = await db.query(
      "SELECT time_slot FROM disabled_slots WHERE date = $1 AND enabled = false",
      [date]
    );
    return disabledResult.rows.map((slot) => slot.time_slot);
  } catch (error) {
    console.error("Error getting disabled slots:", error);
    return [];
  }
};

// Check if a date is completely disabled (all slots disabled)
const isDateDisabled = async (db, date) => {
  try {
    const disabledSlots = await getDisabledSlots(db, date);
    return disabledSlots.length === TIME_SLOTS.length;
  } catch (error) {
    console.error("Error checking if date is disabled:", error);
    return false;
  }
};

module.exports = {
  TIME_SLOTS,
  getAvailableDates,
  getAvailableTimeSlots,
  isWeekend,
  formatDisplayDate,
  isSlotAvailable,
  getDisabledSlots,
  isDateDisabled,
};
