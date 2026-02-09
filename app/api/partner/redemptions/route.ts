import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getPartnerIdForUser, getPartnerRedemptions, getPartnerRedemptionSummary } from '@/lib/db/redemptions';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'PARTNER_OWNER' && session.role !== 'PARTNER_STAFF') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const partnerId = await getPartnerIdForUser(session.userId);
    if (!partnerId) {
      return NextResponse.json({ error: 'Partner association required' }, { status: 403 });
    }

    const [redemptions, summary] = await Promise.all([
      getPartnerRedemptions(partnerId),
      getPartnerRedemptionSummary(partnerId),
    ]);

    return NextResponse.json({ redemptions, summary }, { status: 200 });
  } catch (error) {
    console.error('Get partner redemptions error:', error);
    return NextResponse.json({ error: 'Failed to fetch redemptions.' }, { status: 500 });
  }
}
