const { createClient } = require('@libsql/client');

const oldClient = createClient({
  url: 'libsql://satyacomputer-venky214.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM2ODMxOTAsImlkIjoiMDE5Y2Y3YmYtZTkwMS03NjYyLThkNzktMjU1NjQ4NWVjYWUxIiwicmlkIjoiNTE3YjBkNmUtN2M5Mi00NmM1LWI4ZjUtYzA3ZmE4ODU1MmZiIn0.HffDHocx5v1gYuIRIsy_k9Bd_eJyTTRGE-UNw6gKdvFN12dD2JxVxTkDzNq9ouW96YKW7qAZCqyET2ZVc3D1Cg'
});

async function run() {
  console.log('Inspecting OLD database...');
  const res = await oldClient.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_prisma%'");
  const tables = res.rows.map(r => r.name);
  console.log('Tables found: ' + tables.join(', '));

  for (const table of tables) {
    const r = await oldClient.execute(`SELECT COUNT(*) as count FROM "${table}"`);
    console.log(`Table: ${table} | Rows: ${r.rows[0].count}`);
  }
}

run();
