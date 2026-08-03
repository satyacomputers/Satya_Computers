import { libsql as client } from './prisma';

export async function getFeaturedProducts() {
  try {
    const result = await client.execute("SELECT * FROM \"Product\" WHERE isFeatured = 1 AND stock > 0 AND stockStatus = 'In Stock' ORDER BY createdAt DESC LIMIT 10");
    
    const brandColors: Record<string, string> = {
      'RAZER': '#60C5E4',
      'ACER': '#F6B93B',
      'DELL': '#C5E0B4',
      'ASUS': '#FF9F43',
      'APPLE': '#54A0FF',
      'LENOVO': '#1DD1A1',
      'HP': '#A29BFE'
    };

    return result.rows.map((row: any) => ({
      id: String(row.id),
      brand: String(row.brand),
      title: String(row.name),
      specs: `${row.processor} + ${row.ram} + ${row.storage} + ${row.display || ''}`,
      price: `₹${Number(row.price).toLocaleString()}`,
      bg: brandColors[String(row.brand).toUpperCase()] || '#5B3A8C',
      img: String(row.image || '/products/dell_laptop_premium.png'),
      link: `/products/${row.id}`
    }));
  } catch (error) {
    console.error('getFeaturedProducts error:', error);
    return [];
  }
}

export async function getLiveAnnouncement() {
  try {
    const result = await client.execute("SELECT * FROM \"Announcement\" WHERE status = 'Live' ORDER BY createdAt DESC LIMIT 1");
    if (result.rows.length > 0) {
      const row = result.rows[0];
      return {
        id: String(row.id),
        title: String(row.title),
        type: String(row.type),
        status: String(row.status),
        date: row.date ? String(row.date) : null,
        createdAt: row.createdAt ? String(row.createdAt) : null
      };
    }
    return null;
  } catch (error) {
    console.error('getLiveAnnouncement error:', error);
    return null;
  }
}

export async function getActiveOffers() {
  try {
    const result = await client.execute("SELECT * FROM \"Offer\" WHERE isActive = 1 ORDER BY createdAt DESC LIMIT 6");
    return result.rows.map((row: any) => ({
      id: String(row.id),
      type: String(row.type),
      title: String(row.title),
      description: String(row.description),
      code: String(row.code),
      discount: String(row.discount),
      expiryDate: row.expiryDate ? String(row.expiryDate) : null,
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt ? String(row.createdAt) : null
    }));
  } catch (error) {
    console.error('getActiveOffers error:', error);
    return [];
  }
}

export async function getCompanyStats() {
  try {
    const result = await client.execute(`
      SELECT 
        COUNT(DISTINCT companyName) as clientCount,
        SUM(totalUnits) as unitCount
      FROM "Order"
    `);
    
    const stats = result.rows[0];
    return {
      clientCount: Number(stats?.clientCount || 0) + 125,
      unitCount: Number(stats?.unitCount || 0) + 5000,
      marketReach: "1.2k+",
      uptime: "99.8%"
    };
  } catch (error) {
    console.error('getCompanyStats error:', error);
    return { clientCount: 125, unitCount: 5000, marketReach: "1.2k+", uptime: "99.8%" };
  }
}

export async function getPartners() {
  try {
    const result = await client.execute(`
      SELECT DISTINCT companyName 
      FROM "Order" 
      WHERE companyName IS NOT NULL 
      ORDER BY createdAt DESC 
      LIMIT 12
    `);
    return result.rows.map((row: any) => String(row.companyName));
  } catch (error) {
    console.error('getPartners error:', error);
    return [];
  }
}

export async function getTeam() {
  try {
    const result = await client.execute('SELECT username, role, createdAt FROM "Admin" ORDER BY createdAt ASC');
    return result.rows.map((row: any) => ({
      username: String(row.username),
      role: String(row.role || 'System Admin'),
      createdAt: row.createdAt ? String(row.createdAt) : null
    }));
  } catch (error) {
    console.error('getTeam error:', error);
    return [];
  }
}

export async function getRecentOrders() {
  try {
    const result = await client.execute('SELECT companyName, totalUnits, status, createdAt FROM "Order" ORDER BY createdAt DESC LIMIT 8');
    return result.rows.map((row: any) => ({
      companyName: String(row.companyName),
      totalUnits: Number(row.totalUnits),
      status: String(row.status),
      createdAt: row.createdAt ? String(row.createdAt) : null
    }));
  } catch (error) {
    console.error('getRecentOrders error:', error);
    return [];
  }
}

export async function getCategoryStats() {
  try {
    const result = (await client.execute(`
      SELECT category, COUNT(*) as count 
      FROM "Product" 
      WHERE stock > 0 AND stockStatus = 'In Stock'
      GROUP BY category
    `)) as any;
    return result.rows.reduce((acc: any, row: any) => {
      acc[String(row.category).toLowerCase()] = Number(row.count);
      return acc;
    }, {});
  } catch (error) {
    console.error('getCategoryStats error:', error);
    return {};
  }
}

export async function getInventoryStats() {
  try {
    const result = (await client.execute(`
      SELECT brand, COUNT(*) as count 
      FROM "Product" 
      GROUP BY brand 
      ORDER BY count DESC 
      LIMIT 6
    `)) as any;
    return result.rows.map((row: any) => ({
      brand: String(row.brand),
      count: Number(row.count)
    }));
  } catch (error) {
    console.error('getInventoryStats error:', error);
    return [];
  }
}

export async function getLiveActivity() {
  try {
    const [recentOrders, recentProducts] = await Promise.all([
      client.execute('SELECT companyName FROM "Order" ORDER BY createdAt DESC LIMIT 3'),
      client.execute('SELECT name, brand FROM "Product" ORDER BY createdAt DESC LIMIT 3')
    ]);

    const activities = [
      ...(recentOrders.rows as any[]).map(o => `System deployed to ${o.companyName}`),
      ...(recentProducts.rows as any[]).map(p => `New ${p.brand} ${p.name} added to inventory`),
      "Security protocol v4.2.0 initialized",
      "Global logistics synchronization complete"
    ].sort(() => Math.random() - 0.5);

    return activities;
  } catch (error) {
    console.error('getLiveActivity error:', error);
    return ["System operational", "Inventory synchronized"];
  }
}

export async function getHeroProduct() {
  try {
    const result = await client.execute(`
      SELECT * FROM "Product" 
      WHERE stock > 0 AND stockStatus = 'In Stock' 
      ORDER BY price DESC 
      LIMIT 1
    `);
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      return {
        id: String(row.id),
        name: String(row.name),
        brand: String(row.brand || 'Premium'),
        processor: String(row.processor || 'High-End CPU'),
        ram: String(row.ram || '16GB'),
        storage: String(row.storage || '512GB SSD'),
        display: String(row.display || 'Retina Display'),
        price: Number(row.price),
        mrp: Number(row.mrp || row.price * 1.2),
        image: (row.image && (row.image.startsWith('/') || row.image.startsWith('http') || row.image.startsWith('data:'))) 
          ? row.image 
          : (row.image ? `/uploads/${row.image}` : 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1200'),
        isFeatured: Boolean(row.isFeatured)
      };
    }
    return null;
  } catch (error) {
    console.error('getHeroProduct error:', error);
    return null;
  }
}

