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
const sendApprovalEmail = async (email, name, blockchainId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Campus Companion <noreply@campuscompanion.com>',
      to: email,
      subject: 'Registration Approved - Campus Companion',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d6a7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-box { background: white; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .id-box { background: #e8f5e9; border: 2px solid #28a745; padding: 15px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .blockchain-id { font-size: 24px; font-weight: bold; color: #1e3a5f; letter-spacing: 2px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Campus Companion</h1>
              <p>Registration Approved</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <div class="status-box">
                <h3 style="margin: 0; color: #28a745;">✅ Welcome to Campus Companion!</h3>
              </div>

              <p>Congratulations! Your registration has been approved by the college administration.</p>
              
              <div class="id-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your Blockchain Student ID</p>
                <div class="blockchain-id">${blockchainId}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Securely stored on blockchain</p>
              </div>

              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Log in to your Campus Companion account</li>
                <li>Complete your profile setup</li>
                <li>Explore campus events and resources</li>
                <li>Connect with your department</li>
              </ul>

              <p><strong>Your Benefits:</strong></p>
              <ul>
                <li>📚 Access assignments and course materials</li>
                <li>📅 Register for campus events</li>
                <li>🏆 Earn digital certificates and badges</li>
                <li>🎯 Track your academic progress</li>
              </ul>
              
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
    return { success: false, error: error.message };
  }
};

// Send rejection notification email
const sendRejectionEmail = async (email, name, reason = '') => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Campus Companion <noreply@campuscompanion.com>',
      to: email,
      subject: 'Registration Status - Campus Companion',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-box { background: white; border-left: 4px solid #dc3545; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .reason-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
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
              <h2>Hello ${name},</h2>
              
              <div class="status-box">
                <h3 style="margin: 0; color: #dc3545;">Registration Not Approved</h3>
              </div>

              <p>Unfortunately, your registration request has not been approved at this time.</p>
              
              ${reason ? `
                <div class="reason-box">
                  <strong>Reason:</strong><br>
                  ${reason}
                </div>
              ` : ''}

              <p><strong>What You Can Do:</strong></p>
              <ul>
                <li>Contact the college administration office for more information</li>
                <li>Verify that all submitted information was correct</li>
                <li>Reapply if eligibility criteria are met</li>
              </ul>

              <p>If you believe this is an error, please reach out to the administration team.</p>
              
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
    console.log('Rejection email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendApprovalEmail,
  sendRejectionEmail
};
