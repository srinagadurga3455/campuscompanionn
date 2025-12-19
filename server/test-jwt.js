const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

console.log('=== JWT Test ===\n');

if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set in .env file');
    process.exit(1);
}

console.log('✅ JWT_SECRET is set');

// Test token generation
const testPayload = {
    userId: '507f1f77bcf86cd799439011',
    role: 'college_admin'
};

try {
    const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Token generation successful');
    console.log('Sample token:', token.substring(0, 50) + '...');

    // Test token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verification successful');
    console.log('Decoded payload:', decoded);
} catch (error) {
    console.error('❌ JWT Error:', error.message);
}
