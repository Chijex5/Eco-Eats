import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getRequestsByBeneficiary } from '@/lib/db/requests';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'BENEFICIARY') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const requests = await getRequestsByBeneficiary(session.userId);
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Get user requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch requests.' }, { status: 500 });
  }
}
