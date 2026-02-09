import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getAdminDashboardSummary, getRecentImpactActivity } from '@/lib/db/admin-dashboard';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [summary, activity] = await Promise.all([
      getAdminDashboardSummary(),
      getRecentImpactActivity(),
    ]);

    return NextResponse.json({ summary, activity }, { status: 200 });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data.' }, { status: 500 });
  }
}
