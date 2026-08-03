const { createClient } = require('@libsql/client');
const client = createClient({
  url: 'libsql://satyacomputer-venky214.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM2ODMxOTAsImlkIjoiMDE5Y2Y3YmYtZTkwMS03NjYyLThkNzktMjU1NjQ4NWVjYWUxIiwicmlkIjoiNTE3YjBkNmUtN2M5Mi00NmM1LWI4ZjUtYzA3ZmE4ODU1MmZiIn0.HffDHocx5v1gYuIRIsy_k9Bd_eJyTTRGE-UNw6gKdvFN12dD2JxVxTkDzNq9ouW96YKW7qAZCqyET2ZVc3D1Cg',
});

async function checkDiversity() {
  const result = await client.execute('SELECT image, name FROM Product');
  const images = result.rows.map(r => r.image);
  const uniqueImages = new Set(images);
  console.log(`Total Products: ${images.length}`);
  console.log(`Unique Images: ${uniqueImages.size}`);
  
  if (images.length !== uniqueImages.size) {
    console.log('\n--- Duplicated Images ---');
    const counts = {};
    images.forEach(img => counts[img] = (counts[img] || 0) + 1);
    for (const img in counts) {
        if (counts[img] > 1) {
            const matches = result.rows.filter(r => r.image === img).map(r => r.name);
            console.log(`${img}: ${counts[img]} times used by: ${matches.join(', ')}`);
        }
    }
  } else {
    console.log('Congrats! Every product has a unique image.');
  }
}

checkDiversity();
