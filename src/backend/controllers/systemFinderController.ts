import { BaseController } from '../baseController';
import { systemFinderService } from '../services/systemFinderService';
import { NextResponse } from 'next/server';

export class SystemFinderController extends BaseController {
  constructor(private readonly service = systemFinderService) {
    super();
  }

  public async getRecommendation(request: Request) {
    try {
      const data = await request.json();
      const result = await this.service.getRecommendation(data);
      return this.handleSuccess(result);
    } catch (error: any) {
      if (error.status === 400 || error.name === 'ZodError') {
        return NextResponse.json({ 
          error: 'Hardware protocol validation failure',
          details: error.errors || error.message 
        }, { status: 400 });
      }
      return this.handleError(error, 'SystemFinderController.getRecommendation');
    }
  }
}

export const systemFinderController = new SystemFinderController();
