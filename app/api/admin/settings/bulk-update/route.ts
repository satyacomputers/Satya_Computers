import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/** Ensure the GlobalSettings table exists with all required columns */
async function ensureSettingsTable() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "GlobalSettings" (
      "id"                 TEXT PRIMARY KEY,
      "gstPercentage"      REAL DEFAULT 18,
      "shippingCharges"    REAL DEFAULT 0,
      "discountPercentage" REAL DEFAULT 0,
      "updatedAt"          DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  const columns = [
    { name: "gstEnabled",      type: "INTEGER DEFAULT 0" },
    { name: "shippingEnabled", type: "INTEGER DEFAULT 0" },
    { name: "discountEnabled", type: "INTEGER DEFAULT 0" },
  ];

  for (const col of columns) {
    try {
      await client.execute(`ALTER TABLE "GlobalSettings" ADD COLUMN "${col.name}" ${col.type}`);
    } catch { /* already exists */ }
  }

  await client.execute(`INSERT OR IGNORE INTO "GlobalSettings" ("id") VALUES ('settings')`);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { action } = await req.json();

    await ensureSettingsTable();

    const settingsResult = await client.execute(
      `SELECT * FROM "GlobalSettings" WHERE id = 'settings' LIMIT 1`
    );
    const s = settingsResult.rows[0];
    if (!s) return NextResponse.json({ error: 'Settings not found' }, { status: 404 });

    const gst      = Number(s.gstPercentage)      || 0;
    const shipping = Number(s.shippingCharges)    || 0;
    const discount = Number(s.discountPercentage) || 0;
    const gstOn    = Boolean(Number(s.gstEnabled));
    const shipOn   = Boolean(Number(s.shippingEnabled));
    const discOn   = Boolean(Number(s.discountEnabled));

    // Ensure basePrice baseline
    await client.execute(
      `UPDATE "Product" SET "basePrice" = "price" WHERE "basePrice" IS NULL OR "basePrice" = 0`
    );

    if (action === 'apply_gst') {
      if (!gstOn) return NextResponse.json({ error: 'GST is currently disabled. Enable it first.' }, { status: 400 });
      await client.execute({ sql: `UPDATE "Product" SET "price" = ROUND("basePrice" * (1 + ? / 100.0), 2)`, args: [gst] });
      return NextResponse.json({ success: true, message: `GST ${gst}% applied to all products.` });
    }

    if (action === 'apply_shipping') {
      if (!shipOn) return NextResponse.json({ error: 'Shipping is currently disabled. Enable it first.' }, { status: 400 });
      await client.execute({ sql: `UPDATE "Product" SET "price" = ROUND("price" + ?, 2)`, args: [shipping] });
      return NextResponse.json({ success: true, message: `Shipping ₹${shipping} added to all products.` });
    }

    if (action === 'apply_discount') {
      if (!discOn) return NextResponse.json({ error: 'Discount is currently disabled. Enable it first.' }, { status: 400 });
      await client.execute({ sql: `UPDATE "Product" SET "price" = ROUND("price" - ?, 2)`, args: [discount] });
      return NextResponse.json({ success: true, message: `Discount ₹${discount} applied to all products.` });
    }

    if (action === 'apply_all') {
      const effectiveGst      = gstOn      ? gst      : 0;
      const effectiveShipping = shipOn     ? shipping : 0;
      const effectiveDiscount = discOn     ? discount : 0;

      await client.execute({
        sql:  `UPDATE "Product"
               SET "price" = ROUND(
                 ("basePrice" * (1 + ? / 100.0) + ?) - ?
               , 2)`,
        args: [effectiveGst, effectiveShipping, effectiveDiscount],
      });

      const parts: string[] = [];
      if (gstOn)  parts.push(`GST ${gst}%`);
      if (shipOn) parts.push(`Shipping ₹${shipping}`);
      if (discOn) parts.push(`Discount ₹${discount}`);
      const desc = parts.length ? parts.join(' + ') : 'No adjustments active';

      return NextResponse.json({ success: true, message: `Full recalculation deployed — ${desc}.` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Bulk Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
