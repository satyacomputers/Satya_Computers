const http = require('http');

http.get('http://localhost:3000/api/admin/products', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const products = JSON.parse(data);
      console.log('Image Column Value:', products[0].image);
    } catch (e) {
      console.log('Error parsing JSON:', data);
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
