import { createClient } from '@libsql/client';

const run = async () => {
  const client = createClient({
    url: 'libsql://satyacomputers-satyacomputers.aws-ap-south-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM4Njg4NzYsImlkIjoiMDE5ZDAyYzQtZDQwMS03NWJmLTk5ZmMtNjg4OWQ5YTMwY2Q2IiwicmlkIjoiMGZjOWE4NzctNTEzYS00ZThmLTlmZjgtNTdjNTIyYjEzY2E4In0.wmogl18t1wttvPZPQMU3iarysjOUOLktorzy81GmILcdAQ6fy7IaONanRVKxeOKILDkovIAXpqOyL4amv6sGAQ'
  });
  
  try {
    await client.execute('ALTER TABLE "Product" ADD COLUMN bulkPrice5_10 REAL;');
    console.log('Added bulkPrice5_10');
  } catch(e) { console.log(e.message); }

  try {
    await client.execute('ALTER TABLE "Product" ADD COLUMN bulkPrice11_25 REAL;');
    console.log('Added bulkPrice11_25');
  } catch(e) { console.log(e.message); }

  try {
    await client.execute('ALTER TABLE "Product" ADD COLUMN bulkPrice26Plus REAL;');
    console.log('Added bulkPrice26Plus');
  } catch(e) { console.log(e.message); }

  try {
    await client.execute('ALTER TABLE "Product" ADD COLUMN minOrderQty INTEGER DEFAULT 1;');
    console.log('Added minOrderQty');
  } catch(e) { console.log(e.message); }
}

run();
