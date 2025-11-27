const { getDb } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { transporter } = require("../config/email");
const { formatDisplayDate } = require("../utils/timeSlots");

// ✉️ Send confirmation email helper
const sendConfirmationEmail = async (appointment) => {
  try {
    console.log(
      `📧 Attempting to send confirmation email to: ${appointment.email}`
    );

    // 🔍 ADD THESE DEBUG LOGS:
    console.log(
      "🔍 DEBUG - DATABASE_URL:",
      process.env.DATABASE_URL ? "EXISTS" : "MISSING"
    );
    console.log(
      "🔍 DEBUG - EMAIL_USER:",
      process.env.EMAIL_USER ? "EXISTS" : "MISSING"
    );
    console.log(
      "🔍 DEBUG - EMAIL_PASS:",
      process.env.EMAIL_PASS ? "EXISTS" : "MISSING"
    );

    // Check if we're in local development mode
    if (!process.env.DATABASE_URL) {
      console.log("🚫 BLOCKED: Local development mode - Email simulation");
      return;
    } else {
      console.log("✅ PASSED: Production mode check");
    }

    // Check if we have email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("🚫 BLOCKED: Email credentials missing");
      console.log(
        "   - EMAIL_USER:",
        process.env.EMAIL_USER ? "SET" : "MISSING"
      );
      console.log(
        "   - EMAIL_PASS:",
        process.env.EMAIL_PASS ? "SET" : "MISSING"
      );
      return;
    } else {
      console.log("✅ PASSED: Email credentials check");
    }

    console.log("🎯 ALL CHECKS PASSED - Preparing email content");

    const emailText = `
Hi ${appointment.name},

Great news! Your appointment has been confirmed.

Date: ${formatDisplayDate(appointment.date)}
Time: ${appointment.time_slot}

We're looking forward to seeing you!

Best regards,
Your Twist Zone Team
    `;

    const mailOptions = {
      from: {
        name: "Your Twist Zone",
        address: process.env.EMAIL_USER,
      },
      to: appointment.email,
      subject: "✅ Your Twist Zone - Appointment Confirmed!",
      text: emailText,
    };

    console.log("📤 Attempting to send email with transporter...");
    console.log("   From:", mailOptions.from.address);
    console.log("   To:", mailOptions.to);
    console.log("   Subject:", mailOptions.subject);

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ SUCCESS: Confirmation email sent to: ${appointment.email}`);
    console.log("   Message ID:", result.messageId);
  } catch (error) {
    console.error("❌ CONFirmation email FAILED:", error.message);
    console.error("   Full error details:", error);
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ ALWAYS USE ENVIRONMENT VARIABLES
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if environment variables are set
    if (!adminEmail || !adminPassword) {
      console.error("❌ Admin environment variables missing");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Check credentials against environment variables
    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ id: 1, email: email }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      return res.json({
        success: true,
        message: "Login successful",
        token: token,
        admin: {
          id: 1,
          name: "Admin",
          email: email,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Check if we're in local development mode
    if (!process.env.DATABASE_URL) {
      console.log("🔧 LOCAL MODE: Returning sample dashboard stats");
      return res.json({
        success: true,
        data: {
          stats: {
            totalBookings: 15,
            pendingBookings: 3,
            confirmedBookings: 8,
            completedBookings: 3,
            canceledBookings: 1,
            todayBookings: 2,
          },
        },
      });
    }

    const db = getDb();

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Get stats from database
    const statsRows = await db.query(
      `SELECT 
        COUNT(*) as totalBookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingBookings,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmedBookings,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedBookings,
        SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END) as canceledBookings,
        SUM(CASE WHEN date = $1 THEN 1 ELSE 0 END) as todayBookings
      FROM appointments`,
      [today]
    );

    const stats = statsRows.rows[0];

    res.json({
      success: true,
      data: {
        stats: stats || {
          totalBookings: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          canceledBookings: 0,
          todayBookings: 0,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
    });
  }
};

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    // Check if we're in local development mode
    if (!process.env.DATABASE_URL) {
      console.log("🔧 LOCAL MODE: Returning sample appointments");
      return res.json({
        success: true,
        data: {
          appointments: [
            {
              id: 1,
              name: "Sample Customer",
              email: "customer@example.com",
              phone: "123-456-7890",
              date: "2024-01-20",
              time_slot: "10 am - 12 pm",
              status: "pending",
              created_at: new Date().toISOString(),
            },
          ],
        },
      });
    }

    const db = getDb();
    const { page = 1, limit = 100, status, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    const params = [];
    let paramCount = 0;

    if (status && status !== "all") {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (name LIKE $${paramCount} OR email LIKE $${
        paramCount + 1
      } OR phone LIKE $${paramCount + 2})`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      paramCount += 2;
    }

    // Get appointments
    const appointments = await db.query(
      `SELECT * FROM appointments 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    // Get total count
    const totalResult = await db.query(
      `SELECT COUNT(*) as total FROM appointments ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        appointments: appointments.rows || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(totalResult.rows[0]?.total) || 0,
        },
      },
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`🔄 Updating appointment ${id} to status: ${status}`);

    if (!["pending", "confirmed", "completed", "canceled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Check if we're in local development mode
    if (!process.env.DATABASE_URL) {
      console.log("🔧 LOCAL MODE: Simulating status update");
      return res.json({
        success: true,
        message: "Status updated successfully",
      });
    }

    const db = getDb();

    // Get current appointment
    const appointments = await db.query(
      "SELECT * FROM appointments WHERE id = $1",
      [id]
    );

    if (appointments.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const appointment = appointments.rows[0];

    // Update status
    await db.query("UPDATE appointments SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);

    // Send confirmation email if status changed to confirmed
    if (status === "confirmed" && appointment.status !== "confirmed") {
      await sendConfirmationEmail(appointment);
    }

    res.json({
      success: true,
      message: "Appointment status updated successfully",
    });
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating appointment",
    });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if we're in local development mode
    if (!process.env.DATABASE_URL) {
      console.log("🔧 LOCAL MODE: Simulating appointment deletion");
      return res.json({
        success: true,
        message: "Appointment deleted successfully",
      });
    }

    const db = getDb();

    await db.query("DELETE FROM appointments WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Delete appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting appointment",
    });
  }
};

module.exports = {
  adminLogin,
  getDashboardStats,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};
