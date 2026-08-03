import 'dotenv/config';
console.log('DB URL:', process.env.DATABASE_URL?.substring(0, 20) + '...');
console.log('Admin User:', process.env.ADMIN_USERNAME);
console.log('Admin Hash:', process.env.ADMIN_PASSWORD_HASH);
