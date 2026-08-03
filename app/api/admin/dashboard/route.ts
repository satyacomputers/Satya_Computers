import { DashboardRepository } from '@/src/backend/repositories/DashboardRepository';
import { DashboardService } from '@/src/backend/services/dashboardService';
import { DashboardController } from '@/src/backend/controllers/DashboardController';

export const dynamic = 'force-dynamic';

// Dependency Injection Setup
const repository = new DashboardRepository();
const service = new DashboardService(repository);
const controller = new DashboardController(service);

export async function GET(req: Request) {
  // Routes Only Route
  return controller.getDashboard(req);
}

