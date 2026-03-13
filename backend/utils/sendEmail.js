const nodemailer = require('nodemailer');

// Set up the transporter (Using Ethereal for testing or Gmail if configured)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (toEmail, otpCode, hostUrl) => {
  try {
    const mailOptions = {
      from: `"Sell Clothes Shop" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Verify your email address',
      html: `
        <h2>Welcome to Sell Clothes Shop!</h2>
        <p>Thank you for registering. Please confirm your email address to complete your account setup.</p>
        
        <h3>1. Using OTP Code:</h3>
        <p>Enter the following 6-digit code in the verification screen:</p>
        <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px; color: #333;">${otpCode}</h1>
        
        <h3>2. Or click the link below:</h3>
        <p><a href="${hostUrl}/api/auth/verify-email/${otpCode}" style="color: blue; text-decoration: underline;">Verify My Account Automatically</a></p>
        
        <br />
        <p>This code will expire in 15 minutes.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendVerificationEmail };
