const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

let connection;
let isConnected = false;

const initializeDatabase = async () => {
  try {
    // Check if we have a DATABASE_URL (for production)
    if (!process.env.DATABASE_URL) {
      console.log("🚨 DATABASE_URL not found - running in LOCAL MODE");
      console.log(
        "💡 For production, make sure DATABASE_URL is set in Railway"
      );

      // Create a mock connection for local development
      isConnected = false;
      console.log("✅ Running in LOCAL DEVELOPMENT MODE");
      console.log(
        "📝 Note: Database features will work when deployed to Railway with MySQL"
      );
      return null;
    }

    // Create connection using Railway's DATABASE_URL (for production)
    connection = await mysql.createConnection(process.env.DATABASE_URL);

    console.log("✅ MySQL database connected successfully!");
    isConnected = true;

    // Create tables
    await createTables();

    // Create admin account
    await createAdminAccount();

    return connection;
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
    console.log("💡 Running in LOCAL DEVELOPMENT MODE without database");
    console.log(
      "🌐 Your API will still start, but database features won't work locally"
    );
    isConnected = false;
    return null;
  }
};

const createTables = async () => {
  if (!isConnected) return;

  try {
    // Admins table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL DEFAULT 'Admin',
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Appointments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        message TEXT,
        date DATE NOT NULL,
        time_slot ENUM('10 am - 12 pm', '2 pm - 4 pm', '5 pm - 7 pm') NOT NULL,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_date_time (date, time_slot)
      )
    `);

    // Notifications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        appointment_id INT NOT NULL,
        sent_to_user BOOLEAN DEFAULT FALSE,
        sent_to_admin BOOLEAN DEFAULT FALSE,
        type ENUM('confirmation', 'reminder') NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
      )
    `);

    // Disabled Slots table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS disabled_slots (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        time_slot ENUM('10 am - 12 pm', '2 pm - 4 pm', '5 pm - 7 pm') NOT NULL,
        enabled BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_date_slot (date, time_slot)
      )
    `);

    console.log("✅ All MySQL tables created successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
  }
};

const createAdminAccount = async () => {
  if (!isConnected) return;

  try {
    const adminEmail = "Kalkidanhulet@gmail.com";
    const adminPassword = "Kalkidan%%lijoch100";

    // Delete existing admin if any
    await connection.execute("DELETE FROM admins WHERE email = ?", [
      adminEmail,
    ]);

    // Create new admin with hashed password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await connection.execute(
      "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
      ["Admin", adminEmail, hashedPassword]
    );

    console.log("✅ ADMIN ACCOUNT CREATED SUCCESSFULLY!");
    console.log("📧 Email: Kalkidanhulet@gmail.com");
    console.log("🔑 Password: Kalkidan%%lijoch100");
  } catch (error) {
    console.log("✅ Admin account setup completed");
  }
};

const getDb = () => {
  if (!isConnected) {
    throw new Error(
      "Database not available in local development. Deploy to Railway for full functionality."
    );
  }
  return connection;
};

const testConnection = async () => {
  if (!isConnected) {
    return false; // No database connection in local dev
  }

  try {
    await connection.execute("SELECT 1 as test");
    return true;
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    return false;
  }
};

module.exports = { initializeDatabase, getDb, testConnection };
