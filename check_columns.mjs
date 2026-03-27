import { createClient } from '@libsql/client';

const run = async () => {
  const client = createClient({
    url: 'libsql://satyacomputers-satyacomputers.aws-ap-south-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM4Njg4NzYsImlkIjoiMDE5ZDAyYzQtZDQwMS03NWJmLTk5ZmMtNjg4OWQ5YTMwY2Q2IiwicmlkIjoiMGZjOWE4NzctNTEzYS00ZThmLTlmZjgtNTdjNTIyYjEzY2E4In0.wmogl18t1wttvPZPQMU3iarysjOUOLktorzy81GmILcdAQ6fy7IaONanRVKxeOKILDkovIAXpqOyL4amv6sGAQ'
  });
  
  try {
    const res = await client.execute("PRAGMA table_info(Product);");
    console.log(JSON.stringify(res.rows.map(r => r.name)));
  } catch(e) {
    console.log('Error:', e.message);
  }
}

run();
