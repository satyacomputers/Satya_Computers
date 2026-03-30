import { createClient } from '@libsql/client';

const run = async () => {
  const client = createClient({
    url: 'libsql://satyacomputers-satyacomputers.aws-ap-south-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM4Njg4NzYsImlkIjoiMDE5ZDAyYzQtZDQwMS03NWJmLTk5ZmMtNjg4OWQ5YTMwY2Q2IiwicmlkIjoiMGZjOWE4NzctNTEzYS00ZThmLTlmZjgtNTdjNTIyYjEzY2E4In0.wmogl18t1wttvPZPQMU3iarysjOUOLktorzy81GmILcdAQ6fy7IaONanRVKxeOKILDkovIAXpqOyL4amv6sGAQ'
  });
  
  try {
    const resBase = await client.execute('ALTER TABLE "Product" ADD COLUMN basePrice REAL;');
    console.log('Success basePrice:', resBase);
  } catch(e) {
    console.log('Error basePrice:', e.message);
  }

  try {
    const resMrp = await client.execute('ALTER TABLE "Product" ADD COLUMN mrp REAL;');
    console.log('Success mrp:', resMrp);
  } catch(e) {
    console.log('Error mrp:', e.message);
  }
}

run();
