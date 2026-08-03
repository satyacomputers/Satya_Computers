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

async function migrate() {
  const res = await oldClient.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_prisma%'");
  const tables = res.rows.map(r => r.name);
  
  for (const table of tables) {
    console.log(`Migrating table: ${table}`);
    const dataRes = await oldClient.execute(`SELECT * FROM "${table}"`);
    
    // Clear new table
    await newClient.execute(`DELETE FROM "${table}"`);
    
    if (dataRes.rows.length === 0) {
        console.log(`Skipping ${table} (0 rows)`);
        continue;
    }

    const columns = Object.keys(dataRes.rows[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO "${table}" (${columns.map(c => '"'+c+'"').join(', ')}) VALUES (${placeholders})`;

    for (const row of dataRes.rows) {
        const args = columns.map(c => row[c]);
        try {
            await newClient.execute({ sql, args });
        } catch (e) {
            console.error(`Error in ${table}: ${e.message}`);
        }
    }
    console.log(`Migrated ${dataRes.rows.length} rows for ${table}`);
  }
}

migrate().then(() => console.log('All tables shifted successfully.')).catch(console.error);
