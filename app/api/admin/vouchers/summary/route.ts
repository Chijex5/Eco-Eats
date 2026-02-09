import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getAdminVoucherSummary } from '@/lib/db/vouchers';

const tips = [
  'Issue vouchers only for approved requests.',
  'Set expiry windows to reduce unredeemed vouchers.',
  'Encourage partners to log meal notes for impact reporting.',
];

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const summary = await getAdminVoucherSummary();
    return NextResponse.json({ summary, tips }, { status: 200 });
  } catch (error) {
    console.error('Get admin voucher summary error:', error);
    return NextResponse.json({ error: 'Failed to fetch voucher summary.' }, { status: 500 });
  }
}
