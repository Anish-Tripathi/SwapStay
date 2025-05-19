const nodemailer = require('nodemailer');

// Create transporter using Mailtrap configuration
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

const sendEmail = async ({ email, subject, message }) => {
  // Validate email configuration first
  if (!process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASS) {
    throw new Error('Mailtrap credentials not configured');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@studentportal.com',
    to: email,
    subject: subject,
    html: message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = {sendEmail};