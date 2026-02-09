import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getAdminPartnerOverview } from '@/lib/db/partners';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await getAdminPartnerOverview();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Get admin partners error:', error);
    return NextResponse.json({ error: 'Failed to fetch partners.' }, { status: 500 });
  }
}
