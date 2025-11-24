const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

let pool;
let isConnected = false;

const initializeDatabase = async () => {
  try {
    console.log("🔗 Connecting to PostgreSQL database...");

    // ✅ SAFE UPDATE: Try Render's connection first, if not use your existing code
    if (process.env.DATABASE_URL) {
      // This will work on Render
      console.log("🌐 Using Render PostgreSQL database...");
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      });
    } else {
      // This keeps your existing local development working
      console.log("💻 Using local PostgreSQL database...");
      pool = new Pool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "twistzone_booking",
        port: process.env.DB_PORT || 5432,
      });
    }

    // Test connection with a simple query
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("✅ PostgreSQL database connected successfully!");
    console.log("📅 Database time:", result.rows[0].now);
    client.release();

    isConnected = true;

    // Create tables
    await createTables();

    // Create admin account
    await createAdminAccount();

    return pool;
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    console.log("💡 Make sure:");
    console.log("   - PostgreSQL is running");
    console.log("   - Database 'twistzone_booking' exists");
    console.log("   - DB_PASSWORD in .env is correct");
    console.log("   - PostgreSQL is on port 5432");
    isConnected = false;
    return null;
  }
};

const createTables = async () => {
  if (!isConnected) return;

  try {
    const client = await pool.connect();

    // Admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL DEFAULT 'Admin',
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Appointments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        message TEXT,
        date DATE NOT NULL,
        time_slot VARCHAR(50) NOT NULL CHECK (time_slot IN ('10 am - 12 pm', '2 pm - 4 pm', '5 pm - 7 pm')),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (date, time_slot)
      )
    `);

    // Disabled Slots table (for Date Controller)
    await client.query(`
      CREATE TABLE IF NOT EXISTS disabled_slots (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        time_slot VARCHAR(50) NOT NULL CHECK (time_slot IN ('10 am - 12 pm', '2 pm - 4 pm', '5 pm - 7 pm')),
        enabled BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (date, time_slot)
      )
    `);

    client.release();
    console.log("✅ All PostgreSQL tables created successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
  }
};

const createAdminAccount = async () => {
  if (!isConnected) return;

  try {
    const adminEmail = "Kalkidanhulet@gmail.com";
    const adminPassword = "Kalkidan%%lijoch100";

    const client = await pool.connect();

    // Delete existing admin if any
    await client.query("DELETE FROM admins WHERE email = $1", [adminEmail]);

    // Create new admin with hashed password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await client.query(
      "INSERT INTO admins (name, email, password) VALUES ($1, $2, $3)",
      ["Admin", adminEmail, hashedPassword]
    );

    client.release();

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
      "PostgreSQL database not connected. Check your PostgreSQL installation and .env file"
    );
  }
  return pool;
};

const testConnection = async () => {
  if (!isConnected) {
    return false;
  }

  try {
    const client = await pool.connect();
    await client.query("SELECT 1 as test");
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    return false;
  }
};

module.exports = { initializeDatabase, getDb, testConnection };
