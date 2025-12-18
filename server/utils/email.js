const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Campus Companion <noreply@campuscompanion.com>',
      to: email,
      subject: 'Email Verification - Campus Companion',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .otp { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Campus Companion</h1>
              <p>Email Verification</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for registering with Campus Companion. To complete your registration, please verify your email address using the OTP below:</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                <div class="otp">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Campus Companion staff will never ask for your OTP.
              </div>

              <p>If you didn't request this registration, please ignore this email.</p>
              
              <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>Campus Companion Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Campus Companion. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Send approval notification email
const sendApprovalEmail = async (email, name, status) => {
  try {
    const isApproved = status === 'approved';
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Campus Companion <noreply@campuscompanion.com>',
      to: email,
      subject: `Registration ${isApproved ? 'Approved' : 'Rejected'} - Campus Companion`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${isApproved ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#dc3545'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-box { background: white; border-left: 4px solid ${isApproved ? '#28a745' : '#dc3545'}; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Campus Companion</h1>
              <p>Registration Status Update</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <div class="status-box">
                <h3 style="margin: 0; color: ${isApproved ? '#28a745' : '#dc3545'};">
                  ${isApproved ? '✅ Registration Approved!' : '❌ Registration Rejected'}
                </h3>
              </div>

              ${isApproved ? `
                <p>Congratulations! Your registration has been approved by the college administration.</p>
                <p><strong>Next Steps:</strong></p>
                <ul>
                  <li>Log in to your Campus Companion account</li>
                  <li>Complete your profile setup</li>
                  <li>Start exploring campus events and resources</li>
                </ul>
                <p>Your Student ID will be minted on the blockchain shortly.</p>
              ` : `
                <p>Unfortunately, your registration request has been rejected by the college administration.</p>
                <p>If you believe this is an error, please contact the administration office for more information.</p>
              `}
              
              <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>Campus Companion Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Campus Companion. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Approval email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw new Error('Failed to send approval email');
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendApprovalEmail
};
