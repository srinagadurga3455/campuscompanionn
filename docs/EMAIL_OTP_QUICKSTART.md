# 🎓 Email OTP Verification - Quick Start

## ✅ What's Been Added

### Backend Changes
1. **Nodemailer Integration** - Professional email sending
2. **OTP System** - 6-digit codes with 10-minute expiry
3. **New API Endpoints**:
   - `POST /api/auth/send-otp` - Request verification code
   - `POST /api/auth/verify-otp` - Complete registration
4. **Enhanced Security** - Email verification required for login

### Frontend Changes
1. **Two-Step Registration** - Form → OTP verification
2. **Beautiful UI** - Material-UI Stepper with progress tracking
3. **Resend OTP** - Users can request new codes
4. **Validation** - Password matching, 6-digit OTP format

### Database Updates
- `emailVerified` field (Boolean)
- `otp` field (String)
- `otpExpiry` field (Date)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Configure Email (Gmail)

**Option A: Use Gmail App Password** (Recommended)
1. Enable 2FA on Google Account: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. Update `server/.env`:
```env
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Option B: For Testing Only** (Less Secure)
```env
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_regular_password
```
Then enable "Less secure app access" in Gmail settings.

### Step 3: Start Application
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

---

## 📧 Email Providers Configuration

### Gmail (Development)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=app_password_here
```

### Outlook
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your@outlook.com
EMAIL_PASSWORD=your_password
```

### SendGrid (Production)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.your_api_key
```

---

## 🧪 Test the System

### 1. Test Email Sending
```bash
cd server
node -e "
require('dotenv').config();
const { sendOTPEmail } = require('./utils/email');
sendOTPEmail('your@email.com', '123456', 'Test User')
  .then(() => console.log('✅ Email sent!'))
  .catch(err => console.error('❌ Error:', err.message));
"
```

### 2. Test Registration Flow
1. Open http://localhost:3000/register
2. Fill registration form
3. Click "Send OTP"
4. Check your email inbox
5. Enter 6-digit code
6. Complete registration

### 3. Test API with cURL
```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "phone": "+919876543210",
    "role": "student",
    "year": 2,
    "enrollmentYear": 2023
  }'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "password": "test123",
    "name": "Test User",
    "phone": "+919876543210",
    "role": "student",
    "year": 2,
    "enrollmentYear": 2023
  }'
```

---

## 🎯 User Registration Flow

```
1. User fills registration form
   ↓
2. Clicks "Send OTP"
   ↓
3. System generates 6-digit OTP
   ↓
4. Email sent to user's inbox
   ↓
5. User enters OTP
   ↓
6. System verifies OTP
   ↓
7. Registration complete!
   ↓
8. Students: Awaiting admin approval
   Faculty/Club Admin: Can login immediately
```

---

## 🛠️ Environment Variables Required

### MongoDB (Already Configured)
```env
MONGODB_URI=mongodb+srv://kandasagar2006_db_user:k1SVzUgKo9gATCSz@cluster0.eckv4ap.mongodb.net/campus_companion
```

### Email (MUST Configure)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com          # ⚠️ CHANGE THIS
EMAIL_PASSWORD=your_app_password         # ⚠️ CHANGE THIS
EMAIL_FROM=Campus Companion <noreply@campuscompanion.com>
```

### JWT & WhatsApp (Already Set)
```env
JWT_SECRET=your_jwt_secret_key_here_change_in_production
WHATSAPP_API_URL=...
```

---

## ❌ Troubleshooting

### Email Not Sending?

**Problem**: "Invalid login" error
- ✅ Solution: Use App Password instead of regular Gmail password
- ✅ Enable 2FA first

**Problem**: "Connection timeout"
- ✅ Check firewall/antivirus blocking port 587
- ✅ Try port 465 with `secure: true` in email.js

**Problem**: Email goes to spam
- ✅ Normal for development (from unknown domain)
- ✅ Check spam/junk folder
- ✅ Production: Use SendGrid/AWS SES

### OTP Issues?

**Problem**: OTP expired
- ✅ OTP valid for 10 minutes only
- ✅ Click "Resend OTP" to get new code

**Problem**: Invalid OTP error
- ✅ Check email for correct 6-digit code
- ✅ No spaces or special characters
- ✅ Case-sensitive (numbers only)

### MongoDB Connection?

**Problem**: "MongoServerError: Authentication failed"
- ✅ Verify connection string in `.env`
- ✅ Check MongoDB Atlas network access (allow your IP)
- ✅ Already configured correctly in your setup

---

## 📊 What Changed?

| File | Change | Why |
|------|--------|-----|
| `server/package.json` | Added `nodemailer@^6.9.7` | Email sending capability |
| `server/models/User.js` | Added OTP fields | Store verification codes |
| `server/routes/auth.js` | New endpoints + email check | OTP flow implementation |
| `server/utils/email.js` | **NEW FILE** | Email utility functions |
| `server/.env` | Fixed typo, added email config | Configuration |
| `client/src/pages/Register.js` | Complete rewrite | Two-step registration UI |
| `docs/EMAIL_OTP_SETUP.md` | **NEW FILE** | Full documentation |

---

## 🎨 Email Template Preview

**Subject**: Email Verification - Campus Companion

```
┌─────────────────────────────────┐
│   🎓 Campus Companion           │
│   Email Verification            │
├─────────────────────────────────┤
│                                 │
│   Hello [Name]!                 │
│                                 │
│   Your OTP Code:                │
│   ┌───────────────┐            │
│   │   1 2 3 4 5 6 │            │
│   └───────────────┘            │
│   Valid for 10 minutes          │
│                                 │
│   ⚠️ Never share this OTP       │
│                                 │
└─────────────────────────────────┘
```

---

## 🔐 Security Features

- ✅ **OTP Expiry**: 10 minutes validity
- ✅ **One-time Use**: OTP cleared after verification
- ✅ **Email Uniqueness**: No duplicate accounts
- ✅ **Password Hashing**: Bcrypt with salt
- ✅ **Login Protection**: Unverified users blocked
- ✅ **Secure Email**: TLS encryption (port 587)

---

## 📱 Frontend Features

- ✅ **Material-UI Stepper**: Visual progress tracking
- ✅ **Password Confirmation**: Prevent typos
- ✅ **OTP Input**: Large, centered 6-digit field
- ✅ **Resend OTP**: Get new code if expired
- ✅ **Back Button**: Edit registration details
- ✅ **Error Handling**: Clear error messages
- ✅ **Loading States**: Disabled buttons during API calls

---

## 📝 API Endpoints Summary

### Send OTP
```
POST /api/auth/send-otp
Body: { name, email, password, phone, role, ... }
Response: { success: true, message: "OTP sent", email }
```

### Verify OTP
```
POST /api/auth/verify-otp
Body: { email, otp, password, name, phone, role, ... }
Response: { success: true, message: "Verified", user }
```

### Login (Updated)
```
POST /api/auth/login
Body: { email, password }
Response: { success: true, token, user }
Note: Now checks emailVerified = true
```

---

## 🚀 Production Checklist

Before deploying:

- [ ] Use professional email service (SendGrid/AWS SES)
- [ ] Add rate limiting (3 OTP requests per 15 min)
- [ ] Configure SPF/DKIM/DMARC records
- [ ] Change all secrets in `.env`
- [ ] Enable MongoDB IP whitelist
- [ ] Add CAPTCHA for OTP requests
- [ ] Monitor email deliverability
- [ ] Set up error logging (Sentry)

---

## 📚 Documentation Files

1. **EMAIL_OTP_SETUP.md** - Comprehensive guide (this file's big brother)
2. **EMAIL_OTP_QUICKSTART.md** - This file
3. **API_DOCUMENTATION.md** - API reference (to be updated)
4. **README.md** - Main project documentation

---

## 🎯 Next Steps

1. **Configure your email credentials** in `server/.env`
2. **Install dependencies**: `cd server && npm install`
3. **Test email sending** with the test command above
4. **Start both servers** (backend + frontend)
5. **Try registering** a test account
6. **Check your email** for OTP
7. **Complete verification** and login

---

## 💡 Tips

- Use a **real email address** for testing
- Check **spam folder** if OTP doesn't arrive
- OTP is **valid for 10 minutes**
- For Gmail, use **App Password** (not regular password)
- Students need **admin approval** after email verification
- Faculty/Club Admins can **login immediately** after verification

---

**Need Help?**
- Full documentation: `docs/EMAIL_OTP_SETUP.md`
- API docs: `docs/API_DOCUMENTATION.md`
- Project README: `README.md`

---

**Status**: ✅ Ready to use  
**Last Updated**: December 2024  
**Version**: 1.0.0
