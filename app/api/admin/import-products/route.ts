import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import crypto from 'crypto';

import { libsql } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const logFile = path.join(process.cwd(), 'import_log.txt');
    fs.writeFileSync(logFile, `Clean Visual Protocol Initiated at ${new Date().toISOString()}\n`);
    const log = (msg: string) => {
        console.log(msg);
        fs.appendFileSync(logFile, msg + '\n');
    };

    // 1. Clear Database
    log('Resetting catalog state...');
    try {
        await libsql.execute('DELETE FROM "Product"');
        await libsql.execute('DELETE FROM "Category"');
    } catch (e) {}

    // 2. Read Products from CSV
    const csvPath = path.join(process.cwd(), 'public', 'products', 'products.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records: Record<string, string>[] = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const importedProducts = [];

    // 3. Process with CLEAN visuals
    for (let i = 0; i < records.length; i++) {
        const row = records[i];
        const rawPrice = parseInt(row['Price']) || 0;
        const baseName = row['Model'];
        
        let brand = 'Unknown';
        const bh = baseName.toUpperCase();
        if (bh.includes('DELL')) brand = 'Dell';
        else if (bh.includes('LENOVO') || bh.includes('THINKPAD')) brand = 'Lenovo';
        else if (bh.includes('HP')) brand = 'HP';
        else if (bh.includes('MACBOOK') || bh.includes('APPLE')) brand = 'Apple';
        else brand = 'Mixed';

        const category = brand === 'Apple' ? 'MacBook' : 'Laptop';
        const isFeatured = rawPrice >= 40000;

        // Use the CLEAN image sequence (1 to 33)
        const imageIndex = (i % 33) + 1;
        const imagePath = `/products/clean_${imageIndex}.png`;

        log(`Importing ${i+1}/${records.length}: ${baseName} -> ${imagePath}`);

        const productId = `p_${crypto.randomBytes(6).toString('hex')}`;
        const description = `Premium refurbished ${brand} ${baseName}. Professionally inspected, high-performance computing asset. Featuring ${row['RAM']} memory and lightning-fast ${row['Storage']}GB SSD storage. Perfect for ${i < 10 ? 'corporate productivity' : 'creative professionals'}.`;
        const os = brand === 'Apple' ? 'macOS Sonoma' : 'Windows 11 Pro';

        await libsql.execute({
            sql: `INSERT INTO "Product" (id, name, brand, category, processor, ram, storage, display, os, price, bulkPrice5_10, bulkPrice11_25, bulkPrice26Plus, stockStatus, image, description, isFeatured, warranty, createdAt, updatedAt)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            args: [productId, baseName, brand, category, row['Configuration'] || 'Elite', row['RAM'] || '8GB', row['Storage'] ? `${row['Storage']}GB` : '256GB', row['Size'] ? `${row['Size']}"` : '14"', os, rawPrice, Math.round(rawPrice*0.95), Math.round(rawPrice*0.9), Math.round(rawPrice*0.85), 'In Stock', imagePath, description, isFeatured ? 1 : 0, row['Warranty'] || '1 Year']
        });

        // Handle Category
        try {
            const catSlug = category.toLowerCase();
            await libsql.execute({
                sql: 'INSERT OR IGNORE INTO "Category" (id, name, slug, image, createdAt, updatedAt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
                args: [`c_${catSlug}`, category, catSlug, imagePath]
            });
        } catch (ce) {}

        importedProducts.push({ id: productId, name: baseName });
    }

    return NextResponse.json({
        success: true,
        message: `Catalog reconstructed with ${importedProducts.length} high-quality professional records.`,
        visuals: '100% CLEAN'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
