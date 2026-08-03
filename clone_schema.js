const { createClient } = require('@libsql/client');
require('dotenv').config();

const oldClient = createClient({
  url: 'libsql://satyacomputer-venky214.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM2ODMxOTAsImlkIjoiMDE5Y2Y3YmYtZTkwMS03NjYyLThkNzktMjU1NjQ4NWVjYWUxIiwicmlkIjoiNTE3YjBkNmUtN2M5Mi00NmM1LWI4ZjUtYzA3ZmE4ODU1MmZiIn0.HffDHocx5v1gYuIRIsy_k9Bd_eJyTTRGE-UNw6gKdvFN12dD2JxVxTkDzNq9ouW96YKW7qAZCqyET2ZVc3D1Cg'
});

const newClient = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

async function clone() {
  console.log('Cloning schema from old DB...');
  const res = await oldClient.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name NOT LIKE '_prisma%' AND name NOT LIKE 'sqlite%'");
  for (const row of res.rows) {
    if (!row.sql) continue;
    try {
      await newClient.execute(row.sql);
      console.log('Created table.');
    } catch (e) {
      console.error('Skip/Fail: ' + e.message);
    }
  }
}

clone().then(() => console.log('Schema cloned.')).catch(console.error);
