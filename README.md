# Campus Companion - Blockchain-Verified Campus Management System

## Overview
Campus Companion is a next-generation campus management platform that leverages blockchain technology for secure credential verification, attendance tracking, and certificate issuance.

## Features

### 🎓 Multi-Role Dashboard System
- **Student Dashboard**: View assignments, events, certificates, and attendance
- **Faculty Dashboard**: Manage classes, create assignments, mark attendance
- **College Admin Dashboard**: Oversee all campus activities and approvals
- **Club Admin Dashboard**: Organize events and issue certificates

### 🔐 Blockchain Integration
- Blockchain-verified student IDs
- NFT-based certificates and badges
- Immutable attendance records
- Secure credential verification

### 📅 Event Management
- Create and manage campus events
- Team and individual registration support
- Payment integration for paid events
- Automated registration confirmation

### 📝 Assignment System
- Create and distribute assignments
- Student submission portal
- Grading and feedback system
- Due date tracking

### 📊 Attendance Tracking
- QR code-based attendance marking
- Real-time attendance reports
- Percentage calculations
- Historical attendance data

### 🏆 Certificate & Badge System
- Issue digital certificates
- NFT badge rewards
- Certificate mailbox for students
- Downloadable and verifiable certificates

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Material-UI (MUI)** - Premium component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Ethers.js** - Blockchain integration

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Blockchain
- **Ethereum** - Smart contract platform
- **Hardhat** - Development environment
- **Solidity** - Smart contract language

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/srinagadurga3455/hackramp.git
cd hackramp
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/hackramp
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

5. **Seed the database** (Optional - creates sample users)
```bash
cd server
node seeds.js
```

This creates the following test accounts:
- **College Admin**: admin@campus.com / password123
- **Faculty**: faculty@campus.com / password123
- **Club Admin**: clubadmin@campus.com / password123
- **Student**: student@campus.com / password123

6. **Start the application**

Open two terminal windows:

Terminal 1 (Backend):
```bash
cd server
npm start
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
hackramp/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React context (Auth)
│       ├── pages/          # Page components
│       │   ├── dashboards/ # Role-specific dashboards
│       │   └── attendance/ # Attendance pages
│       └── utils/          # Utility functions
├── server/                 # Express backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── seeds.js           # Database seeder
└── blockchain/            # Smart contracts
    └── contracts/         # Solidity contracts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/register` - Register for event
- `POST /api/events/:id/verify-payment` - Verify payment

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment
- `POST /api/assignments/:id/submit` - Submit assignment

### Certificates
- `GET /api/certificates` - Get certificates
- `POST /api/certificates` - Issue certificate
- `PUT /api/certificates/claim/:id` - Claim certificate

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/student/:id` - Get student attendance

## Key Features Explained

### Payment Integration
- Events can have registration fees
- Students register and are added to pending list
- Payment page guides through payment process
- Transaction ID verification confirms registration

### Certificate Mailbox
- Unclaimed certificates appear in student mailbox
- One-click claim process
- Certificates become downloadable after claiming
- Blockchain verification available

### Attendance System
- Faculty generates QR codes for classes
- Students scan to mark attendance
- Real-time attendance percentage calculation
- Detailed attendance reports

## Design Philosophy

### Modern UI/UX
- Clean, minimalist design
- Smooth animations and transitions
- Responsive layout for all devices
- Glassmorphism and modern aesthetics

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes

### Performance
- Optimized React components
- Efficient database queries
- Lazy loading where applicable
- Minimal bundle size

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License
This project is licensed under the MIT License.

## Support
For issues or questions, please open an issue on GitHub.

## Acknowledgments
- Material-UI for the component library
- MongoDB for the database
- Ethereum for blockchain infrastructure