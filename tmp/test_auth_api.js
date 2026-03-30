
async function testAuth() {
  const url = 'http://localhost:3000/api/auth/session';
  console.log(`Fetching ${url}...`);
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Response text: ${text.substring(0, 200)}`);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testAuth();
