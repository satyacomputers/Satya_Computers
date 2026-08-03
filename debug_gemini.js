require('dotenv').config();
const API_KEY = process.env.GEMINI_API_KEY;
const fs = require('fs');

async function main() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: 'Hi, say hello' }] }]
    })
  });
  const body = await response.text();
  fs.writeFileSync('gemini_test_result.txt', `STATUS: ${response.status}\nBODY:\n${body}`);
  console.log('Done. Check gemini_test_result.txt');
}

main().catch(e => fs.writeFileSync('gemini_test_result.txt', 'ERROR: ' + e.message));
