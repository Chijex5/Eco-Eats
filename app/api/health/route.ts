/**
 * Health check API route
 * GET /api/health
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const result = await query<{ current_time: string }>('SELECT NOW() as current_time');
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0].current_time
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: message
      },
      { status: 500 }
    );
  }
}
