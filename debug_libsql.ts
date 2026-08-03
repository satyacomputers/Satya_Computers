import 'dotenv/config';
console.log('URL:', process.env.DATABASE_URL);
console.log('Token:', process.env.DATABASE_AUTH_TOKEN ? 'Present' : 'Missing');

import { createClient } from '@libsql/client';

try {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  console.log('LibSQL client created successfully');
} catch (err) {
  console.error('Failed to create LibSQL client:', err);
}
