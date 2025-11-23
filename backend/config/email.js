/// backend/config/email.js
const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify connection on startup
  transporter.verify(function (error, success) {
    if (error) {
      console.log("❌ Email transporter verification FAILED:", error);
    } else {
      console.log("✅ Email transporter is ready to send messages");
      console.log(`📧 Using: ${process.env.EMAIL_USER}`);
    }
  });
} else {
  console.log(
    "❌ No email credentials found. Emails will be logged to console (TEST MODE)."
  );
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
