const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN
});

const csvPath = path.join(process.cwd(), 'public', 'products', 'products.csv');
const tsPath = path.join(process.cwd(), 'data', 'products.ts');

const appleIds = [
  '1517336714731-489689fd1ca8', '1496171367470-f4d9dca424bf', '1611186871348-b1ce696e52c9',
  '1525547710557-767a9bc623cc', '1541807084-58a848dd2047'
];
const gamingIds = [
  '1603302523023-251c13d37fdf', '1595113316349-9fa4eb24f884', '1544197150-b99a580bb7a8',
  '1624701928517-44c8ac49d93c'
];
const dellIds = [
  '1587612711718-d9a2cd47970d', '1593642702821-c8da6a599e03', '1593642632823-8f785ba67e45'
];
const lenovoIds = [
  '1531297172864-559d3b102283', '1484704849700-f032a568e944'
];
const hpIds = [
  '1588872657578-7efd1f1555ed', '1575318634581-f599747498ce'
];
const generalIds = [
  '1593642702821-c8da6a599e03', '1593642632823-8f785ba67e45', '1496171367470-f4d9dca424bf'
];

async function run() {
  console.log('--- REBUILDING PRODUCTS ECOSYSTEM ---');

  // 1. Read CSV
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // 2. Prepare Data for TS and DB
  const tsProducts = [];
  
  // Clear DB Tables
  await client.execute('DELETE FROM Product');
  await client.execute('DELETE FROM Category');

  // Pre-scan /public/products to find alt images
  const publicProductsDir = path.join(process.cwd(), 'public', 'products');
  const allFiles = fs.readdirSync(publicProductsDir);

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const id = row['S.No'];
    const name = row['Model'];
    const price = parseInt(row['Price']) || 0;
    const config = row['Configuration'] || '';
    
    let brand = 'Mixed';
    const bh = name.toUpperCase();
    if (bh.includes('DELL')) brand = 'Dell';
    else if (bh.includes('LENOVO') || bh.includes('THINKPAD')) brand = 'Lenovo';
    else if (bh.includes('HP')) brand = 'HP';
    else if (bh.includes('MACBOOK') || bh.includes('APPLE')) brand = 'Apple';

    // ── IMAGE SELECTION STRATEGY ──
    // 1. Try clean_X.png
    let mainImage = `/products/clean_${id}.png`;
    
    // 2. Try model-specific naming
    const normalizedName = name.toLowerCase().replace(/ \(/g, '_').replace(/\)/g, '').replace(/ /g, '_').replace(/&/g, 'and');
    const specificImage = allFiles.find(f => f.toLowerCase().includes(normalizedName) && !f.includes('_alt'));
    if (specificImage) {
      mainImage = `/products/${specificImage}`;
    }

    // 3. Fallback check (if clean_X.png doesn't exist)
    if (!fs.existsSync(path.join(publicProductsDir, `clean_${id}.png`)) && !specificImage) {
      const brandDefault = allFiles.find(f => f.toLowerCase().startsWith(brand.toLowerCase()) && f.endsWith('.png'));
      mainImage = brandDefault ? `/products/${brandDefault}` : '/products/dell_laptop_premium.png';
    }

    // Find Related/Alt Images
    const altImages = allFiles
      .filter(f => f.includes(normalizedName) && f.includes('_alt'))
      .map(f => `/products/${f}`);
    
    const imageGallery = [mainImage, ...altImages];
    if (imageGallery.length < 2) imageGallery.push(mainImage); // Ensure at least 2 for gallery UI

    let category = 'business';
    if (bh.includes('GAMING') || bh.includes('ROG') || bh.includes('TUF') || bh.includes('NITRO')) category = 'gaming';
    else if (bh.includes('PRECISION') || bh.includes('ZBOOK') || bh.includes('WORKSTATION')) category = 'workstation';
    else if (bh.includes('MACBOOK') || bh.includes('AIR')) category = 'ultrabook';
    else if (bh.includes('PARTS') || bh.includes('RAM') || bh.includes('SSD')) category = 'parts';

    const product = {
      id: id,
      name: name,
      slug: id, 
      brand: brand,
      category: category,
      price: price,
      originalPrice: Math.round(price * 1.25),
      image: mainImage,
      images: imageGallery,
      description: `Premium ${brand} ${name}. ${config} with ${row['RAM'] || '8GB'} RAM and ${row['Storage'] || '256'}GB storage.`,
      specs: {
        processor: config || 'Intel Core',
        ram: row['RAM'] || '8GB',
        storage: row['Storage'] ? `${row['Storage']}GB SSD` : '256GB SSD',
        screen: row['Size'] ? `${row['Size']}" FHD` : '14" FHD'
      }
    };

    tsProducts.push(product);

    // Insert into DB
    const os = brand === 'Apple' ? 'macOS Sonoma' : 'Windows 11 Pro';
    await client.execute({
      sql: `INSERT INTO Product (id, name, brand, category, processor, ram, storage, display, os, price, bulkPrice5_10, bulkPrice11_25, bulkPrice26Plus, stockStatus, image, description, isFeatured, warranty, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        id, name, brand, category, product.specs.processor, product.specs.ram, product.specs.storage, product.specs.screen, os, 
        price, Math.round(price * 0.95), Math.round(price * 0.9), Math.round(price * 0.85), 
        'In Stock', mainImage, product.description, price >= 40000 ? 1 : 0, row['Warranty'] || '1 Year'
      ]
    });
  }

  // 3. Write data/products.ts
  const tsContent = `export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category?: 'business' | 'gaming' | 'creator' | 'student' | 'ultrabook' | 'workstation' | '2-in-1' | 'parts';
  price: number;
  originalPrice: number;
  image: string;
  images?: string[];
  badge?: 'NEW' | 'HOT' | 'SALE';
  description: string;
  longDescription?: string;
  highlights?: string[];
  specs: {
    processor: string;
    ram: string;
    storage: string;
    screen: string;
    gpu?: string;
    battery?: string;
    weight?: string;
    os?: string;
    ports?: string;
    camera?: string;
  };
}

export const products: Product[] = ${JSON.stringify(tsProducts, null, 2)};

// Highlights by brand pattern
function generateHighlights(p: Product): string[] {
  if (p.highlights && p.highlights.length) return p.highlights;
  const h: string[] = [
    \`\${p.specs.processor} processor\`,
    \`\${p.specs.ram} RAM\`,
    \`\${p.specs.storage} fast storage\`,
    \`\${p.specs.screen} display\`,
  ];
  if (p.specs.gpu) h.push(\`\${p.specs.gpu} graphics\`);
  if (brandHighlights[p.brand.toLowerCase()]) {
    h.push(...brandHighlights[p.brand.toLowerCase()]);
  }
  h.push('✓ 7-Day easy return policy');
  return h.slice(0, 6);
}

const brandHighlights: Record<string, string[]> = {
  apple: ['macOS Sonoma - Seamless integration', 'All-day battery life'],
  dell: ['Durable Latitude magnesium chassis', 'Enterprise-grade security'],
  hp: ['EliteBook premium build', 'Crisp FHD display'],
  lenovo: ['Legendary ThinkPad keyboard', 'Rugged MIL-STD-810G compliant']
};

export function enrichProduct(p: Product) {
  const category = p.category ?? ((): NonNullable<Product['category']> => {
    const n = p.name.toLowerCase();
    if (n.includes('gaming')) return 'gaming';
    if (n.includes('workstation') || n.includes('precision')) return 'workstation';
    if (n.includes('macbook')) return 'ultrabook';
    if (n.includes('latitude') || n.includes('elitebook') || n.includes('thinkpad')) return 'business';
    return 'student';
  })();

  return {
    ...p,
    category,
    images: p.images?.length ? p.images : [p.image, p.image],
    longDescription: p.longDescription || \`The \${p.name} offers \${p.specs.processor} performance with \${p.specs.ram} RAM and \${p.specs.storage} of fast storage. Its \${p.specs.screen} display delivers crisp, vibrant visuals. \${p.description} Available now at Satya Computers, Ameerpet, Hyderabad — walk in for a demo or order online.\`,
    highlights: generateHighlights(p),
  };
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug || p.id === slug);
}

export function getAllProducts(): Product[] {
  return products;
}

export function getRecommendedProducts(current: Product, count = 4): Product[] {
  const enriched = enrichProduct(current);
  const others = products.filter(p => p.id !== current.id);
  const sameCategory = others.filter(p => enrichProduct(p).category === enriched.category);
  const sameBrand = others.filter(p => p.brand === current.brand && !sameCategory.includes(p));
  
  return [...sameCategory, ...sameBrand, ...others].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, count);
}
`;

  fs.writeFileSync(tsPath, tsContent);
  console.log('--- REBUILD COMPLETE: REAL LOCAL ASSETS SYNCED ---');
}

run();
