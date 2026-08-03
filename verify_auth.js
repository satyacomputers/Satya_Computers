const bcrypt = require('bcryptjs');
const pw = 'Satya@8589';
const hash = '$2b$10$OnUlOciLZy7c7PvQ2hMgqebds8MGkFp/mxi2Oroe4f/zZe2YXLpZi';

bcrypt.compare(pw, hash).then(res => {
  console.log('Match:', res);
});
