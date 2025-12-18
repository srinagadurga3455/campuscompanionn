# Campus Companion App - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

Open 3 terminal windows and run:

**Terminal 1 - Backend:**
```bash
cd server
npm install
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
```

**Terminal 3 - Blockchain:**
```bash
cd blockchain
npm install
```

### Step 2: Configure Environment

**Server configuration:**
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and other credentials
```

**Blockchain configuration:**
```bash
cd blockchain
cp .env.example .env
# Add your MetaMask private key for deployment
```

### Step 3: Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** (recommended for production)

### Step 4: Deploy Smart Contracts (Optional for testing)

```bash
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost

# For testnet deployment:
# npx hardhat run scripts/deploy.js --network mumbai
```

### Step 5: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```
Frontend runs on: http://localhost:3000

## 📱 Test the Application

### 1. Register as Student
- Go to http://localhost:3000
- Click "Register here"
- Fill the form with role "Student"
- Click Register

### 2. Login as Admin
To test approval workflow, you need an admin account. Create one directly in MongoDB:

```javascript
// MongoDB shell or Compass
use campus_companion

db.users.insertOne({
  name: "Admin User",
  email: "admin@campus.com",
  password: "$2a$10$..." // Use bcrypt to hash "admin123"
  role: "college_admin",
  approvalStatus: "approved",
  phone: "+911234567890",
  createdAt: new Date()
})
```

Or use this simpler approach - Register as faculty/club_admin (auto-approved):
- Role: Faculty or Club Admin
- These roles are auto-approved

### 3. Approve Students
- Login as college admin
- Go to College Admin Dashboard
- Approve pending students
- Student receives blockchain ID

### 4. Test Features
- **Student**: View dashboard, events, assignments
- **Faculty**: Create assignments
- **Club Admin**: Create events, issue certificates
- **College Admin**: Manage approvals, view reports

## 🔧 Development Tools

### Backend API Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

### Smart Contract Testing
```bash
cd blockchain
npx hardhat test
npx hardhat node  # Run local blockchain
```

## 📊 Database Seeds (Optional)

Create sample data for testing:

```javascript
// In MongoDB shell
use campus_companion

// Create department
db.departments.insertOne({
  name: "Computer Science",
  code: "CS",
  description: "Department of Computer Science"
})

// Create club
db.clubs.insertOne({
  name: "Tech Club",
  description: "Technical club for coding enthusiasts",
  category: "technical"
})
```

## 🐛 Common Issues

### Port already in use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### MongoDB connection error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB is accessible

### Blockchain deployment fails
- Ensure you have test MATIC
- Check RPC URL in hardhat.config.js
- Verify private key in .env

## 📝 Next Steps

1. ✅ Application running locally
2. 📱 Configure WhatsApp API (optional)
3. 🔗 Deploy smart contracts to testnet
4. 🌐 Deploy to production (see DEPLOYMENT.md)

## 🎯 Project Structure Reference

```
hof/
├── client/          → React frontend (Port 3000)
├── server/          → Express backend (Port 5000)
├── blockchain/      → Smart contracts (Hardhat)
├── README.md        → Main documentation
├── API_DOCUMENTATION.md → API reference
└── DEPLOYMENT.md    → Production deployment guide
```

## 💡 Tips

- Use **MongoDB Compass** for easier database management
- Install **React Developer Tools** browser extension
- Use **Postman** for API testing
- Install **MetaMask** for blockchain testing

## 🆘 Need Help?

Check the documentation:
- [README.md](README.md) - Main overview
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API endpoints
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment

Happy Coding! 🚀
