/**
 * Database setup API route
 * Used to initialize database tables
 * POST /api/setup
 */

import { NextResponse } from 'next/server';
import { createTables } from '@/lib/db';

export async function POST() {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL not configured' },
        { status: 500 }
      );
    }

    await createTables();

    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully'
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to setup database' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to initialize database tables'
  });
}
