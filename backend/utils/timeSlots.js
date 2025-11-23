const moment = require("moment-timezone");

// Define time slots in the correct format
const TIME_SLOTS = ["10 am - 12 pm", "2 pm - 4 pm", "5 pm - 7 pm"];

const getAvailableDates = () => {
  const timezone = process.env.TIMEZONE || "America/Winnipeg";
  const availableDates = [];
  const today = moment().tz(timezone).startOf("day");

  console.log(
    "🔄 Generating weekend dates starting from:",
    today.format("YYYY-MM-DD dddd")
  );

  // Generate next 30 days and filter weekends
  for (let i = 0; i < 30; i++) {
    const date = today.clone().add(i, "days");
    const dayOfWeek = date.day(); // 0 = Sunday, 6 = Saturday

    // Only include Saturdays (6) and Sundays (0)
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      const dateStr = date.format("YYYY-MM-DD");
      const dayName = date.format("dddd");
      availableDates.push(dateStr);
      console.log(`✅ Added ${dateStr} (${dayName})`);
    }
  }

  console.log(`📅 Total weekend dates found: ${availableDates.length}`);
  return availableDates.slice(0, 8); // Return first 8 weekend dates
};

const getAvailableTimeSlots = async (db, date) => {
  try {
    const allSlots = TIME_SLOTS;

    // Get booked slots for this date (MySQL version)
    const [bookedSlots] = await db.execute(
      "SELECT time_slot FROM appointments WHERE date = ? AND status IN ('pending', 'confirmed')",
      [date]
    );

    const bookedSlotValues = bookedSlots.map((slot) => slot.time_slot);

    // Get disabled slots from Date Controller (MySQL version)
    const [disabledSlots] = await db.execute(
      "SELECT time_slot FROM disabled_slots WHERE date = ? AND enabled = 0",
      [date]
    );

    const disabledSlotValues = disabledSlots.map((slot) => slot.time_slot);

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
  const momentDate = moment(date);
  const dayOfWeek = momentDate.day();
  const isWeekendDay = dayOfWeek === 6 || dayOfWeek === 0;
  console.log(
    `📅 ${date} is ${momentDate.format("dddd")} - Weekend: ${isWeekendDay}`
  );
  return isWeekendDay;
};

const formatDisplayDate = (dateStr) => {
  return moment(dateStr)
    .tz(process.env.TIMEZONE || "America/Winnipeg")
    .format("dddd, MMMM D, YYYY");
};

// Helper function to check if a specific date+slot is available
const isSlotAvailable = async (db, date, time_slot) => {
  try {
    // Check if slot is booked
    const [bookedSlots] = await db.execute(
      "SELECT id FROM appointments WHERE date = ? AND time_slot = ? AND status IN ('pending', 'confirmed')",
      [date, time_slot]
    );

    // Check if slot is disabled in Date Controller
    const [disabledSlots] = await db.execute(
      "SELECT id FROM disabled_slots WHERE date = ? AND time_slot = ? AND enabled = 0",
      [date, time_slot]
    );

    return bookedSlots.length === 0 && disabledSlots.length === 0;
  } catch (error) {
    console.error("Error checking slot availability:", error);
    return false;
  }
};

// Get all disabled slots for a specific date (for Date Controller)
const getDisabledSlots = async (db, date) => {
  try {
    const [disabledSlots] = await db.execute(
      "SELECT time_slot FROM disabled_slots WHERE date = ? AND enabled = 0",
      [date]
    );
    return disabledSlots.map((slot) => slot.time_slot);
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
