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
const sendOTPEmail = async (email, otp, name, purpose = 'Email Verification') => {
  try {
    const subject = purpose === 'Password Reset' 
      ? 'Password Reset - Campus Companion' 
      : 'Email Verification - Campus Companion';
    
    const title = purpose === 'Password Reset'
      ? 'Password Reset'
      : 'Email Verification';
    
    const message = purpose === 'Password Reset'
      ? 'You requested to reset your password. Use the OTP below to proceed:'
      : 'Thank you for registering with Campus Companion. To complete your registration, please verify your email address using the OTP below:';

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Campus Companion <noreply@campuscompanion.com>',
      to: email,
      subject: subject,
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
              <p>${title}</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>${message}</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                <div class="otp">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
              </div>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Campus Companion staff will never ask for your OTP.
              </div>

              <p>If you didn't request this ${purpose.toLowerCase()}, please ignore this email.</p>
              
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

// Send event notification email
const sendEventNotificationEmail = async (email, name, eventDetails) => {
  try {
    const eventDate = new Date(eventDetails.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Campus Companion <noreply@campuscompanion.com>',
      to: email,
      subject: `🎉 New Event: ${eventDetails.title} - Campus Companion`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .event-box { background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .event-detail { margin: 10px 0; padding: 8px; background: #f8f9fa; border-radius: 4px; }
            .event-detail strong { color: #667eea; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .badge { display: inline-block; background: #667eea; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Event Announcement</h1>
              <p>Campus Companion</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <p>A new event has been approved and is now available for registration:</p>
              
              <div class="event-box">
                <h3 style="margin-top: 0; color: #667eea;">${eventDetails.title}</h3>
                <span class="badge">${eventDetails.eventType}</span>
                
                <div class="event-detail">
                  <strong>📅 Date & Time:</strong> ${eventDate}
                </div>
                
                <div class="event-detail">
                  <strong>📍 Venue:</strong> ${eventDetails.venue}
                </div>
                
                ${eventDetails.club ? `
                  <div class="event-detail">
                    <strong>🎯 Organized by:</strong> ${eventDetails.club.name}
                  </div>
                ` : ''}
                
                ${eventDetails.maxParticipants ? `
                  <div class="event-detail">
                    <strong>👥 Max Participants:</strong> ${eventDetails.maxParticipants}
                  </div>
                ` : ''}
                
                ${eventDetails.registrationDeadline ? `
                  <div class="event-detail">
                    <strong>⏰ Registration Deadline:</strong> ${new Date(eventDetails.registrationDeadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                ` : ''}
              </div>

              <p style="text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:3000'}/events" class="cta-button">
                  View Event & Register Now
                </a>
              </p>

              <p><strong>Don't miss out!</strong> Log in to your Campus Companion account to register and get more details about this event.</p>
              
              <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>Campus Companion Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Campus Companion. All rights reserved.</p>
              <p>This is an automated notification. To unsubscribe from event notifications, update your preferences in the app.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Event notification email sent to:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending event notification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendApprovalEmail,
  sendRejectionEmail,
  sendEventNotificationEmail
};
