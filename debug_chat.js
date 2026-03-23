const http = require('http');
const fs = require('fs');

function test(message) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ messages: [{ role: 'user', content: message }] });
    const req = http.request({
      hostname: 'localhost', port: 3000, path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        fs.appendFileSync('chat_test_out.txt', 
          `\nQUERY: "${message}"\nSTATUS: ${res.statusCode}\nPRODUCTS(${parsed.products?.length||0}): ${parsed.products?.map(p=>p.name+' ['+p.id+']').join(', ')||'none'}\nTEXT: ${parsed.text?.slice(0,300)}\n---\n`
        );
        resolve();
      });
    });
    req.on('error', e => { fs.appendFileSync('chat_test_out.txt', `ERROR: ${e.message}\n`); resolve(); });
    req.write(body);
    req.end();
  });
}

fs.writeFileSync('chat_test_out.txt', ''); // clear
async function run() {
  await test('Show me Dell laptops');
  await test('What laptops are available?');
  await test('HP laptops under 20000');
  await test('Lenovo ThinkPad');
  await test('Apple MacBook');
}
run();
