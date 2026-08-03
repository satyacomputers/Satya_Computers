const bcrypt = require('bcryptjs');
const hash = '$2b$10$OnUlOciLZy7c7PvQ2hMgqebds8MGkFp/mxi2Oroe4f/zZe2YXLpZi';
const pw = 'Satya@8589';

async function check() {
  const match = await bcrypt.compare(pw, hash);
  console.log('Password Match:', match);
}
check();
