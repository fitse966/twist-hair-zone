// EMAILS COMPLETELY DISABLED
const transporter = {
  sendMail: (mailOptions) => {
    console.log("📧 EMAILS DISABLED - Would send to:", mailOptions.to);
    return Promise.resolve({ messageId: "disabled" });
  },
};

console.log("✅ Email system DISABLED");
module.exports = { transporter };
