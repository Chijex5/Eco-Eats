import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getBeneficiaryHistory } from '@/lib/db/history';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await getBeneficiaryHistory(session.userId);
    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Get beneficiary history error:', error);
    return NextResponse.json({ error: 'Failed to fetch history.' }, { status: 500 });
  }
}
