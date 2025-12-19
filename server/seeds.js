require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Department = require('./models/Department');
const Branch = require('./models/Branch');
const Club = require('./models/Club');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing users...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await Branch.deleteMany({});
    await Club.deleteMany({});

    // Create departments
    console.log('📚 Creating departments...');
    const engineeringDept = await Department.create({
      name: 'Engineering',
      code: 'ENG',
      description: 'Engineering Department'
    });

    // Create branches under Engineering
    console.log('🌿 Creating branches...');
    const cseBranch = await Branch.create({
      name: 'Computer Science and Engineering',
      code: 'CSE',
      department: engineeringDept._id,
      description: 'Computer Science and Engineering'
    });

    const aimlBranch = await Branch.create({
      name: 'Artificial Intelligence and Machine Learning',
      code: 'AIML',
      department: engineeringDept._id,
      description: 'AI and ML specialization'
    });

    const cicBranch = await Branch.create({
      name: 'Computer and Information Communication',
      code: 'CIC',
      department: engineeringDept._id,
      description: 'Computer and Information Communication'
    });

    const aidsBranch = await Branch.create({
      name: 'Artificial Intelligence and Data Science',
      code: 'AIDS',
      department: engineeringDept._id,
      description: 'AI and Data Science'
    });

    const itBranch = await Branch.create({
      name: 'Information Technology',
      code: 'IT',
      department: engineeringDept._id,
      description: 'Information Technology'
    });

    const csbsBranch = await Branch.create({
      name: 'Computer Science and Business Systems',
      code: 'CSBS',
      department: engineeringDept._id,
      description: 'CS and Business Systems'
    });

    const eceBranch = await Branch.create({
      name: 'Electronics and Communication Engineering',
      code: 'ECE',
      department: engineeringDept._id,
      description: 'Electronics and Communication'
    });

    const eeeBranch = await Branch.create({
      name: 'Electrical and Electronics Engineering',
      code: 'EEE',
      department: engineeringDept._id,
      description: 'Electrical and Electronics'
    });

    const mechBranch = await Branch.create({
      name: 'Mechanical Engineering',
      code: 'MECH',
      department: engineeringDept._id,
      description: 'Mechanical Engineering'
    });

    const civilBranch = await Branch.create({
      name: 'Civil Engineering',
      code: 'CIVIL',
      department: engineeringDept._id,
      description: 'Civil Engineering'
    });

    const csdBranch = await Branch.create({
      name: 'Computer Science and Design',
      code: 'CSD',
      department: engineeringDept._id,
      description: 'CS and Design'
    });

    const csitBranch = await Branch.create({
      name: 'Computer Science and Information Technology',
      code: 'CSIT',
      department: engineeringDept._id,
      description: 'CS and IT'
    });

    // Create clubs
    console.log('🎭 Creating clubs...');
    
    // Create a temporary placeholder for club creation
    const techClub = await Club.create({
      name: 'Tech Club',
      description: 'Technology and Innovation Club',
      category: 'technical',
      admin: engineeringDept._id  // Temporary - will be updated
    });

    const culturalClub = await Club.create({
      name: 'Cultural Club',
      description: 'Cultural Activities and Events',
      category: 'cultural',
      admin: engineeringDept._id  // Temporary - will be updated
    });

    // Hash password (password123 for all users)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create sample users
    console.log('👥 Creating sample users...');

    // 1. College Admin
    const collegeAdmin = await User.create({
      name: 'Admin User',
      email: 'admin@campus.com',
      password: hashedPassword,
      phone: '+919876543210',
      role: 'college_admin',
      emailVerified: true,
      approvalStatus: 'approved'
    });
    console.log('✅ College Admin created - Email: admin@campus.com, Password: password123');

    // 2. Faculty
    const faculty = await User.create({
      name: 'Dr. John Smith',
      email: 'faculty@campus.com',
      password: hashedPassword,
      phone: '+919876543211',
      role: 'faculty',
      branch: cseBranch._id,
      emailVerified: true,
      approvalStatus: 'approved',
      teacherCode: 'TC24CSE001'
    });
    console.log('✅ Faculty created - Email: faculty@campus.com, Password: password123');

    // 3. Club Admin
    const clubAdmin = await User.create({
      name: 'Sarah Johnson',
      email: 'clubadmin@campus.com',
      password: hashedPassword,
      phone: '+919876543212',
      role: 'club_admin',
      branch: cseBranch._id,
      clubsManaged: [techClub._id],
      emailVerified: true,
      approvalStatus: 'approved'
    });
    
    // Update club with actual admin
    techClub.admin = clubAdmin._id;
    await techClub.save();
    
    culturalClub.admin = clubAdmin._id;
    await culturalClub.save();
    
    console.log('✅ Club Admin created - Email: clubadmin@campus.com, Password: password123');

    // 4. Student (Approved)
    const student = await User.create({
      name: 'Alice Williams',
      email: 'student@campus.com',
      password: hashedPassword,
      phone: '+919876543213',
      branch: cseBranch._id,
      year: 2,
      yearOfAdmission: 2023,
      classSection: 'A',
      emailVerified: true,
      approvalStatus: 'approved',
      blockchainId: '2301CSE0001'
    });
    console.log('✅ Student (Approved) created - Email: student@campus.com, Password: password123');

    // 5. Student (Pending Approval)
    const pendingStudent = await User.create({
      name: 'Bob Martinez',
      email: 'pending@campus.com',
      password: hashedPassword,
      phone: '+919876543214',
      role: 'student',
      branch: eceBranch._id,
      year: 1,
      yearOfAdmission: 2024,
      classSection: 'B',
      emailVerified: true,
      approvalStatus: 'pending'
    });
    console.log('✅ Student (Pending) created - Email: pending@campus.com, Password: password123');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📋 Summary:');
    console.log('━'.repeat(60));
    console.log('Role            | Email                 | Password');
    console.log('━'.repeat(60));
    console.log('College Admin   | admin@campus.com      | password123');
    console.log('Faculty         | faculty@campus.com    | password123');
    console.log('Club Admin      | clubadmin@campus.com  | password123');
    console.log('Student (✓)     | student@campus.com    | password123');
    console.log('Student (⏳)    | pending@campus.com    | password123');
    console.log('━'.repeat(60));
    console.log('\n💡 All users are email verified and ready to login!');
    console.log('💡 Pending student needs admin approval to access dashboard.');
    console.log('\n📚 Departments: Engineering (ENG)');
    console.log('🌿 Branches: CSE, AIML, CIC, AIDS, IT, CSBS, ECE, EEE, MECH, CIVIL, CSD, CSIT
    console.log('\n📚 Departments created: Computer Science (CS), Electronics (EC)');
    console.log('🎭 Clubs created: Tech Club, Cultural Club\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
