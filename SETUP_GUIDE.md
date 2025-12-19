# Quick Setup Guide - Campus Companion

## ⚠️ IMPORTANT: MongoDB Setup Required

The 500 errors you're seeing are because **MongoDB is not running**. Here's how to fix it:

### Option 1: Install MongoDB Locally (Recommended for Development)

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the Windows installer
   - Run the installer and follow the setup wizard
   - Make sure to install MongoDB as a Windows Service

2. **Verify MongoDB is Running**
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name MongoDB
   
   # Or start it manually
   net start MongoDB
   ```

3. **Test MongoDB Connection**
   ```powershell
   # This should connect without errors
   mongosh
   ```

### Option 2: Use MongoDB Atlas (Cloud - Free Tier Available)

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/hackramp`

4. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/hackramp?retryWrites=true&w=majority
   ```

### After MongoDB is Set Up

1. **Restart the Server**
   ```powershell
   # Stop the current server (Ctrl+C in the terminal)
   # Then restart:
   cd server
   npm start
   ```

2. **Seed the Database** (Optional - Creates test users)
   ```powershell
   cd server
   node seeds.js
   ```

3. **Test the Application**
   - Open http://localhost:3000
   - Try logging in with: student@campus.com / password123

## Current Server Status

Your server is trying to connect to MongoDB at: `mongodb://localhost:27017/hackramp`

If MongoDB is not running, you'll see:
- ❌ 500 Internal Server Error
- ❌ Failed to load resource errors
- ❌ Cannot connect to database

Once MongoDB is running, you'll see:
- ✅ MongoDB Connected
- ✅ Server running on port 5000

## Environment Variables

Make sure your `server/.env` file contains:

```env
MONGODB_URI=mongodb://localhost:27017/hackramp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

### Error: "MongooseServerSelectionError"
- MongoDB is not running
- Check if MongoDB service is started
- Verify connection string in .env

### Error: "Authentication failed"
- Wrong username/password in MongoDB Atlas connection string
- Make sure to replace `<password>` with your actual password

### Error: "Network timeout"
- Firewall blocking MongoDB port (27017)
- MongoDB Atlas: Add your IP to whitelist (0.0.0.0/0 for development)

## Need Help?

1. Check MongoDB is running: `Get-Service -Name MongoDB`
2. Check server logs for specific errors
3. Verify .env file exists and has correct values
4. Make sure ports 3000 and 5000 are not blocked

---

**Once MongoDB is running, refresh your browser and the application will work perfectly!** 🚀
