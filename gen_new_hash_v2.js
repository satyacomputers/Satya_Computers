const bcrypt = require('bcryptjs');
const fs = require('fs');
const pw = 'Satya@8589';

bcrypt.hash(pw, 10, (err, hash) => {
  fs.writeFileSync('new_hash.txt', hash);
  console.log('Hash written to new_hash.txt');
});
