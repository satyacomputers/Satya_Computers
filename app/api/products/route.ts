import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Identity verification failed. Admin status required for Asset Provisioning.' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      name, brand, basePrice, price, mrp, description, processor, ram, storage, 
      display, bulkPrice5_10, bulkPrice11_25, bulkPrice26Plus, 
      stockStatus, isFeatured, minOrderQty, image, gallery, stock
    } = body;

    if (!name || !brand || !price) {
      return NextResponse.json({ error: 'Name, brand and price are required' }, { status: 400 });
    }

    // Generate Professional SKU ID: SC-[BRAND]-[RANDOM]
    const brandPrefix = (brand || 'GEN').substring(0, 3).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const id = `SC-${brandPrefix}-${randomPart}`;
    
    await client.execute({
      sql: `INSERT INTO "Product" (
        id, name, brand, processor, ram, storage, display, basePrice, price, mrp, 
        bulkPrice5_10, bulkPrice11_25, bulkPrice26Plus, minOrderQty, 
        stockStatus, description, isFeatured, image, gallery, stock, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        id, name, brand, processor || '', ram || '', storage || '', display || '', 
        basePrice ? parseFloat(basePrice) : null,
        parseFloat(price), 
        mrp ? parseFloat(mrp) : null, 
        bulkPrice5_10 ? parseFloat(bulkPrice5_10) : null,
        bulkPrice11_25 ? parseFloat(bulkPrice11_25) : null,
        bulkPrice26Plus ? parseFloat(bulkPrice26Plus) : null,
        parseInt(minOrderQty || 1),
        stockStatus || 'In Stock',
        description || '',
        isFeatured ? 1 : 0,
        image || '',
        Array.isArray(gallery) ? JSON.stringify(gallery) : (gallery || '[]'),
        parseInt(stock || 0)
      ]
    });

    return NextResponse.json({ message: 'Product added successfully', id });
  } catch (error: any) {
    console.error('Add product error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await client.execute("SELECT * FROM \"Product\" WHERE stockStatus = 'In Stock' AND stock > 0 ORDER BY createdAt DESC");
    
    const products = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      price: row.price,
      mrp: row.mrp,
      description: row.description,
      image: row.image,
      stockStatus: row.stockStatus,
      stock: row.stock,
      isFeatured: Boolean(row.isFeatured),
      specs: {
        processor: row.processor,
        ram: row.ram,
        storage: row.storage,
        display: row.display
      }
    }));

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
