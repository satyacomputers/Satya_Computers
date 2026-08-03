const bcrypt = require('bcryptjs');
const pw = 'Satya@8589';

bcrypt.hash(pw, 10, (err, hash) => {
  console.log('New Hash:', hash);
});
