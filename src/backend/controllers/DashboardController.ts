import { BaseController } from '../baseController';
import { DashboardService } from '../services/dashboardService';

export class DashboardController extends BaseController {
  constructor(private readonly dashboardService: DashboardService) {
    super();
  }

  async getDashboard(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const range = searchParams.get('range') || 'weekly';

      const data = await this.dashboardService.getDashboardData(range);
      
      return this.handleSuccess(data);
    } catch (error: any) {
      // All errors go to Sentry or handled via BaseController
      return this.handleError(error, 'DashboardController.getDashboard');
    }
  }
}
