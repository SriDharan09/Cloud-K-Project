const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text,html }) => {
  const transporter = nodemailer.createTransport({
    service: 'Outlook', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,  // Optional plain text version of the email
      html   // HTML content
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
