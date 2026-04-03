import { NextResponse } from 'next/server';

export class BaseController {
  protected handleSuccess(data: any, status = 200) {
    return NextResponse.json(data, { status });
  }

  protected handleError(error: any, origin: string) {
    console.error(`[ERROR] [${origin}]:`, error);
    // In a real production app, Sentry.captureException(error) would go here
    
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ 
      error: message,
      origin,
      success: false 
    }, { status: error.status || 500 });
  }
}
