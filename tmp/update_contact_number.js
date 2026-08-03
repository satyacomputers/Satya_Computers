const fs = require('fs');
const path = require('path');

const files = [
  'components/ui/EngineerHotline.tsx',
  'components/store/BulkPricingMatrix.tsx',
  'components/sections/FlashSaleBanner.tsx',
  'components/sections/HotOffers.tsx',
  'components/sections/InteractiveFAQ.tsx',
  'components/sections/SolutionsCards.tsx',
  'app/warranty/page.tsx',
  'app/order-status/page.tsx',
  'app/checkout/page.tsx',
  'app/admin/billing/page.tsx'
];

const oldNum = '8309178589';
const newNum = '9640272323';

files.forEach(file => {
  const filePath = path.join('d:/Satya_Computers', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.split(oldNum).join(newNum);
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Updated: ${file}`);
    } else {
      console.log(`No changes needed: ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
