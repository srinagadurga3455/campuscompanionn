const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

console.log('=== Testing User Query with Populate ===\n');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('✅ MongoDB Connected\n');

        try {
            // Test 1: Simple query without populate
            console.log('Test 1: Fetching users without populate...');
            const usersWithoutPopulate = await User.find({ role: 'student', approvalStatus: 'approved' })
                .select('-password')
                .limit(5);
            console.log(`✅ Found ${usersWithoutPopulate.length} students without populate`);

            // Test 2: Query with populate
            console.log('\nTest 2: Fetching users with populate...');
            const usersWithPopulate = await User.find({ role: 'student', approvalStatus: 'approved' })
                .select('-password')
                .populate('branch', 'name code')
                .limit(5);
            console.log(`✅ Found ${usersWithPopulate.length} students with populate`);

            if (usersWithPopulate.length > 0) {
                console.log('\nSample user:');
                console.log('- Name:', usersWithPopulate[0].name);
                console.log('- Email:', usersWithPopulate[0].email);
                console.log('- Branch:', usersWithPopulate[0].branch);
            }

            // Test 3: Query all users (like the failing endpoint)
            console.log('\nTest 3: Fetching all users with populate...');
            const allUsers = await User.find({})
                .select('-password')
                .populate('branch')
                .sort({ createdAt: -1 });
            console.log(`✅ Found ${allUsers.length} total users`);

            console.log('\n✅ All tests passed!');

        } catch (error) {
            console.error('\n❌ Error during query:', error.message);
            console.error('Stack:', error.stack);
        }

        mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });
