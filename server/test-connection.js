const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('=== Server Configuration Check ===\n');

// Check environment variables
console.log('Environment Variables:');
console.log('- PORT:', process.env.PORT || '5000 (default)');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Not set');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Not set');
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:3000 (default)');
console.log('\n');

// Test MongoDB connection
if (process.env.MONGODB_URI) {
    console.log('Testing MongoDB connection...');
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(async () => {
            console.log('✅ MongoDB Connected Successfully\n');

            // Check collections
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log('Available Collections:');
            collections.forEach(col => {
                console.log(`  - ${col.name}`);
            });

            // Check User model
            const User = require('./models/User');
            const userCount = await User.countDocuments();
            console.log(`\nTotal Users: ${userCount}`);

            const pendingCount = await User.countDocuments({ approvalStatus: 'pending' });
            console.log(`Pending Users: ${pendingCount}`);

            const approvedCount = await User.countDocuments({ approvalStatus: 'approved' });
            console.log(`Approved Users: ${approvedCount}`);

            const adminCount = await User.countDocuments({ role: 'college_admin' });
            console.log(`College Admins: ${adminCount}`);

            mongoose.connection.close();
            console.log('\n✅ Diagnostic complete');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ MongoDB Connection Error:', err.message);
            process.exit(1);
        });
} else {
    console.error('❌ MONGODB_URI not set in .env file');
    process.exit(1);
}
