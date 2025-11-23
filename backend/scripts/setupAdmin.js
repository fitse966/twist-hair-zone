const { getDb } = require("../config/database");
const bcrypt = require("bcryptjs");

const setupAdmin = async () => {
  try {
    const db = await require("../config/database").initializeDatabase();

    // Check if admin exists
    const existingAdmin = await db.get("SELECT * FROM admins WHERE email = ?", [
      "Kalkidanhulet@gmail.com",
    ]);

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("Kalkidan%%lijoch100", 12);

    await db.run(
      "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
      ["Kalkidan", "Kalkidanhulet@gmail.com", hashedPassword]
    );

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: Kalkidanhulet@gmail.com");
    console.log("🔑 Password: Kalkidan%%lijoch100");
  } catch (error) {
    console.error("❌ Error setting up admin:", error);
  }
};

setupAdmin();
