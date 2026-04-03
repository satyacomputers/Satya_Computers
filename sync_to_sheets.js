/**
 * SATYA COMPUTERS - GOOGLE SHEETS BULK SYNC
 * ==========================================
 * One-time script to push ALL existing database records
 * into their respective tabs in the master Google Sheet.
 * Run: node sync_to_sheets.js
 */

const { createClient } = require('@libsql/client');
require('dotenv').config();

const WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.error('❌ GOOGLE_SHEET_WEBHOOK_URL is missing in your .env file!');
  process.exit(1);
}

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// Helper: Push a single row to a specific sheet tab
async function pushRow(tabName, values) {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tab: tabName, values }),
    });
    const text = await res.text();
    if (text.includes('SYNC_SUCCESS')) {
      process.stdout.write('.');
    } else {
      process.stdout.write('x');
    }
  } catch (e) {
    process.stdout.write('F');
  }
}

// Helper: Format IST timestamp
function ist(dateStr) {
  try {
    return new Date(dateStr || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  } catch {
    return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }
}

// Helper: Add header row to a tab
async function addHeader(tabName, headers) {
  await pushRow(tabName, headers);
}

async function syncAllData() {
  console.log('\n🚀 SATYA COMPUTERS — Google Sheets Bulk Sync Starting...\n');

  // ─────────────────────────────────────────────
  // 1. B2B ORDERS (Admin Dashboard Orders)
  // ─────────────────────────────────────────────
  console.log('\n📦 [1/6] Syncing B2B Orders...');
  await addHeader('Orders (B2B)', ['Order ID', 'Date (IST)', 'Company', 'Contact Person', 'Phone', 'Units', 'Estimated Value', 'Status']);
  try {
    const result = await client.execute('SELECT * FROM "Order" ORDER BY createdAt ASC');
    for (const row of result.rows) {
      await pushRow('Orders (B2B)', [
        row.orderId || row.id,
        ist(row.createdAt),
        row.companyName || '—',
        row.contactPerson || '—',
        row.phone || '—',
        row.totalUnits || 0,
        `₹${Number(row.estimatedValue || 0).toLocaleString()}`,
        row.status || 'Pending',
      ]);
    }
    console.log(`\n   ✅ ${result.rows.length} B2B orders synced.`);
  } catch (e) {
    console.log('\n   ⚠️  B2B Orders table not found or empty. Skipping...');
  }

  // ─────────────────────────────────────────────
  // 2. B2C ORDERS (Customer Storefront Orders)
  // ─────────────────────────────────────────────
  console.log('\n🛒 [2/6] Syncing B2C Customer Orders...');
  await addHeader('Orders (B2C)', ['Order ID', 'Date (IST)', 'Customer Name', 'WhatsApp', 'Total Amount', 'Payment Status', 'Order Status', 'Payment Method', 'City']);
  try {
    const result = await client.execute('SELECT * FROM "CustomerOrder" ORDER BY createdAt ASC');
    for (const row of result.rows) {
      await pushRow('Orders (B2C)', [
        row.orderId || row.id,
        ist(row.createdAt),
        row.fullName || row.customerName || '—',
        row.whatsapp || row.phone || '—',
        `₹${Number(row.totalPrice || row.totalAmount || 0).toLocaleString()}`,
        row.paymentStatus || 'Pending',
        row.orderStatus || 'Processing',
        row.paymentMethod || 'UPI',
        row.city || '—',
      ]);
    }
    console.log(`\n   ✅ ${result.rows.length} B2C orders synced.`);
  } catch (e) {
    console.log('\n   ⚠️  CustomerOrder table not found or empty. Skipping...');
  }

  // ─────────────────────────────────────────────
  // 3. OFFLINE BILLS (POS Walk-In Sales)
  // ─────────────────────────────────────────────
  console.log('\n🧾 [3/6] Syncing POS Bills (Walk-In Sales)...');
  await addHeader('POS Bills', ['Bill ID', 'Date (IST)', 'Customer', 'Phone', 'Subtotal', 'GST', 'Total', 'Payment Status', 'Transaction ID']);
  try {
    const result = await client.execute('SELECT * FROM "OfflineBill" ORDER BY createdAt ASC');
    for (const row of result.rows) {
      await pushRow('POS Bills', [
        row.billId || row.id,
        ist(row.createdAt),
        row.customerName || 'Walk-In Customer',
        row.customerPhone || '—',
        `₹${Number(row.subtotal || 0).toLocaleString()}`,
        `₹${Number(row.gstAmount || 0).toLocaleString()}`,
        `₹${Number(row.totalAmount || 0).toLocaleString()}`,
        row.status || 'Unpaid',
        row.transactionId || '—',
      ]);
    }
    console.log(`\n   ✅ ${result.rows.length} POS bills synced.`);
  } catch (e) {
    console.log('\n   ⚠️  OfflineBill table not found or empty. Skipping...');
  }

  // ─────────────────────────────────────────────
  // 4. INVENTORY (Products / Hardware Stock)
  // ─────────────────────────────────────────────
  console.log('\n🖥️  [4/6] Syncing Inventory...');
  await addHeader('Inventory', ['SKU', 'Date Added (IST)', 'Product Name', 'Brand', 'Price', 'MRP', 'Stock', 'Status', 'Processor', 'RAM', 'Storage']);
  try {
    const result = await client.execute('SELECT * FROM "Product" ORDER BY createdAt ASC');
    for (const row of result.rows) {
      await pushRow('Inventory', [
        row.id,
        ist(row.createdAt),
        row.name || '—',
        row.brand || '—',
        `₹${Number(row.price || 0).toLocaleString()}`,
        `₹${Number(row.mrp || row.price || 0).toLocaleString()}`,
        row.stock || 0,
        row.stockStatus || 'Unknown',
        row.processor || '—',
        row.ram || '—',
        row.storage || '—',
      ]);
    }
    console.log(`\n   ✅ ${result.rows.length} products synced.`);
  } catch (e) {
    console.log('\n   ⚠️  Product table not found or empty. Skipping...');
  }

  // ─────────────────────────────────────────────
  // 5. ANNOUNCEMENTS
  // ─────────────────────────────────────────────
  console.log('\n📢 [5/6] Syncing Announcements...');
  await addHeader('Announcements', ['ID', 'Date (IST)', 'Title', 'Type', 'Status', 'Date']);
  try {
    const result = await client.execute('SELECT * FROM "Announcement" ORDER BY createdAt ASC');
    for (const row of result.rows) {
      await pushRow('Announcements', [
        row.id,
        ist(row.createdAt),
        row.title || '—',
        row.type || '—',
        row.status || '—',
        row.date || '—',
      ]);
    }
    console.log(`\n   ✅ ${result.rows.length} announcements synced.`);
  } catch (e) {
    console.log('\n   ⚠️  Announcement table not found or empty. Skipping...');
  }

  // ─────────────────────────────────────────────
  // 6. OFFERS & COUPONS
  // ─────────────────────────────────────────────
  console.log('\n🎫 [6/6] Syncing Offers & Coupons...');
  await addHeader('Offers', ['ID', 'Date (IST)', 'Title', 'Type', 'Code', 'Discount', 'Expiry', 'Status']);
  try {
    const result = await client.execute('SELECT * FROM "Offer" ORDER BY createdAt ASC');
    for (const row of result.rows) {
      await pushRow('Offers', [
        row.id,
        ist(row.createdAt),
        row.title || '—',
        row.type || '—',
        row.code || '—',
        row.discount || '—',
        row.expiryDate || 'No Expiry',
        row.isActive ? 'Active' : 'Disabled',
      ]);
    }
    console.log(`\n   ✅ ${result.rows.length} offers synced.`);
  } catch (e) {
    console.log('\n   ⚠️  Offer table not found or empty. Skipping...');
  }

  console.log('\n\n✅ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   SYNC COMPLETE. Your Google Sheet is now fully populated.');
  console.log('   🔗 https://docs.google.com/spreadsheets/d/1iivt2ZgaJn34tIT0oGZC-Ds92_Az8M6qoOjJjn5BqbI/edit');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

syncAllData().catch(console.error);
