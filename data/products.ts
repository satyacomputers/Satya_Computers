export interface Product {
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

export const products: Product[] = [
  {
    "id": "1",
    "name": "BASIC MODEL (Dell/Lenovo)",
    "slug": "1",
    "brand": "Dell",
    "category": "business",
    "price": 6999,
    "originalPrice": 8749,
    "image": "/products/clean_1.png",
    "images": [
      "/products/clean_1.png",
      "/products/clean_1.png"
    ],
    "description": "Premium Dell BASIC MODEL (Dell/Lenovo). i5 with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "2",
    "name": "DELL & LENOVO & HP",
    "slug": "2",
    "brand": "Dell",
    "category": "business",
    "price": 7999,
    "originalPrice": 9999,
    "image": "/products/clean_2.png",
    "images": [
      "/products/clean_2.png",
      "/products/clean_2.png"
    ],
    "description": "Premium Dell DELL & LENOVO & HP. i5 3rd with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 3rd",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "3",
    "name": "LENOVO THINKPAD",
    "slug": "3",
    "brand": "Lenovo",
    "category": "business",
    "price": 10499,
    "originalPrice": 13124,
    "image": "/products/clean_3.png",
    "images": [
      "/products/clean_3.png",
      "/products/clean_3.png"
    ],
    "description": "Premium Lenovo LENOVO THINKPAD. i5 4th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 4th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "4",
    "name": "DELL LATITUDE 3400",
    "slug": "4",
    "brand": "Dell",
    "category": "business",
    "price": 17000,
    "originalPrice": 21250,
    "image": "/products/dell_latitude_3400.png",
    "images": [
      "/products/dell_latitude_3400.png",
      "/products/dell_latitude_3400_alt.png"
    ],
    "description": "Premium Dell DELL LATITUDE 3400. i5 8th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 8th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "5",
    "name": "DELL LATITUDE 7480",
    "slug": "5",
    "brand": "Dell",
    "category": "business",
    "price": 17000,
    "originalPrice": 21250,
    "image": "/products/dell_latitude_7480.png",
    "images": [
      "/products/dell_latitude_7480.png",
      "/products/dell_latitude_7480.png"
    ],
    "description": "Premium Dell DELL LATITUDE 7480. i5 7th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 7th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "6",
    "name": "DELL LATITUDE 7490",
    "slug": "6",
    "brand": "Dell",
    "category": "business",
    "price": 18000,
    "originalPrice": 22500,
    "image": "/products/dell_latitude_7490.png",
    "images": [
      "/products/dell_latitude_7490.png",
      "/products/dell_latitude_7490_alt.png"
    ],
    "description": "Premium Dell DELL LATITUDE 7490. i5 8th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 8th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "7",
    "name": "DELL LATITUDE 7400",
    "slug": "7",
    "brand": "Dell",
    "category": "business",
    "price": 18000,
    "originalPrice": 22500,
    "image": "/products/dell_latitude_7400.png",
    "images": [
      "/products/dell_latitude_7400.png",
      "/products/dell_latitude_7400_alt.png"
    ],
    "description": "Premium Dell DELL LATITUDE 7400. i5 8th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 8th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "8",
    "name": "DELL LATITUDE 7490",
    "slug": "8",
    "brand": "Dell",
    "category": "business",
    "price": 23000,
    "originalPrice": 28750,
    "image": "/products/dell_latitude_7490.png",
    "images": [
      "/products/dell_latitude_7490.png",
      "/products/dell_latitude_7490_alt.png"
    ],
    "description": "Premium Dell DELL LATITUDE 7490. i7 8th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i7 8th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "9",
    "name": "DELL LATITUDE 7400",
    "slug": "9",
    "brand": "Dell",
    "category": "business",
    "price": 21000,
    "originalPrice": 26250,
    "image": "/products/dell_latitude_7400.png",
    "images": [
      "/products/dell_latitude_7400.png",
      "/products/dell_latitude_7400_alt.png"
    ],
    "description": "Premium Dell DELL LATITUDE 7400. i7 8th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i7 8th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "10",
    "name": "DELL LATITUDE 5401 (2GB Graphics)",
    "slug": "10",
    "brand": "Dell",
    "category": "business",
    "price": 26000,
    "originalPrice": 32500,
    "image": "/products/clean_10.png",
    "images": [
      "/products/clean_10.png",
      "/products/clean_10.png"
    ],
    "description": "Premium Dell DELL LATITUDE 5401 (2GB Graphics). i7 9th with 16GB RAM and 256GB storage.",
    "specs": {
      "processor": "i7 9th",
      "ram": "16GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "11",
    "name": "DELL LATITUDE 3410",
    "slug": "11",
    "brand": "Dell",
    "category": "business",
    "price": 22000,
    "originalPrice": 27500,
    "image": "/products/dell_latitude_3410.png",
    "images": [
      "/products/dell_latitude_3410.png",
      "/products/dell_latitude_3410.png"
    ],
    "description": "Premium Dell DELL LATITUDE 3410. i5 10th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 10th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "12",
    "name": "DELL LATITUDE 5420",
    "slug": "12",
    "brand": "Dell",
    "category": "business",
    "price": 27000,
    "originalPrice": 33750,
    "image": "/products/dell_latitude_5420.png",
    "images": [
      "/products/dell_latitude_5420.png",
      "/products/dell_latitude_5420_alt.png"
    ],
    "description": "Premium Dell DELL LATITUDE 5420. i5 11th with 16GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 11th",
      "ram": "16GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "13",
    "name": "DELL LATITUDE 5430",
    "slug": "13",
    "brand": "Dell",
    "category": "business",
    "price": 32000,
    "originalPrice": 40000,
    "image": "/products/dell_latitude_5430.png",
    "images": [
      "/products/dell_latitude_5430.png",
      "/products/dell_latitude_5430.png"
    ],
    "description": "Premium Dell DELL LATITUDE 5430. i5 12th with 16GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 12th",
      "ram": "16GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "14",
    "name": "LENOVO THINKPAD T570",
    "slug": "14",
    "brand": "Lenovo",
    "category": "business",
    "price": 15000,
    "originalPrice": 18750,
    "image": "/products/clean_14.png",
    "images": [
      "/products/clean_14.png",
      "/products/clean_14.png"
    ],
    "description": "Premium Lenovo LENOVO THINKPAD T570. i5 6th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 6th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "15.6\" FHD"
    }
  },
  {
    "id": "15",
    "name": "LENOVO THINKPAD T480",
    "slug": "15",
    "brand": "Lenovo",
    "category": "business",
    "price": 22000,
    "originalPrice": 27500,
    "image": "/products/clean_15.png",
    "images": [
      "/products/clean_15.png",
      "/products/clean_15.png"
    ],
    "description": "Premium Lenovo LENOVO THINKPAD T480. i7 8th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i7 8th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "16",
    "name": "LENOVO THINKPAD L380 YOGA",
    "slug": "16",
    "brand": "Lenovo",
    "category": "business",
    "price": 20000,
    "originalPrice": 25000,
    "image": "/products/clean_16.png",
    "images": [
      "/products/clean_16.png",
      "/products/clean_16.png"
    ],
    "description": "Premium Lenovo LENOVO THINKPAD L380 YOGA. i5 8th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 8th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "17",
    "name": "LENOVO THINKPAD L13",
    "slug": "17",
    "brand": "Lenovo",
    "category": "business",
    "price": 23000,
    "originalPrice": 28750,
    "image": "/products/clean_17.png",
    "images": [
      "/products/clean_17.png",
      "/products/clean_17.png"
    ],
    "description": "Premium Lenovo LENOVO THINKPAD L13. i5 10th with 16GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 10th",
      "ram": "16GB",
      "storage": "256GB SSD",
      "screen": "13\" FHD"
    }
  },
  {
    "id": "18",
    "name": "LENOVO THINKPAD X280",
    "slug": "18",
    "brand": "Lenovo",
    "category": "business",
    "price": 22000,
    "originalPrice": 27500,
    "image": "/products/clean_18.png",
    "images": [
      "/products/clean_18.png",
      "/products/clean_18.png"
    ],
    "description": "Premium Lenovo LENOVO THINKPAD X280. i7 8th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i7 8th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "13\" FHD"
    }
  },
  {
    "id": "19",
    "name": "LENOVO THINKPAD L13",
    "slug": "19",
    "brand": "Lenovo",
    "category": "business",
    "price": 28000,
    "originalPrice": 35000,
    "image": "/products/clean_19.png",
    "images": [
      "/products/clean_19.png",
      "/products/clean_19.png"
    ],
    "description": "Premium Lenovo LENOVO THINKPAD L13. i5 11th with 16GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 11th",
      "ram": "16GB",
      "storage": "256GB SSD",
      "screen": "13\" FHD"
    }
  },
  {
    "id": "20",
    "name": "LENOVO THINKPAD P51 (4GB Graphics)",
    "slug": "20",
    "brand": "Lenovo",
    "category": "business",
    "price": 23000,
    "originalPrice": 28750,
    "image": "/products/clean_20.png",
    "images": [
      "/products/clean_20.png",
      "/products/clean_20.png"
    ],
    "description": "Premium Lenovo LENOVO THINKPAD P51 (4GB Graphics). i7 7th with 16GB RAM and 512GB storage.",
    "specs": {
      "processor": "i7 7th",
      "ram": "16GB",
      "storage": "512GB SSD",
      "screen": "15.6\" FHD"
    }
  },
  {
    "id": "21",
    "name": "LENOVO THINKPAD P52 (4GB Graphics)",
    "slug": "21",
    "brand": "Lenovo",
    "category": "business",
    "price": 28000,
    "originalPrice": 35000,
    "image": "/products/clean_21.png",
    "images": [
      "/products/clean_21.png",
      "/products/clean_21.png"
    ],
    "description": "Premium Lenovo LENOVO THINKPAD P52 (4GB Graphics). i7 8th with 16GB RAM and 512GB storage.",
    "specs": {
      "processor": "i7 8th",
      "ram": "16GB",
      "storage": "512GB SSD",
      "screen": "15.6\" FHD"
    }
  },
  {
    "id": "22",
    "name": "LENOVO THINKPAD P53 (4GB Graphics)",
    "slug": "22",
    "brand": "Lenovo",
    "category": "business",
    "price": 35000,
    "originalPrice": 43750,
    "image": "/products/clean_22.png",
    "images": [
      "/products/clean_22.png",
      "/products/clean_22.png"
    ],
    "description": "Premium Lenovo LENOVO THINKPAD P53 (4GB Graphics). i7 9th with 16GB RAM and 512GB storage.",
    "specs": {
      "processor": "i7 9th",
      "ram": "16GB",
      "storage": "512GB SSD",
      "screen": "15.6\" FHD"
    }
  },
  {
    "id": "23",
    "name": "LENOVO THINKPAD P15 (4GB Graphics)",
    "slug": "23",
    "brand": "Lenovo",
    "category": "business",
    "price": 40000,
    "originalPrice": 50000,
    "image": "/products/clean_23.png",
    "images": [
      "/products/clean_23.png",
      "/products/clean_23.png"
    ],
    "description": "Premium Lenovo LENOVO THINKPAD P15 (4GB Graphics). i7 10th with 16GB RAM and 512GB storage.",
    "specs": {
      "processor": "i7 10th",
      "ram": "16GB",
      "storage": "512GB SSD",
      "screen": "15.6\" FHD"
    }
  },
  {
    "id": "24",
    "name": "HP ELITEBOOK 640 G9",
    "slug": "24",
    "brand": "HP",
    "category": "business",
    "price": 35000,
    "originalPrice": 43750,
    "image": "/products/hp_elitebook_640_g9.png",
    "images": [
      "/products/hp_elitebook_640_g9.png",
      "/products/hp_elitebook_640_g9.png"
    ],
    "description": "Premium HP HP ELITEBOOK 640 G9. i5 12th with 16GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 12th",
      "ram": "16GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "25",
    "name": "HP ZBOOK G5",
    "slug": "25",
    "brand": "HP",
    "category": "workstation",
    "price": 40000,
    "originalPrice": 50000,
    "image": "/products/hp_zbook_g5.png",
    "images": [
      "/products/hp_zbook_g5.png",
      "/products/hp_zbook_g5.png"
    ],
    "description": "Premium HP HP ZBOOK G5. XEON with 16GB RAM and 512GB storage.",
    "specs": {
      "processor": "XEON",
      "ram": "16GB",
      "storage": "512GB SSD",
      "screen": "15.6\" FHD"
    }
  },
  {
    "id": "26",
    "name": "HP PROBOOK 430 G3",
    "slug": "26",
    "brand": "HP",
    "category": "business",
    "price": 19000,
    "originalPrice": 23750,
    "image": "/products/hp_probook_430_g3.png",
    "images": [
      "/products/hp_probook_430_g3.png",
      "/products/hp_probook_430_g3.png"
    ],
    "description": "Premium HP HP PROBOOK 430 G3. i5 8th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 8th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "27",
    "name": "HP ELITEBOOK 640 G5",
    "slug": "27",
    "brand": "HP",
    "category": "business",
    "price": 19000,
    "originalPrice": 23750,
    "image": "/products/hp_elitebook_640_g5.png",
    "images": [
      "/products/hp_elitebook_640_g5.png",
      "/products/hp_elitebook_640_g5_alt.png"
    ],
    "description": "Premium HP HP ELITEBOOK 640 G5. i5 8th with 8GB RAM and 256GB storage.",
    "specs": {
      "processor": "i5 8th",
      "ram": "8GB",
      "storage": "256GB SSD",
      "screen": "14\" FHD"
    }
  },
  {
    "id": "28",
    "name": "MACBOOK PRO A1990 (4GB Graphics)",
    "slug": "28",
    "brand": "Apple",
    "category": "ultrabook",
    "price": 36000,
    "originalPrice": 45000,
    "image": "/products/clean_28.png",
    "images": [
      "/products/clean_28.png",
      "/products/clean_28.png"
    ],
    "description": "Premium Apple MACBOOK PRO A1990 (4GB Graphics). i7 with 16GB RAM and 256GB storage.",
    "specs": {
      "processor": "i7",
      "ram": "16GB",
      "storage": "256GB SSD",
      "screen": "15\" FHD"
    }
  },
  {
    "id": "29",
    "name": "MACBOOK PRO A2141 (4GB Graphics)",
    "slug": "29",
    "brand": "Apple",
    "category": "ultrabook",
    "price": 42000,
    "originalPrice": 52500,
    "image": "/products/clean_29.png",
    "images": [
      "/products/clean_29.png",
      "/products/clean_29.png"
    ],
    "description": "Premium Apple MACBOOK PRO A2141 (4GB Graphics). i7 with 16GB RAM and 256GB storage.",
    "specs": {
      "processor": "i7",
      "ram": "16GB",
      "storage": "256GB SSD",
      "screen": "15\" FHD"
    }
  },
  {
    "id": "30",
    "name": "MACBOOK PRO A2551",
    "slug": "30",
    "brand": "Apple",
    "category": "ultrabook",
    "price": 38000,
    "originalPrice": 47500,
    "image": "/products/macbook_pro_a2551.png",
    "images": [
      "/products/macbook_pro_a2551.png",
      "/products/macbook_pro_a2551.png"
    ],
    "description": "Premium Apple MACBOOK PRO A2551. i5 with 16GB RAM and 512GB storage.",
    "specs": {
      "processor": "i5",
      "ram": "16GB",
      "storage": "512GB SSD",
      "screen": "13\" FHD"
    }
  },
  {
    "id": "31",
    "name": "MACBOOK PRO A2485 (2021)",
    "slug": "31",
    "brand": "Apple",
    "category": "ultrabook",
    "price": 80000,
    "originalPrice": 100000,
    "image": "/products/clean_31.png",
    "images": [
      "/products/clean_31.png",
      "/products/clean_31.png"
    ],
    "description": "Premium Apple MACBOOK PRO A2485 (2021). M1 with 16GB RAM and 512GB storage.",
    "specs": {
      "processor": "M1",
      "ram": "16GB",
      "storage": "512GB SSD",
      "screen": "16\" FHD"
    }
  },
  {
    "id": "32",
    "name": "MACBOOK AIR A2337 (2020)",
    "slug": "32",
    "brand": "Apple",
    "category": "ultrabook",
    "price": 40000,
    "originalPrice": 50000,
    "image": "/products/clean_32.png",
    "images": [
      "/products/clean_32.png",
      "/products/clean_32.png"
    ],
    "description": "Premium Apple MACBOOK AIR A2337 (2020). M1 with 16GB RAM and 256GB storage.",
    "specs": {
      "processor": "M1",
      "ram": "16GB",
      "storage": "256GB SSD",
      "screen": "13\" FHD"
    }
  },
  {
    "id": "33",
    "name": "MACBOOK PRO A2338",
    "slug": "33",
    "brand": "Apple",
    "category": "ultrabook",
    "price": 60000,
    "originalPrice": 75000,
    "image": "/products/clean_33.png",
    "images": [
      "/products/clean_33.png",
      "/products/macbook_pro_a2338_alt.png"
    ],
    "description": "Premium Apple MACBOOK PRO A2338. M1 with 16GB RAM and 256GB storage.",
    "specs": {
      "processor": "M1",
      "ram": "16GB",
      "storage": "256GB SSD",
      "screen": "13\" FHD"
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

  return {
    ...p,
    category,
    images: p.images?.length ? p.images : [p.image, p.image],
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
