import { DashboardRepository } from '../repositories/DashboardRepository';

export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getDashboardData(range: string = 'weekly') {
    // Validate range
    const validRange = ['daily', 'weekly', 'monthly'].includes(range) ? range as ('daily' | 'weekly' | 'monthly') : 'weekly';
    
    const { results, labelPrefix } = await this.dashboardRepository.getDashboardAnalytics(validRange);

    const productCount = Number(results[0].rows[0]?.count || 0);
    const orderCountB2B = Number(results[1].rows[0]?.count || 0);
    const orderCountB2C = Number(results[2].rows[0]?.count || 0);
    const offerCount = Number(results[3].rows[0]?.count || 0);
    const totalRevenueB2B = Number(results[4].rows[0]?.total || 0);
    const totalRevenueB2C = Number(results[5].rows[0]?.total || 0);
    
    // Process Recent Orders
    const recentB2B = results[6].rows.map((r: any) => ({ ...r, type: 'B2B' }));
    const recentB2C = results[7].rows.map((r: any) => ({ ...r, type: 'B2C', companyName: r.customerName, estimatedValue: r.totalAmount, status: r.orderStatus }));
    
    const recentOrders = [...recentB2B, ...recentB2C]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
    
    // Process Chart Data
    const rawData = results[8].rows;
    const chartData = rawData.map((row: any, i: number) => ({
      name: labelPrefix ? `${labelPrefix} ${i + 1}` : row.period,
      revenue: Number(row.revenue || 0),
      orders: Number(row.orders || 0)
    }));

    if (chartData.length === 0) {
      chartData.push({ name: 'Initial', revenue: 0, orders: 0 });
    }

    return {
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
    };
  }
}
