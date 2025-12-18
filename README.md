# Campus Companion App 🎓

A unified campus management application combining **MERN Stack** with **Web3 Blockchain** for managing class schedules, assignments, events, and secure student identification.

## 🌟 Features

### User Authentication & Security
- **Email OTP Verification**: Secure registration with email verification
- **Two-Step Registration**: Form submission → OTP verification
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Student, Faculty, Club Admin, College Admin

### Multi-Role Dashboards
- **Student Dashboard**: Timetable, events, assignments, blockchain ID, certificates & badges
- **Faculty Dashboard**: Manage classes, assignments, announcements
- **Club Admin Dashboard**: Create events, track participation, issue certificates
- **College Admin Dashboard**: Approve/reject students, manage users, blockchain verification

### Blockchain Integration
- **Student ID Minting**: Blockchain-based IDs in `YYCCAAxxxx` format
- **Certificates**: NFT-based tamper-proof certificates
- **Badges**: Achievement tracking on blockchain
- **Verification System**: Public verification of credentials

### Notifications
- **Email Notifications**: OTP verification, approval status updates
- **WhatsApp Notifications**: Event reminders, assignment deadlines, certificate alerts

## 🛠️ Tech Stack

- **Frontend**: React.js, Material-UI, React Router, Axios
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose
- **Blockchain**: Ethereum/Polygon (Hardhat, Ethers.js, Solidity)
- **Email**: Nodemailer (OTP verification, notifications)
- **Notifications**: WhatsApp Business API

## 📁 Project Structure

```
campus-companion/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # Auth context
│       ├── pages/          # Page components
│       │   └── dashboards/ # Role-specific dashboards
│       └── utils/          # API utilities
├── server/                 # Express backend
│   ├── config/            # DB & blockchain config
│   ├── middleware/        # Auth & role middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── utils/             # WhatsApp & ID generation
└── blockchain/            # Smart contracts
    ├── contracts/         # Solidity contracts
    ├── scripts/           # Deployment scripts
    └── hardhat.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- MetaMask wallet
- Polygon Mumbai testnet MATIC (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hof
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

4. **Install Blockchain Dependencies**
```bash
cd ../blockchain
npm install
```

### Configuration

1. **Backend Configuration** (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://kandasagar2006_db_user:k1SVzUgKo9gATCSz@cluster0.eckv4ap.mongodb.net/campus_companion
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=Campus Companion <noreply@campuscompanion.com>
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key
```

**📧 Email Configuration (Required for OTP)**
- For Gmail: Enable 2FA and create App Password at https://myaccount.google.com/apppasswords
- See [EMAIL_OTP_QUICKSTART.md](docs/EMAIL_OTP_QUICKSTART.md) for detailed setup

2. **Blockchain Configuration** (`blockchain/.env`)
```env
PRIVATE_KEY=your_private_key
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
```

### Blockchain Deployment

1. **Compile contracts**
```bash
cd blockchain
npx hardhat compile
```

2. **Deploy to Mumbai testnet**
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

3. **Copy contract addresses** from `blockchain/deployed-addresses.json` to `server/.env`

### Running the Application

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start Backend Server**
```bash
cd server
npm run dev
```

3. **Start Frontend**
```bash
cd client
npm start
```

The app will open at `http://localhost:3000`

## 📋 User Workflow

1. **Student Registration**
   - Student signs up with details
   - Status: Pending approval

2. **Admin Approval**
   - College admin reviews registration
   - Approves/rejects with reason

3. **Blockchain ID Generation**
   - On approval, blockchain Student ID is minted
   - Format: `YYCCAAxxxx` (Year-College-Dept-Sequential)
   - WhatsApp notification sent

4. **Dashboard Access**
   - Student gains access to dashboard
   - Can view events, assignments, certificates

5. **Event Participation**
   - Register for events
   - Receive certificates (minted on blockchain)
   - Earn badges for achievements

## 🔐 Blockchain ID Format

**YYCCAAxxxx**
- `YY`: Last 2 digits of year of admission
- `CC`: College code (configurable, default "01")
- `AA`: Department/course code
- `xxxx`: Sequential number (0001-9999)

Example: `2301CS0001`
- Admitted in 2023
- College 01
- Computer Science department
- First student

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP for registration
- `POST /api/auth/verify-otp` - Verify OTP and complete registration
- `POST /api/auth/register` - Register new user (legacy)
- `POST /api/auth/login` - Login user (requires email verification)
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/pending` - Get pending approvals (admin)
- `PUT /api/users/:id/approve` - Approve user (admin)
- `PUT /api/users/:id/reject` - Reject user (admin)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `POST /api/events/:id/register` - Register for event

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment (faculty)
- `POST /api/assignments/:id/submit` - Submit assignment

### Certificates
- `POST /api/certificates` - Issue certificate (admin)
- `GET /api/certificates/verify/:id` - Verify certificate

### Blockchain
- `GET /api/blockchain/student/:blockchainId` - Get student from blockchain
- `POST /api/blockchain/verify/student/:blockchainId` - Verify student ID

## 🏆 Hackathon Highlights

This project combines:
- **Full-Stack Development**: Complete MERN application
- **Web3 Integration**: Blockchain-based credentials
- **Real-Time Notifications**: WhatsApp Business API
- **Practical Solution**: Solves real campus management problems
- **Scalability**: Modular architecture, ready for deployment
- **Security**: JWT auth, blockchain verification, tamper-proof records

## 📝 Smart Contracts

### StudentId.sol
- Mints unique student IDs on blockchain
- Manages student verification
- Tracks active/inactive status

### Certificate.sol
- ERC-721 NFT-based certificates
- Tamper-proof record keeping
- Public verification

### Badge.sol
- ERC-721 NFT-based badges
- Achievement tracking
- Skill recognition

## 🔧 Development

### Run tests
```bash
cd blockchain
npx hardhat test
```

### Local blockchain
```bash
npx hardhat node
```

## � Documentation

- [Quick Start Guide](QUICK_START.md) - Get started quickly
- [API Documentation](docs/API_DOCUMENTATION.md) - Complete API reference
- [Email OTP Setup](docs/EMAIL_OTP_QUICKSTART.md) - Email verification guide
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment
- [Architecture](docs/ARCHITECTURE.md) - System architecture
- [Documentation Index](docs/DOCUMENTATION_INDEX.md) - All documentation

## 📱 Email & WhatsApp Integration

### Email Configuration
1. Configure email credentials in `server/.env`
2. For Gmail: Enable 2FA and create App Password
3. Test OTP delivery before production
4. See [EMAIL_OTP_QUICKSTART.md](docs/EMAIL_OTP_QUICKSTART.md) for details

### WhatsApp Integration
1. Create a WhatsApp Business Account
2. Get API credentials from Meta for Developers
3. Add credentials to `server/.env`
4. Phone numbers must include country code (e.g., +91xxxxxxxxxx)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👥 Team

Developed for hackathon submission showcasing MERN Stack + Web3 integration.

## 🙏 Acknowledgments

- OpenZeppelin for smart contract libraries
- Material-UI for React components
- Hardhat for blockchain development framework
- WhatsApp Business API for notifications

---

**Note**: This is a demonstration project. For production use, implement additional security measures, error handling, and testing.
#   h o f  
 