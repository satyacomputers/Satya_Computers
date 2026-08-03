import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Admin Status Required' }, { status: 401 });
    }

    const { id } = await params;
    
    // Direct Database Purge: No local files to track or delete anymore
    await client.execute({
      sql: 'DELETE FROM "Product" WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ message: 'Product asset purged from secure ledger successfully' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Internal failure during asset termination' }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await client.execute({
      sql: 'SELECT * FROM "Product" WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Asset not identified in ledger' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: 'Protocol sync failure' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Modification Privileges Required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { 
      name, brand, basePrice, price, mrp, description, processor, ram, storage, 
      display, bulkPrice5_10, bulkPrice11_25, bulkPrice26Plus, 
      stockStatus, isFeatured, minOrderQty, image, gallery, stock
    } = body;

    await client.execute({
      sql: `UPDATE "Product" SET 
        name = ?, brand = ?, processor = ?, ram = ?, storage = ?, display = ?, 
        basePrice = ?, price = ?, mrp = ?, 
        bulkPrice5_10 = ?, bulkPrice11_25 = ?, bulkPrice26Plus = ?, minOrderQty = ?, 
        stockStatus = ?, description = ?, isFeatured = ?, image = ?, gallery = ?, stock = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?`,
      args: [
        name, brand, processor || '', ram || '', storage || '', display || '', 
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
        parseInt(stock || 0),
        id
      ]
    });

    return NextResponse.json({ message: 'Product registry updated and synchronized' });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Registry write disruption: Synchronization aborted' }, { status: 500 });
  }
}
