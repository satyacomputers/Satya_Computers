const bcrypt = require('bcryptjs');
const hash = '$2b$10$vFI5kjuHcSeK9iOisJXZoOvvpdst4rIhkpjkot0nFVZ0HIt8STlNMO';
const pw = 'Satya@8589';

bcrypt.compare(pw, hash, (err, res) => {
  console.log('Match:', res);
});
