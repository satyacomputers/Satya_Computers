import { orderController } from '@/src/backend/controllers/orderController';

export async function POST(request: Request) {
  return orderController.create(request);
}
