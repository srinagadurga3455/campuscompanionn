# Email OTP Verification Setup Guide

## Overview
Email OTP verification has been successfully integrated into the Campus Companion App registration flow. Users must verify their email before completing registration.

## Features Implemented

### 1. **Two-Step Registration Process**
   - **Step 1**: User fills registration form and requests OTP
   - **Step 2**: User receives OTP via email and verifies to complete registration

### 2. **Email Utility** (`server/utils/email.js`)
   - Nodemailer configuration for sending emails
   - 6-digit OTP generation
   - Professional HTML email templates with Campus Companion branding
   - OTP expiry (10 minutes)
   - Approval/rejection notification emails

### 3. **Updated Database Schema** (`server/models/User.js`)
   New fields added:
   - `emailVerified`: Boolean (default: false)
   - `otp`: String (stores current OTP)
   - `otpExpiry`: Date (OTP expiration time)

### 4. **New API Endpoints** (`server/routes/auth.js`)

   **POST /api/auth/send-otp**
   - Validates user registration data
   - Generates 6-digit OTP
   - Sends OTP to user's email
   - Stores OTP with 10-minute expiry
   - Returns success message

   **POST /api/auth/verify-otp**
   - Validates OTP against stored value
   - Checks OTP expiry
   - Completes user registration
   - Sets emailVerified to true
   - Clears OTP data

### 5. **Enhanced Login Security**
   - Login requires email verification
   - Users with unverified emails cannot log in

### 6. **Updated Frontend** (`client/src/pages/Register.js`)
   - Multi-step form with Material-UI Stepper
   - Step 1: Registration form with password confirmation
   - Step 2: OTP verification interface
   - Resend OTP functionality
   - Back button to edit registration details
   - Professional UI with icons and visual feedback

## Email Configuration

### Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Google Account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Campus Companion"
   - Copy the 16-character password

3. **Update `.env` File**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App password from step 2
   EMAIL_FROM=Campus Companion <noreply@campuscompanion.com>
   ```

### Other Email Providers

#### **Outlook/Office 365**
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

#### **SendGrid** (Production Recommended)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

#### **AWS SES** (Production)
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your_aws_smtp_username
EMAIL_PASSWORD=your_aws_smtp_password
```

## MongoDB Connection

The MongoDB connection string has been updated to:
```
mongodb+srv://kandasagar2006_db_user:k1SVzUgKo9gATCSz@cluster0.eckv4ap.mongodb.net/campus_companion
```

**Database Name**: `campus_companion` (automatically created if it doesn't exist)

## Installation & Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

Nodemailer has been added to `package.json` dependencies.

### 2. Configure Environment Variables
Update `server/.env` with your email credentials:
```bash
# Required: Update these values
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

### 3. Test Email Configuration
Create a test file `server/test-email.js`:
```javascript
require('dotenv').config();
const { sendOTPEmail } = require('./utils/email');

sendOTPEmail('test@example.com', '123456', 'Test User')
  .then(() => console.log('Email sent successfully!'))
  .catch(err => console.error('Email failed:', err));
```

Run test:
```bash
node test-email.js
```

## Usage Flow

### User Registration Journey

1. **Navigate to Register Page** (`/register`)
   - User fills: Name, Email, Password, Phone, Role, etc.
   - Clicks "Send OTP"

2. **OTP Sent**
   - System generates 6-digit OTP
   - Email sent with professional template
   - User moves to verification step

3. **Email Received**
   - User receives email with OTP
   - Valid for 10 minutes
   - Includes security warnings

4. **OTP Verification**
   - User enters 6-digit code
   - Can resend OTP if expired
   - Can go back to edit details

5. **Registration Complete**
   - Email verified successfully
   - Account created with proper approval status
   - Students: Awaiting admin approval
   - Faculty/Club Admin: Auto-approved

6. **Login**
   - Only verified users can log in
   - Unverified accounts are blocked

## API Testing with Postman/cURL

### Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+919876543210",
    "role": "student",
    "year": 2,
    "enrollmentYear": 2023,
    "classSection": "A"
  }'
```

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456",
    "password": "password123",
    "name": "John Doe",
    "phone": "+919876543210",
    "role": "student",
    "year": 2,
    "enrollmentYear": 2023,
    "classSection": "A"
  }'
```

## Email Templates

### OTP Email Features
- ✅ Professional gradient header
- ✅ Clear OTP display with large font
- ✅ Security warnings
- ✅ Expiry information (10 minutes)
- ✅ Responsive HTML design
- ✅ Campus Companion branding

### Approval Email
- Separate templates for approved/rejected status
- Color-coded messaging (green for approved, red for rejected)
- Next steps guidance
- Professional footer

## Security Features

1. **OTP Expiry**: Automatically expires after 10 minutes
2. **One-time Use**: OTP is cleared after successful verification
3. **Email Uniqueness**: Prevents duplicate registrations
4. **Password Hashing**: Bcrypt with salt rounds
5. **Verification Required**: Login blocked for unverified emails
6. **Rate Limiting**: Resend OTP throttling (client-side)

## Troubleshooting

### Email Not Sending

**1. Check Email Credentials**
```bash
# Verify .env file has correct values
cat server/.env | grep EMAIL
```

**2. Gmail Blocking**
- Ensure 2FA is enabled
- Use App Password, not regular password
- Check "Less secure app access" is OFF

**3. Port Issues**
- Try port 465 with `secure: true`
- Try port 587 with `secure: false`

**4. Firewall/Network**
- Check if SMTP ports are blocked
- Test with different network

### OTP Not Working

**1. Check Time**
- OTP expires in 10 minutes
- Resend if expired

**2. Database Connection**
- Verify MongoDB is connected
- Check OTP stored in database:
  ```javascript
  const user = await User.findOne({ email: 'test@example.com' });
  console.log(user.otp, user.otpExpiry);
  ```

**3. Case Sensitivity**
- OTP is case-sensitive (numbers only)
- Ensure no extra spaces

## Production Recommendations

1. **Use Professional Email Service**
   - SendGrid (99% deliverability)
   - AWS SES (cost-effective)
   - Mailgun (developer-friendly)

2. **Environment Variables**
   - Never commit `.env` to Git
   - Use secrets management (AWS Secrets Manager, Azure Key Vault)

3. **Rate Limiting**
   - Add rate limiting for OTP requests (e.g., 3 attempts per 15 minutes)
   - Implement CAPTCHA for repeated failures

4. **Monitoring**
   - Log email send failures
   - Track OTP verification success rate
   - Monitor email deliverability

5. **Email Deliverability**
   - Configure SPF, DKIM, DMARC records
   - Use verified sender domain
   - Avoid spam trigger words

## Files Modified/Created

### Created
- ✅ `server/utils/email.js` - Email utility with OTP sending
- ✅ `docs/EMAIL_OTP_SETUP.md` - This documentation

### Modified
- ✅ `server/package.json` - Added nodemailer dependency
- ✅ `server/models/User.js` - Added emailVerified, otp, otpExpiry fields
- ✅ `server/routes/auth.js` - Added send-otp and verify-otp endpoints, updated login
- ✅ `server/.env` - Fixed MONGODB_URI typo, added email configuration
- ✅ `server/.env.example` - Updated with email config template
- ✅ `client/src/pages/Register.js` - Complete rewrite with OTP verification flow

## Next Steps

1. **Configure Email Credentials**
   - Update `server/.env` with your email provider credentials
   - Test email sending

2. **Install Dependencies**
   ```bash
   cd server && npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Test Registration Flow**
   - Visit http://localhost:3000/register
   - Fill registration form
   - Check email for OTP
   - Complete verification

5. **Optional Enhancements**
   - Add rate limiting middleware
   - Implement CAPTCHA
   - Add SMS OTP as alternative
   - Email template customization

## Support

For issues or questions:
- Check MongoDB connection in logs
- Verify email credentials in `.env`
- Test email utility independently
- Review browser console for frontend errors

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Dependencies**: nodemailer@^6.9.7
