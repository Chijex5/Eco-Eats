import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getImpactSummary } from '@/lib/db/impact';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'DONOR' && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const summary = await getImpactSummary();
    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error('Get impact summary error:', error);
    return NextResponse.json({ error: 'Failed to fetch impact summary.' }, { status: 500 });
  }
}
