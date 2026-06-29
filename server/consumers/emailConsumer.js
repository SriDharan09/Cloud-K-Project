const { consume } = require("../utils/messageBroker");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const start = async () => {
  await consume("email.send", async ({ to, subject, html }) => {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  });

  console.log("✅ Email consumer started");
};

module.exports = { start };
