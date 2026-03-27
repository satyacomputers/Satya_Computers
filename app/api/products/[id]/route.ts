import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // First, let's get the product to find the images
    const productResult = await client.execute({
      sql: 'SELECT image, gallery FROM "Product" WHERE id = ?',
      args: [id]
    });

    const deleteLocalFile = async (url: string) => {
      if (url && typeof url === 'string' && url.startsWith('/uploads/')) {
        try {
          const fullPath = join(process.cwd(), 'public', url);
          await unlink(fullPath);
        } catch (e) {
          console.error(`Failed to delete file: ${url}`);
        }
      }
    };

    if (productResult.rows.length > 0) {
      const product: any = productResult.rows[0];
      if (product.image) await deleteLocalFile(product.image);
      if (product.gallery) {
        try {
          const gallery = JSON.parse(product.gallery);
          if (Array.isArray(gallery)) {
            await Promise.all(gallery.map(img => deleteLocalFile(img)));
          }
        } catch (e) {}
      }
    }

    await client.execute({
      sql: 'DELETE FROM "Product" WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
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
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { 
      name, brand, price, description, processor, ram, storage, 
      display, bulkPrice5_10, bulkPrice11_25, bulkPrice26Plus, 
      stockStatus, isFeatured, minOrderQty, image, gallery, stock
    } = body;

    await client.execute({
      sql: `UPDATE "Product" SET 
        name = ?, brand = ?, processor = ?, ram = ?, storage = ?, display = ?, price = ?, 
        bulkPrice5_10 = ?, bulkPrice11_25 = ?, bulkPrice26Plus = ?, minOrderQty = ?, 
        stockStatus = ?, description = ?, isFeatured = ?, image = ?, gallery = ?, stock = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?`,
      args: [
        name, brand, processor || '', ram || '', storage || '', display || '', 
        parseFloat(price), 
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

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
