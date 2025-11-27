const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter;
let isEmailConfigured = false;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // ← CHANGE FROM 465 TO 587
    secure: false, // ← CHANGE FROM true TO false
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // ✅ ADD CONNECTION TIMEOUT SETTINGS
    connectionTimeout: 30000, // 30 seconds
    socketTimeout: 30000, // 30 seconds
    greetingTimeout: 30000, // 30 seconds
  });

  // Verify connection with better logging
  transporter.verify(function (error, success) {
    if (error) {
      console.log("❌ Email transporter verification FAILED:", error.message);
      console.log("🔧 Try changing port to 465 or check firewall settings");
      isEmailConfigured = false;
    } else {
      console.log("✅ Email transporter is READY to send messages");
      console.log(`📧 Configured with: ${process.env.EMAIL_USER}`);
      isEmailConfigured = true;
    }
  });
} else {
  console.log(
    "❌ No email credentials found. Emails will be logged to console (TEST MODE)."
  );
  isEmailConfigured = false;
  transporter = {
    sendMail: (mailOptions) => {
      console.log("📧 TEST MODE - Email would be sent:");
      console.log("To:", mailOptions.to);
      console.log("Subject:", mailOptions.subject);
      console.log("Text:", mailOptions.text);
      return Promise.resolve({ messageId: "test-mode-" + Date.now() });
    },
  };
}

module.exports = { transporter };
