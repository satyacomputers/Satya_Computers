import { BaseController } from '../baseController';
import { orderService } from '../services/orderService';
import { NextResponse } from 'next/server';

export class OrderController extends BaseController {
  constructor(private readonly service = orderService) {
    super();
  }

  public async create(request: Request) {
    try {
      const data = await request.json();
      const result = await this.service.placeOrder(data);
      return this.handleSuccess(result, 201);
    } catch (error: any) {
      // In a production environment, this is where you'd map specific 
      // Zod/Prisma errors to user-friendly status codes.
      if (error.status === 400 || error.name === 'ZodError') {
        return NextResponse.json({ 
          error: 'Hardware protocol validation failure',
          details: error.errors || error.message 
        }, { status: 400 });
      }
      return this.handleError(error, 'OrderController.create');
    }
  }
}

export const orderController = new OrderController();
