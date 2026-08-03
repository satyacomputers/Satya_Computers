import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/** Ensure the GlobalSettings table exists with all required columns */
async function ensureSettingsTable() {
  // 1. Ensure table exists
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "GlobalSettings" (
      "id"                 TEXT PRIMARY KEY,
      "gstPercentage"      REAL DEFAULT 18,
      "shippingCharges"    REAL DEFAULT 0,
      "discountPercentage" REAL DEFAULT 0,
      "updatedAt"          DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Add columns one by one (this handles cases where table exists but is old)
  const columns = [
    { name: "gstEnabled",      type: "INTEGER DEFAULT 0" },
    { name: "shippingEnabled", type: "INTEGER DEFAULT 0" },
    { name: "discountEnabled", type: "INTEGER DEFAULT 0" },
  ];

  for (const col of columns) {
    try {
      await client.execute(`ALTER TABLE "GlobalSettings" ADD COLUMN "${col.name}" ${col.type}`);
    } catch (e) {
      // Column likely already exists, ignore
    }
  }

  // 3. Ensure the 'settings' row exists
  await client.execute(
    `INSERT OR IGNORE INTO "GlobalSettings" ("id") VALUES ('settings')`
  );
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await ensureSettingsTable();

    const result = await client.execute(
      `SELECT * FROM "GlobalSettings" WHERE id = 'settings' LIMIT 1`
    );
    
    const row = result.rows[0];
    if (!row) {
      return NextResponse.json({
        gstPercentage: 18, shippingCharges: 0, discountPercentage: 0,
        gstEnabled: false, shippingEnabled: false, discountEnabled: false,
      });
    }

    return NextResponse.json({
      gstPercentage:      Number(row.gstPercentage)      || 0,
      shippingCharges:    Number(row.shippingCharges)    || 0,
      discountPercentage: Number(row.discountPercentage) || 0,
      gstEnabled:         Boolean(Number(row.gstEnabled)),
      shippingEnabled:    Boolean(Number(row.shippingEnabled)),
      discountEnabled:    Boolean(Number(row.discountEnabled)),
    });
  } catch (error: any) {
    console.error('Fetch Settings Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const {
      gstPercentage, shippingCharges, discountPercentage,
      gstEnabled, shippingEnabled, discountEnabled,
    } = await req.json();

    await ensureSettingsTable();

    await client.execute({
      sql: `UPDATE "GlobalSettings"
            SET "gstPercentage"      = ?,
                "shippingCharges"    = ?,
                "discountPercentage" = ?,
                "gstEnabled"         = ?,
                "shippingEnabled"    = ?,
                "discountEnabled"    = ?,
                "updatedAt"          = CURRENT_TIMESTAMP
            WHERE id = 'settings'`,
      args: [
        Number(gstPercentage), Number(shippingCharges), Number(discountPercentage),
        gstEnabled ? 1 : 0, shippingEnabled ? 1 : 0, discountEnabled ? 1 : 0,
      ],
    });

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error: any) {
    console.error('Update Settings Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
