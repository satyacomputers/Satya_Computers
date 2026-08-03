const fs = require('fs');
const content = fs.readFileSync('d:/Satya_Computers/tmp/recovered.json', 'utf16le');
// Find the first '[' and last ']'
const start = content.indexOf('[');
const end = content.lastIndexOf(']');
if (start !== -1 && end !== -1) {
  const json = content.substring(start, end + 1);
  try {
    const data = JSON.parse(json);
    console.log(JSON.stringify(data.map(p => p.name), null, 2));
  } catch (e) {
    console.log('JSON Parse Error: ' + e.message);
  }
} else {
  console.log('No JSON found');
}
