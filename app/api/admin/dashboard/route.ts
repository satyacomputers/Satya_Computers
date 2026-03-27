export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'weekly'; // daily, weekly, monthly
    
    // Define query window based on range
    let dateLimit = '-28 days';
    let strftimeFormat = '%W';
    let labelPrefix = 'Week';

    if (range === 'daily') {
      dateLimit = '-7 days';
      strftimeFormat = '%d %b'; // e.g., 18 Mar
      labelPrefix = '';
    } else if (range === 'monthly') {
      dateLimit = '-6 months';
      strftimeFormat = '%b'; // e.g., Mar
      labelPrefix = '';
    }

    const results = await Promise.all([
      client.execute('SELECT COUNT(*) as count FROM "Product"'),
      client.execute('SELECT COUNT(*) as count FROM "Order"'),
      client.execute('SELECT COUNT(*) as count FROM "CustomerOrder"'),
      client.execute('SELECT COUNT(*) as count FROM "Offer"'),
      client.execute('SELECT SUM(estimatedValue) as total FROM "Order" WHERE status = \'Confirmed\''),
      client.execute('SELECT SUM(totalAmount) as total FROM "CustomerOrder"'),
      client.execute('SELECT * FROM "Order" ORDER BY createdAt DESC LIMIT 5'),
      client.execute('SELECT * FROM "CustomerOrder" ORDER BY createdAt DESC LIMIT 5'),
      client.execute({
        sql: `
          SELECT 
            period,
            SUM(val) as revenue,
            COUNT(*) as orders
          FROM (
            SELECT strftime(?, createdAt) as period, estimatedValue as val FROM "Order" WHERE createdAt >= date('now', ?)
            UNION ALL
            SELECT strftime(?, createdAt) as period, totalAmount as val FROM "CustomerOrder" WHERE createdAt >= date('now', ?)
          )
          GROUP BY period
          ORDER BY period ASC
        `,
        args: [strftimeFormat, dateLimit, strftimeFormat, dateLimit]
      })
    ]);

    const productCount = Number(results[0].rows[0]?.count || 0);
    const orderCountB2B = Number(results[1].rows[0]?.count || 0);
    const orderCountB2C = Number(results[2].rows[0]?.count || 0);
    const offerCount = Number(results[3].rows[0]?.count || 0);
    const totalRevenueB2B = Number(results[4].rows[0]?.total || 0);
    const totalRevenueB2C = Number(results[5].rows[0]?.total || 0);
    
    const recentB2B = results[6].rows.map((r: any) => ({ ...r, type: 'B2B' }));
    const recentB2C = results[7].rows.map((r: any) => ({ ...r, type: 'B2C', companyName: r.customerName, estimatedValue: r.totalAmount, status: r.orderStatus }));
    
    const recentOrders = [...recentB2B, ...recentB2C]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
    
    const rawData = results[8].rows;
    const chartData = rawData.map((row: any, i: number) => ({
      name: labelPrefix ? `${labelPrefix} ${i + 1}` : row.period,
      revenue: Number(row.revenue || 0),
      orders: Number(row.orders || 0)
    }));

    if (chartData.length === 0) {
      chartData.push({ name: 'Initial', revenue: 0, orders: 0 });
    }

    return NextResponse.json({
      stats: {
        productCount,
        orderCount: orderCountB2B + orderCountB2C,
        b2bCount: orderCountB2B,
        b2cCount: orderCountB2C,
        offerCount,
        totalRevenue: totalRevenueB2B + totalRevenueB2C
      },
      recentOrders,
      chartData
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error.message || error);
    return NextResponse.json({ error: error.message || 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
