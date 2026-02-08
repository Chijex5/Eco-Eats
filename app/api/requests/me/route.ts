import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getUserRequests } from '@/lib/db/requests';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'BENEFICIARY') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const requests = await getUserRequests(session.userId);
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Get user requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch requests.' }, { status: 500 });
  }
}
