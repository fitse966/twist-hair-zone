const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { initializeDatabase, testConnection } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow ALL Netlify domains automatically
      if (origin.includes(".netlify.app")) {
        return callback(null, true);
      }

      // Allow your specific non-Netlify domains
      const allowedOrigins = [
        "http://localhost:3000",
        "https://twist-hair-backend.onrender.com",
        "https://twist-zone-frontend-clean-1.onrender.com",
        "https://twistzone-frontend.onrender.com",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/admin/date-controller", require("./routes/dateController")); // ✅ FIXED THIS LINE

// Initialize database and email before starting server
const startServer = async () => {
  try {
    // Initialize database (will work in production, fail gracefully in local dev)
    await initializeDatabase();

    // Root endpoint
    app.get("/", (req, res) => {
      res.json({
        message: "✨ Your Twist Zone Booking API is running!",
        database: process.env.DATABASE_URL
          ? "MySQL (Railway)"
          : "Local Development Mode",
        version: "1.0.0",
        note: process.env.DATABASE_URL
          ? "Full database functionality"
          : "Deploy to Railway for database features",
      });
    });

    // Health check endpoint
    app.get("/health", async (req, res) => {
      const dbStatus = await testConnection();

      // Simple email status check without verifyEmailConfig
      const emailStatus = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

      res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        database: dbStatus ? "Connected" : "Local Development Mode",
        email: emailStatus ? "Configured" : "Test Mode",
        timezone: process.env.TIMEZONE,
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Timezone: ${process.env.TIMEZONE}`);
      console.log(
        `💾 Database: ${
          process.env.DATABASE_URL
            ? "MySQL (Railway)"
            : "Local Development Mode"
        }`
      );
      console.log(
        `📧 Email: ${process.env.EMAIL_USER ? "ACTIVE" : "TEST MODE"}`
      );
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`💡 TIP: Deploy to Railway for full database functionality!`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
