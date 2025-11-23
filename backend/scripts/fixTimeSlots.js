const { initializeDatabase, getDb } = require("../config/database");

const fixTimeSlots = async () => {
  try {
    await initializeDatabase();
    const db = getDb();

    console.log("🔄 Fixing database time slot constraints...");

    // Drop the old appointments table
    await db.exec("DROP TABLE IF EXISTS appointments");

    console.log("✅ Old table dropped");

    // Create new table with correct time slot formats
    await db.exec(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                message TEXT,
                date TEXT NOT NULL,
                time_slot TEXT NOT NULL CHECK(time_slot IN ('10 am - 12 pm', '2 pm - 4 pm', '5 pm - 7 pm')),
                status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'canceled')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(date, time_slot)
            )
        `);

    console.log("✅ New table created with correct time slots");
    console.log("✅ Time slots now: 10 am - 12 pm, 2 pm - 4 pm, 5 pm - 7 pm");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing time slots:", error);
    process.exit(1);
  }
};

fixTimeSlots();
