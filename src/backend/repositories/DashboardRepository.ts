import { libsql } from '@/lib/prisma';

export class DashboardRepository {
  async getDashboardAnalytics(range: 'daily' | 'weekly' | 'monthly') {
    let dateLimit = '-28 days';
    let strftimeFormat = '%W';
    let labelPrefix = 'Week';

    if (range === 'daily') {
      dateLimit = '-7 days';
      strftimeFormat = '%d %b';
      labelPrefix = '';
    } else if (range === 'monthly') {
      dateLimit = '-6 months';
      strftimeFormat = '%b';
      labelPrefix = '';
    }

    const queries = [
      libsql.execute('SELECT COUNT(*) as count FROM "Product"'),
      libsql.execute('SELECT COUNT(*) as count FROM "Order"'),
      libsql.execute('SELECT COUNT(*) as count FROM "CustomerOrder"'),
      libsql.execute('SELECT COUNT(*) as count FROM "Offer"'),
      libsql.execute(`SELECT SUM(estimatedValue) as total FROM "Order" WHERE status = 'Confirmed'`),
      libsql.execute('SELECT SUM(totalAmount) as total FROM "CustomerOrder"'),
      libsql.execute('SELECT * FROM "Order" ORDER BY createdAt DESC LIMIT 5'),
      libsql.execute('SELECT * FROM "CustomerOrder" ORDER BY createdAt DESC LIMIT 5'),
      libsql.execute({
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
    ];

    const results = await Promise.all(queries);
    
    return {
      results,
      labelPrefix
    };
  }
}
