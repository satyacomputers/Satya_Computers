require('dotenv').config();
const { compare } = require('bcryptjs');

const password = 'Satya@8589';
const hash = process.env.ADMIN_PASSWORD_HASH;

console.log('Testing with Env Hash:', hash);
console.log('Password length:', password.length);

compare(password, hash).then(res => {
  console.log('Does it match?', res);
}).catch(err => {
  console.error('Bcrypt Error:', err);
});
