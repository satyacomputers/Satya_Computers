export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category?: 'business' | 'gaming' | 'creator' | 'student' | 'ultrabook' | 'workstation' | '2-in-1' | 'parts';
  price: number;
  originalPrice: number;
  mrp?: number;
  image: string;
  images?: string[];
  badge?: 'NEW' | 'HOT' | 'SALE';
  description: string;
  longDescription?: string;
  highlights?: string[];
  stock?: number;
  stockStatus?: string;
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

export const products: Product[] = [
  {
    "id": "SC-DEL-5430",
    "name": "DELL LATITUDE 5430",
    "slug": "dell-latitude-5430",
    "brand": "Dell",
    "category": "business",
    "price": 35000,
    "originalPrice": 43750,
    "image": "/products/dell_latitude_5430.png",
    "images": ["/products/dell_latitude_5430.png"],
    "description": "Premium Dell Latitude 5430 business laptop. High-performance i5 12th Generation processor for corporate tasks.",
    "specs": {
      "processor": "i5 12th Gen",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "SC-HP-260G3",
    "name": "HP PRODESK 260 G3 TINY CPU",
    "slug": "hp-prodesk-260-g3-tiny",
    "brand": "HP",
    "category": "business",
    "price": 13000,
    "originalPrice": 16250,
    "image": "/products/hp_prodesk_260_g3.png",
    "images": ["/products/hp_prodesk_260_g3.png"],
    "description": "Compact and powerful HP ProDesk 260 G3 Tiny Desktop. Ultra-small form factor with i5 7th Gen performance.",
    "specs": {
      "processor": "i5 7th Gen",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "N/A"
    }
  },
  {
    "id": "SC-HP-430G3",
    "name": "HP 430 G3",
    "slug": "hp-430-g3",
    "brand": "HP",
    "category": "business",
    "price": 13000,
    "originalPrice": 16250,
    "image": "/products/hp_430_g3.png",
    "images": ["/products/hp_430_g3.png"],
    "description": "Reliable HP ProBook 430 G3 laptop. Efficient i5 6th Gen processor for daily professional use.",
    "specs": {
      "processor": "i5 6th Gen",
      "ram": "8GB",
      "storage": "128GB SSD",
      "screen": "13.3\" FHD"
    }
  },
  {
    "id": "SC-HP-445G6",
    "name": "HP PROBOOK 445-G6 AMD RYZEN 5",
    "slug": "hp-probook-445-g6-ryzen",
    "brand": "HP",
    "category": "business",
    "price": 17000,
    "originalPrice": 21250,
    "image": "/products/hp_probook_445_g6.png",
    "images": ["/products/hp_probook_445_g6.png"],
    "description": "Modern HP ProBook 445-G6 powered by AMD Ryzen 5. Sleek design with high-fidelity performance.",
    "specs": {
      "processor": "AMD Ryzen 5",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "SC-LEN-P53",
    "name": "LENOVO THINKPAD P53 (4GB GRAPHICS)",
    "slug": "lenovo-thinkpad-p53-graphics",
    "brand": "Lenovo",
    "category": "workstation",
    "price": 37000,
    "originalPrice": 46250,
    "image": "/products/lenovo_thinkpad_p53.png",
    "images": ["/products/lenovo_thinkpad_p53.png"],
    "description": "Powerful Lenovo ThinkPad P53 Mobile Workstation. Professional i7 9th Gen with 4GB discrete graphics for engineering and design.",
    "specs": {
      "processor": "i7 9th Gen",
      "ram": "16GB",
      "storage": "512GB SSD",
      "screen": "15.6\" FHD"
    }
  }
];

// Highlights by brand pattern
function generateHighlights(p: Product): string[] {
  if (p.highlights && p.highlights.length) return p.highlights;
  const h: string[] = [
    `${p.specs.processor} processor`,
    `${p.specs.ram} RAM`,
    `${p.specs.storage} fast storage`,
    `${p.specs.screen} display`,
  ];
  if (p.specs.gpu) h.push(`${p.specs.gpu} graphics`);
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

  const FALLBACK_IMAGE = '/products/dell_laptop_premium.png';

  // Use valid provided images.
  let validGallery = (p.images || []).filter(img => typeof img === 'string' && img.trim() !== '');
  let primaryImage = (typeof p.image === 'string' && p.image.trim() !== '') ? p.image : FALLBACK_IMAGE;
  
  // Combine primary image with gallery, avoiding duplicates and empty strings
  let finalImages = [primaryImage, ...validGallery].filter(img => img && img.trim() !== '');
  
  // Remove duplicates
  finalImages = Array.from(new Set(finalImages));
  
  // Final fallback
  if (finalImages.length === 0) finalImages = [FALLBACK_IMAGE];
  if (!primaryImage || primaryImage === '') primaryImage = finalImages[0];

  return {
    ...p,
    category,
    image: primaryImage,
    images: finalImages,
    longDescription: p.longDescription || `The ${p.name} offers ${p.specs.processor} performance with ${p.specs.ram} RAM and ${p.specs.storage} of fast storage. Its ${p.specs.screen} display delivers crisp, vibrant visuals. ${p.description} Available now at Satya Computers, Ameerpet, Hyderabad — walk in for a demo or order online.`,
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
