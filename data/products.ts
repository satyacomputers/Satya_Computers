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
    id: 'razer-blade-15-2023',
    name: 'Razer Blade 15 Base',
    slug: 'razer-blade-15-2023',
    brand: 'Razer',
    price: 185000,
    originalPrice: 280000,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-thin, ultra-fast gaming laptop with an incredible CNC aluminum body.',
    specs: {
      processor: 'Intel Core i7-12800H',
      ram: '16GB DDR5',
      storage: '1TB NVMe SSD',
      screen: '15.6 inch QHD 240Hz'
    }
  },
  {
    id: 'acer-predator-helios-300',
    name: 'Acer Predator Helios 300',
    slug: 'acer-predator-helios-300',
    brand: 'Acer',
    price: 145000,
    originalPrice: 210000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    description: 'Arm yourself with a gaming laptop for intense battles. Great cooling and performance.',
    specs: {
      processor: 'Intel Core i7-11800H',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      screen: '15.6 inch FHD 144Hz'
    }
  },
  {
    id: 'dell-latitude-5480',
    name: 'Dell Latitude 5480',
    slug: 'dell-latitude-5480',
    brand: 'Dell',
    price: 3456,
    originalPrice: 21600,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
    description: 'Reliable business laptop suitable for everyday tasks, powered by Intel processors with robust security features.',
    specs: {
      processor: 'Intel Core i5',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      screen: '14" HD/FHD'
    }
  },
  {
    id: 'macbook-pro-a1708',
    name: 'MACBOOK PRO A1708 (2017)',
    slug: 'macbook-pro-a1708-2017',
    brand: 'Apple',
    price: 8064,
    originalPrice: 50400,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    description: 'Premium lightweight laptop with Retina display and seamless integration with the Apple ecosystem.',
    specs: {
      processor: 'Intel Core i5',
      ram: '8GB / 16GB',
      storage: '256GB SSD',
      screen: '13.3" Retina'
    }
  },
  {
    id: 'macbook-pro-a2141',
    name: 'MACBOOK PRO A2141 (2019 Touch Bar)',
    slug: 'macbook-pro-a2141-2019',
    brand: 'Apple',
    price: 12480,
    originalPrice: 78000,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    description: 'High-performance workstation with a stunning 16-inch display, ideal for creative professionals.',
    specs: {
      processor: 'Intel Core i7 / i9',
      ram: '16GB / 32GB',
      storage: '512GB / 1TB SSD',
      screen: '16" Retina'
    }
  },
  {
    id: 'hp-elitebook-840-g3',
    name: 'HP ELITEBOOK 840 G3',
    slug: 'hp-elitebook-840-g3',
    brand: 'HP',
    price: 3360,
    originalPrice: 21000,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-thin and elegant design offering impressive performance for enterprise users on the go.',
    specs: {
      processor: 'Intel Core i5',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      screen: '14" FHD'
    }
  },
  {
    id: 'dell-precision-3541',
    name: 'DELL PRECISION 3541',
    slug: 'dell-precision-3541',
    brand: 'Dell',
    price: 9024,
    originalPrice: 56400,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy-duty mobile workstation for CAD, video editing, and demanding workloads.',
    specs: {
      processor: 'Intel Core i7',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      screen: '15.6" FHD'
    }
  },
  {
    id: 'lenovo-thinkpad-t470',
    name: 'Lenovo ThinkPad T470',
    slug: 'lenovo-thinkpad-t470',
    brand: 'Lenovo',
    price: 4500,
    originalPrice: 28000,
    image: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=800',
    description: 'Legendary keyboard and durability. The quintessential business notebook.',
    specs: {
      processor: 'Intel Core i5',
      ram: '8GB DDR4',
      storage: '256GB NVMe',
      screen: '14" FHD'
    }
  },
  {
    id: 'lenovo-yoga-x380',
    name: 'Lenovo Yoga x380',
    slug: 'lenovo-yoga-x380',
    brand: 'Lenovo',
    price: 8500,
    originalPrice: 42000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
    description: 'Flexible 2-in-1 design combining productivity and tablet capabilities seamlessly.',
    specs: {
      processor: 'Intel Core i7',
      ram: '16GB',
      storage: '512GB SSD',
      screen: '13.3" Touch'
    }
  },
  {
    id: 'microsoft-surface-laptop-7',
    name: 'Microsoft Surface Laptop 7 (2024)',
    slug: 'microsoft-surface-laptop-7',
    brand: 'Microsoft',
    price: 15999,
    originalPrice: 99999,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    description: 'The latest Surface Laptop powered by Snapdragon X Elite, offering incredible performance and battery life.',
    specs: {
      processor: 'Snapdragon X Elite',
      ram: '16GB LPDDR5x',
      storage: '512GB SSD',
      screen: '13.8" PixelSense'
    }
  },
  {
    id: 'hp-spectre-x360-14',
    name: 'HP Spectre x360 14 (2024)',
    slug: 'hp-spectre-x360-14',
    brand: 'HP',
    price: 18450,
    originalPrice: 115000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    description: 'Premium 2-in-1 laptop with a beautiful OLED display and versatile design.',
    specs: {
      processor: 'Intel Core Ultra 7',
      ram: '16GB LPDDR5x',
      storage: '1TB Gen4 SSD',
      screen: '14" 2.8K OLED'
    }
  },
  {
    id: 'lenovo-thinkpad-x1-carbon-g12',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    slug: 'lenovo-thinkpad-x1-carbon-g12',
    brand: 'Lenovo',
    price: 21600,
    originalPrice: 135000,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
    description: 'The ultimate business ultrabook, now lighter and more powerful than ever.',
    specs: {
      processor: 'Intel Core Ultra 5/7',
      ram: '32GB LPDDR5x',
      storage: '1TB NVMe SSD',
      screen: '14" 2.8K OLED'
    }
  },
  {
    id: 'asus-zenbook-s-14',
    name: 'ASUS ZenBook S 14 (UX5406)',
    slug: 'asus-zenbook-s-14',
    brand: 'ASUS',
    price: 17600,
    originalPrice: 110000,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-thin AI PC featuring the new Ceraluminum finish and Intel Lunar Lake processor.',
    specs: {
      processor: 'Intel Core Ultra 7',
      ram: '32GB LPDDR5x',
      storage: '1TB SSD',
      screen: '14" 3K OLED'
    }
  },
  {
    id: 'macbook-pro-14-m4',
    name: 'MacBook Pro 14 (M4 Pro)',
    slug: 'macbook-pro-14-m4',
    brand: 'Apple',
    price: 32000,
    originalPrice: 200000,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    description: 'The powerhouse for professionals, now with the revolutionary M4 Pro chip.',
    specs: {
      processor: 'Apple M4 Pro',
      ram: '24GB Unified',
      storage: '512GB SSD',
      screen: '14" Liquid Retina XDR'
    }
  },
  {
    id: 'asus-rog-zephyrus-g14',
    name: 'ASUS ROG Zephyrus G14 (2024)',
    slug: 'asus-rog-zephyrus-g14-2024',
    brand: 'ASUS',
    price: 24800,
    originalPrice: 155000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    description: 'Powerful gaming performance in a portable 14-inch form factor with an OLED screen.',
    specs: {
      processor: 'AMD Ryzen 9 8945HS',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      screen: '14" 3K OLED 120Hz'
    }
  },
  {
    id: 'razer-blade-14',
    name: 'Razer Blade 14 (2024)',
    slug: 'razer-blade-14-2024',
    brand: 'Razer',
    price: 36800,
    originalPrice: 230000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&q=80&w=800',
    description: 'The most powerful 14-inch gaming laptop, featuring the latest NVIDIA RTX 4070.',
    specs: {
      processor: 'AMD Ryzen 9 8945HS',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      screen: '14" QHD+ 240Hz'
    }
  },
  {
    id: 'hp-pavilion-aero-13',
    name: 'HP Pavilion Aero 13 (2024)',
    slug: 'hp-pavilion-aero-13-2024',
    brand: 'HP',
    price: 9600,
    originalPrice: 60000,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    description: 'Incredibly light at under 1kg, without compromising on AMD Ryzen performance.',
    specs: {
      processor: 'AMD Ryzen 7',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      screen: '13.3" WQXGA'
    }
  },
  {
    id: 'acer-swift-go-14',
    name: 'Acer Swift Go 14 (2024)',
    slug: 'acer-swift-go-14-2024',
    brand: 'Acer',
    price: 11200,
    originalPrice: 70000,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&q=80&w=800',
    description: 'Vibrant OLED display and Intel Core Ultra performance in a thin and light chassis.',
    specs: {
      processor: 'Intel Core Ultra 5',
      ram: '16GB LPDDR5x',
      storage: '512GB SSD',
      screen: '14" 2.8K OLED'
    }
  },
  {
    id: 'dell-xps-14-9440',
    name: 'Dell XPS 14 (9440)',
    slug: 'dell-xps-14-9440',
    brand: 'Dell',
    price: 27200,
    originalPrice: 170000,
    badge: 'HOT',
    image: '/products/dell-xps-14-9440.png',
    description: 'Exquisite design meets powerful performance with an optional NVIDIA RTX GPU.',
    specs: {
      processor: 'Intel Core Ultra 7',
      ram: '32GB LPDDR5x',
      storage: '1TB SSD',
      screen: '14.5" 3.2K OLED'
    }
  },
  {
    id: 'msi-raider-18-hx',
    name: 'MSI Raider 18 HX AI',
    slug: 'msi-raider-18-hx',
    brand: 'MSI',
    price: 56000,
    originalPrice: 350000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    description: 'Ultimate desktop replacement with an 18-inch screen and top-tier RTX 4090.',
    specs: {
      processor: 'Intel Core i9 14900HX',
      ram: '64GB DDR5',
      storage: '2TB NVMe SSD',
      screen: '18" 4K MiniLED'
    }
  },
  {
    id: 'asus-tuf-gaming-a14',
    name: 'ASUS TUF Gaming A14 (2025)',
    slug: 'asus-tuf-gaming-a14-2025',
    brand: 'ASUS',
    price: 19200,
    originalPrice: 120000,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
    description: 'Reliable and portable gaming laptop with the efficiency of AMD Ryzen and RTX 40 series.',
    specs: {
      processor: 'AMD Ryzen 7 AI',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      screen: '14" 2.5K 165Hz'
    }
  },
  {
    id: 'framework-laptop-16',
    name: 'Framework Laptop 16',
    slug: 'framework-laptop-16',
    brand: 'Framework',
    price: 24000,
    originalPrice: 150000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    description: 'Fully modular and upgradeable 16-inch laptop for enthusiasts and professionals.',
    specs: {
      processor: 'AMD Ryzen 7 7840HS',
      ram: '32GB DDR5 (Upgradable)',
      storage: '1TB SSD (Upgradable)',
      screen: '16" 2.5K 165Hz'
    }
  },
  {
    id: 'samsung-galaxy-chromebook-plus',
    name: 'Samsung Galaxy Chromebook Plus',
    slug: 'samsung-galaxy-chromebook-plus',
    brand: 'Samsung',
    price: 11200,
    originalPrice: 70000,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    description: 'Premium Chromebook with a stunning OLED display and built-in Google AI features.',
    specs: {
      processor: 'Intel Core 3',
      ram: '8GB LPDDR5x',
      storage: '256GB SSD',
      screen: '15.6" OLED'
    }
  },
  {
    id: 'hp-omnibook-5',
    name: 'HP OmniBook 5 (2025)',
    slug: 'hp-omnibook-5-2025',
    brand: 'HP',
    price: 14400,
    originalPrice: 90000,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    description: 'HP’s latest business-focused ultrabook with exceptional battery life.',
    specs: {
      processor: 'AMD Ryzen AI 7',
      ram: '16GB LPDDR5x',
      storage: '512GB SSD',
      screen: '14" 2.2K IPS'
    }
  },
  {
    id: 'acer-nitro-v-16',
    name: 'Acer Nitro V 16',
    slug: 'acer-nitro-v-16',
    brand: 'Acer',
    price: 12800,
    originalPrice: 80000,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&q=80&w=800',
    description: 'Versatile gaming laptop offering high value and smooth 1080p gaming.',
    specs: {
      processor: 'AMD Ryzen 7 8845HS',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      screen: '16" WUXGA 165Hz'
    }
  },
  {
    id: 'lenovo-yoga-pro-9i',
    name: 'Lenovo Yoga Pro 9i (2024)',
    slug: 'lenovo-yoga-pro-9i-2024',
    brand: 'Lenovo',
    price: 23200,
    originalPrice: 145000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=800',
    description: 'Creator-focused laptop with a stunning Mini-LED display and dedicated GPU.',
    specs: {
      processor: 'Intel Core Ultra 9',
      ram: '32GB LPDDR5x',
      storage: '1TB SSD',
      screen: '14.5" 3K Mini-LED'
    }
  },
  {
    id: 'dell-inspiron-16-7640',
    name: 'Dell Inspiron 16 (7640)',
    slug: 'dell-inspiron-16-7640',
    brand: 'Dell',
    price: 13600,
    originalPrice: 85000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    description: 'Reliable 16-inch laptop for students and home users with a modern display.',
    specs: {
      processor: 'Intel Core Ultra 5',
      ram: '16GB LPDDR4x',
      storage: '512GB SSD',
      screen: '16" 2.5K IPS'
    }
  },
  {
    id: 'hp-elitebook-1040-g11',
    name: 'HP EliteBook 1040 G11',
    slug: 'hp-elitebook-1040-g11',
    brand: 'HP',
    price: 20800,
    originalPrice: 130000,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-thin elite business laptop with enhanced 5G connectivity and AI features.',
    specs: {
      processor: 'Intel Core Ultra 7',
      ram: '32GB LPDDR5x',
      storage: '1TB SSD',
      screen: '14" WQXGA OLED'
    }
  },
  {
    id: 'lenovo-legion-7i-g9',
    name: 'Lenovo Legion 7i Gen 9',
    slug: 'lenovo-legion-7i-g9',
    brand: 'Lenovo',
    price: 25600,
    originalPrice: 160000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    description: 'Premium gaming laptop with a refined look and high-performance cooling.',
    specs: {
      processor: 'Intel Core i9 14900HX',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      screen: '16" 3.2K 165Hz'
    }
  },
  {
    id: 'msi-cyborg-14',
    name: 'MSI Cyborg 14 (A13V)',
    slug: 'msi-cyborg-14-a13v',
    brand: 'MSI',
    price: 12000,
    originalPrice: 75000,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
    description: 'Compact 14-inch gaming laptop with a translucent design and affordable pricing.',
    specs: {
      processor: 'Intel Core i7 13th Gen',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      screen: '14" FHD+ 144Hz'
    }
  },
  {
    id: 'acer-predator-helios-neo-16',
    name: 'Acer Predator Helios Neo 16',
    slug: 'acer-predator-helios-neo-16',
    brand: 'Acer',
    price: 20480,
    originalPrice: 128000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    description: 'High-performance gaming with advanced cooling and a stunning 165Hz display.',
    specs: {
      processor: 'Intel Core i7 14th Gen',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      screen: '16" WQXGA 165Hz'
    }
  },
  {
    id: 'lenovo-loq-15',
    name: 'Lenovo LOQ 15 (2025)',
    slug: 'lenovo-loq-15-2025',
    brand: 'Lenovo',
    price: 11520,
    originalPrice: 72000,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80&w=800',
    description: 'Accessible gaming laptop that punches above its weight with modern hardware.',
    specs: {
      processor: 'Intel Core i5 13th Gen',
      ram: '12GB DDR5',
      storage: '512GB SSD',
      screen: '15.6" FHD 144Hz'
    }
  },
  {
    id: 'microsoft-surface-pro-11',
    name: 'Microsoft Surface Pro 11',
    slug: 'microsoft-surface-pro-11',
    brand: 'Microsoft',
    price: 16800,
    originalPrice: 105000,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    description: 'The definitive 2-in-1 with AI-powered Snapdragon X Plus and stunning OLED.',
    specs: {
      processor: 'Snapdragon X Plus',
      ram: '16GB LPDDR5x',
      storage: '256GB SSD',
      screen: '13" OLED 120Hz'
    }
  },
  {
    id: 'asus-zenbook-14-oled-q425',
    name: 'ASUS Zenbook 14 OLED (Q425)',
    slug: 'asus-zenbook-14-oled-q425',
    brand: 'ASUS',
    price: 12800,
    originalPrice: 80000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800',
    description: 'Top-rated student laptop with a beautiful OLED screen and great battery life.',
    specs: {
      processor: 'Intel Core Ultra 5',
      ram: '16GB LPDDR5x',
      storage: '512GB SSD',
      screen: '14" FHD+ OLED'
    }
  },
  {
    id: 'dell-xps-13-9345',
    name: 'Dell XPS 13 (9345)',
    slug: 'dell-xps-13-9345',
    brand: 'Dell',
    price: 20800,
    originalPrice: 130000,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-portable powerhouse with Snapdragon X Elite for incredible efficiency.',
    specs: {
      processor: 'Snapdragon X Elite',
      ram: '16GB LPDDR5x',
      storage: '512GB SSD',
      screen: '13.4" FHD+ IPS'
    }
  },
  {
    id: 'acer-aspire-go-15',
    name: 'Acer Aspire Go 15',
    slug: 'acer-aspire-go-15',
    brand: 'Acer',
    price: 4800,
    originalPrice: 30000,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
    description: 'Budget-friendly 15-inch laptop for everyday basics and office productivity.',
    specs: {
      processor: 'Intel Core i3-N305',
      ram: '8GB LPDDR5',
      storage: '256GB SSD',
      screen: '15.6" FHD'
    }
  },
  {
    id: 'apple-macbook-air-m2',
    name: 'MacBook Air 13 (M2 Chip)',
    slug: 'macbook-air-m2',
    brand: 'Apple',
    price: 14400,
    originalPrice: 90000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    description: 'Sleek design and powerful M2 performance, the perfect everyday Mac.',
    specs: {
      processor: 'Apple M2',
      ram: '8GB Unified',
      storage: '256GB SSD',
      screen: '13.6" Liquid Retina'
    }
  },
  {
    id: 'hp-victus-15-2024',
    name: 'HP Victus 15 (2024)',
    slug: 'hp-victus-15-2024',
    brand: 'HP',
    price: 11200,
    originalPrice: 70000,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    description: 'Solid entry-level gaming laptop with a refined look and capable hardware.',
    specs: {
      processor: 'AMD Ryzen 5 8645HS',
      ram: '8GB DDR5',
      storage: '512GB SSD',
      screen: '15.6" FHD 144Hz'
    }
  },
  {
    id: 'lenovo-thinkpad-p1-g7',
    name: 'Lenovo ThinkPad P1 Gen 7',
    slug: 'lenovo-thinkpad-p1-g7',
    brand: 'Lenovo',
    price: 38400,
    originalPrice: 240000,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
    description: 'Thin and light mobile workstation for engineers, architects, and designers.',
    specs: {
      processor: 'Intel Core Ultra 9',
      ram: '64GB LPDDR5x',
      storage: '2TB NVMe SSD',
      screen: '16" 4K OLED Touch'
    }
  },
  {
    id: 'samsung-990-pro-1tb',
    name: 'Samsung 990 Pro 1TB NVMe Gen4 SSD',
    slug: 'samsung-990-pro-1tb',
    brand: 'Samsung',
    category: 'parts',
    price: 9500,
    originalPrice: 14500,
    badge: 'HOT',
    image: '/products/samsung-990-pro.png',
    description: 'The ultimate NVMe Gen4 SSD with speeds up to 7450MB/s. Perfect for performance workstations.',
    specs: {
      processor: 'Pascal Controller',
      ram: '1GB LPDDR4',
      storage: '1TB NVMe',
      screen: 'N/A'
    }
  },
  {
    id: 'crucial-16gb-ddr5-5600',
    name: 'Crucial 16GB DDR5 5600MHz Laptop RAM',
    slug: 'crucial-16gb-ddr5-5600',
    brand: 'Crucial',
    category: 'parts',
    price: 5200,
    originalPrice: 7800,
    badge: 'NEW',
    image: '/products/crucial-ram.png',
    description: 'High-speed DDR5 memory for the latest laptop platforms. Improves multitasking and workflow speed.',
    specs: {
      processor: 'SO-DIMM',
      ram: '16GB',
      storage: '5600MHz',
      screen: 'N/A'
    }
  },
  {
    id: 'dell-latitude-battery-63wh',
    name: 'Dell Latitude 63Wh Original Battery',
    slug: 'dell-latitude-battery-63wh',
    brand: 'Dell',
    category: 'parts',
    price: 4500,
    originalPrice: 6500,
    image: '/products/dell-battery.png',
    description: 'Genuine Dell replacement battery for Latitude 5000/7000 series. Certified 63Wh capacity.',
    specs: {
      processor: 'Li-ion',
      ram: '63Wh',
      storage: '4-Cell',
      screen: 'N/A'
    }
  },
  {
    id: 'coolermaster-liquid-metal',
    name: 'Cooler Master Liquid Metal Thermal Grease',
    slug: 'coolermaster-liquid-metal',
    brand: 'Cooler Master',
    category: 'parts',
    price: 1800,
    originalPrice: 2500,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-high performance thermal composite for professional workstations. Certified for intense computational workloads.',
    specs: {
      processor: 'Liquid Metal',
      ram: '5g',
      storage: '82W/m-K',
      screen: 'N/A'
    }
  }
];

// ─── Real product images (Unsplash editorial/press-style, not AI-generated) ───
const realImages: Record<string, string[]> = {
  'razer-blade-15-2023': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
  ],
  'acer-predator-helios-300': [
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'dell-latitude-5480': [
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
  ],
  'macbook-pro-a1708-2017': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
  ],
  'macbook-pro-a2141-2019': [
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
  ],
  'hp-elitebook-840-g3': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'dell-precision-3541': [
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
  ],
  'lenovo-thinkpad-t470': [
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'lenovo-yoga-x380': [
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
  ],
  'microsoft-surface-laptop-7': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
  ],
  'hp-spectre-x360-14': [
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
  ],
  'lenovo-thinkpad-x1-carbon-g12': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'asus-zenbook-s-14': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
  ],
  'macbook-pro-14-m4': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
  ],
  'asus-rog-zephyrus-g14-2024': [
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
  ],
  'razer-blade-14-2024': [
    'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800',
  ],
  'hp-pavilion-aero-13-2024': [
    'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800',
  ],
  'acer-swift-go-14-2024': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'dell-xps-14-9440': [
    '/products/dell-xps-14-9440.png',
    '/products/dell-xps-14-9440-alt.png',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
  ],
  'msi-raider-18-hx': [
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'asus-tuf-gaming-a14-2025': [
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
  ],
  'framework-laptop-16': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
  ],
  'samsung-galaxy-chromebook-plus': [
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
  ],
  'hp-omnibook-5-2025': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'acer-nitro-v-16': [
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
  ],
  'lenovo-yoga-pro-9i-2024': [
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'dell-inspiron-16-7640': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
  ],
  'hp-elitebook-1040-g11': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
  ],
  'lenovo-legion-7i-g9': [
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
  ],
  'msi-cyborg-14-a13v': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'acer-predator-helios-neo-16': [
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
  ],
  'lenovo-loq-15-2025': [
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'microsoft-surface-pro-11': [
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
  ],
  'asus-zenbook-14-oled-q425': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
  ],
  'dell-xps-13-9345': [
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
  ],
  'acer-aspire-go-15': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'macbook-air-m2': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
  ],
  'hp-victus-15-2024': [
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
  ],
  'lenovo-thinkpad-p1-g7': [
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
  ],
};

// Long descriptions by brand / slug pattern
const longDescriptions: Record<string, string> = {
  'macbook-pro-14-m4': `The MacBook Pro 14-inch with M4 Pro chip is Apple's most powerful compact professional laptop. It features up to 24 cores of GPU performance, hardware-accelerated ray tracing, and a 14-inch Liquid Retina XDR display with ProMotion up to 120Hz. The fanless design and all-day battery life make it perfect for creative professionals — video editors, developers, and designers who demand uncompromised performance in a portable form factor. Running macOS Sequoia, it comes with full support for Final Cut Pro, Logic Pro, and the complete Adobe Creative Suite.`,
  'macbook-pro-a1708-2017': `The MacBook Pro A1708 (2017) is a certified refurbished unit in excellent condition. It features Intel's 7th-generation Core i5 processor, a gorgeous 13.3-inch Retina display, and seamless integration with the Apple ecosystem. Ideal for students, writers, and office professionals. Each unit is cleaned, tested, and verified before sale at Satya Computers.`,
  'macbook-pro-a2141-2019': `The MacBook Pro A2141 (2019) is the last Intel MacBook Pro with a 16-inch Retina display — beloved for its dedicated AMD graphics, 8-speaker sound system, and the improved 'Magic' keyboard. A fan favourite among video editors and musicians. Refurbished and verified at Satya Computers.`,
  'macbook-air-m2': `Apple's MacBook Air with M2 chip redefined what an ultra-thin laptop could do. With zero fans (completely silent), an 18-hour battery life, and a stunning 13.6-inch Liquid Retina display with 500 nits brightness, it is the perfect everyday Mac for students and professionals. The M2 chip is faster than most Intel-based laptops in its class.`,
  'dell-latitude-5480': `The Dell Latitude 5480 is a durable, enterprise-grade 14-inch business laptop designed for professionals on the go. It is MIL-SPEC 810G certified for durability, features Dell's ControlVault 3 security chip, optional smart card reader, and supports both Intel vPro and Windows 11 Pro for business deployments. Refurbished in excellent condition from Satya Computers.`,
  'dell-xps-14-9440': `The Dell XPS 14 9440 is a stunning marriage of design and power — a sleek carbon-fibre chassis housing an Intel Core Ultra 7 processor and an optional NVIDIA RTX 4050 GPU. Its 14.5-inch 3.2K OLED InfinityEdge display delivers rich, true blacks and Pantone-validated colour accuracy, making it ideal for photo and video work.`,
  'hp-spectre-x360-14': `The HP Spectre x360 14 is HP's most premium 2-in-1 convertible. Its 2.8K OLED touch display swings a full 360° into tablet mode, and an integrated HP Tilt Pen (sold separately) turns it into a digital canvas. The Core Ultra 7 processor with Intel AI Boost handles creative workloads with ease, while the gem-cut chassis design makes it the most beautiful laptop in the room.`,
  'lenovo-thinkpad-x1-carbon-g12': `The ThinkPad X1 Carbon Gen 12 is the world's lightest 14-inch business laptop, weighing just 1.12 kg. Built with carbon fibre reinforced plastic and certified to 12 MIL-SPEC standards, it's the go-to machine for executives and frequent flyers. Features include a 2.8K OLED display, Intel EVO certification, and 5G connectivity options for always-on productivity.`,
  'asus-rog-zephyrus-g14-2024': `The ASUS ROG Zephyrus G14 (2024) is a powerhouse in disguise. Featuring the AMD Ryzen 9 8945HS processor and NVIDIA RTX 4070 GPU, this 14-inch gaming laptop delivers desktop-class gaming performance. The 3K 120Hz OLED display with Dolby Vision support makes it equally compelling for content creators. ROG Armoury Crate software lets you tune every aspect of performance and lighting.`,
  'razer-blade-14-2024': `The Razer Blade 14 is the most powerful 14-inch gaming laptop money can buy. With a CNC-machined unibody aluminium chassis, NVIDIA RTX 4070 GPU, and a stunning QHD+ 240Hz display, it sets the benchmark for premium gaming portability. The Blade's vapour chamber cooling keeps thermals in check even during extended gaming sessions.`,
};

// Highlights by brand pattern
function generateHighlights(p: Product): string[] {
  if (p.highlights && p.highlights.length) return p.highlights;
  const h: string[] = [
    `${p.specs.processor} processor`,
    `${p.specs.ram} RAM`,
    `${p.specs.storage} fast SSD storage`,
    `${p.specs.screen} display`,
  ];
  if (p.specs.gpu) h.push(`${p.specs.gpu} graphics`);
  if (p.specs.battery) h.push(`${p.specs.battery} battery runtime`);
  if (p.specs.weight) h.push(`Lightweight at ${p.specs.weight}`);
  if (p.brand === 'Apple') h.push('macOS – full Apple ecosystem integration');
  if (p.badge === 'NEW') h.push('Latest generation model (2024/2025)');
  if (p.badge === 'SALE') h.push('Certified refurbished – tested & verified at Satya Computers');
  h.push('✓ 7-Day easy return policy');
  return h.slice(0, 6);
}

// Enrich a product with fallback data
export function enrichProduct(p: Product) {
  const category = p.category ?? ((): NonNullable<Product['category']> => {
    const n = p.name.toLowerCase();
    if (n.includes('gaming') || n.includes('rog') || n.includes('razer') || n.includes('predator') || n.includes('legion') || n.includes('nitro') || n.includes('tuf') || n.includes('loq') || n.includes('msi') || n.includes('cyborg') || n.includes('blade') || n.includes('victus') || n.includes('helios')) return 'gaming';
    if (n.includes('workstation') || n.includes('precision') || n.includes('thinkpad p')) return 'workstation';
    if (n.includes('surface pro') || n.includes('yoga') || n.includes('spectre') || n.includes('zenbook') || n.includes('swift')) return '2-in-1';
    if (n.includes('latitude') || n.includes('elitebook') || n.includes('thinkpad') || n.includes('omnibook')) return 'business';
    if (n.includes('macbook') || n.includes('xps') || n.includes('zenbook s') || n.includes('framework') || n.includes('aero')) return 'ultrabook';
    if (n.includes('ssd') || n.includes('ram') || n.includes('battery') || n.includes('nvme') || n.includes('parts')) return 'parts';
    return 'student';
  })();

  return {
    ...p,
    category,
    images: p.images?.length ? p.images : (realImages[p.slug] ?? [p.image, p.image]),
    longDescription: p.longDescription || longDescriptions[p.slug] || `The ${p.name} offers ${p.specs.processor} performance with ${p.specs.ram} RAM and ${p.specs.storage} of fast SSD storage. Its ${p.specs.screen} display delivers crisp, vibrant visuals. ${p.description} Available now at Satya Computers, Ameerpet, Hyderabad — walk in for a demo or order online.`,
    highlights: generateHighlights(p),
  };
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return products;
}

export function getRecommendedProducts(current: Product, count = 4): Product[] {
  const enriched = enrichProduct(current);
  // Same category first, then same brand, then similar price range
  const others = products.filter(p => p.slug !== current.slug);
  const sameCategory = others.filter(p => enrichProduct(p).category === enriched.category);
  const sameBrand = others.filter(p => p.brand === current.brand && enrichProduct(p).category !== enriched.category);
  const priceRange = current.price;
  const byPrice = others
    .filter(p => !sameCategory.includes(p) && !sameBrand.includes(p))
    .sort((a, b) => Math.abs(a.price - priceRange) - Math.abs(b.price - priceRange));

  return [...sameCategory, ...sameBrand, ...byPrice].slice(0, count);
}
