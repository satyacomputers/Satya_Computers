const fs = require('fs');
const path = require('path');

async function testDownload() {
  const url = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800';
  const dest = path.join(__dirname, 'test_image.jpg');
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    console.log('Downloaded to:', dest);
  } catch (e) {
    console.error('Download failed:', e.message);
  }
}

testDownload();
