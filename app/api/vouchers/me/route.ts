import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getUserVouchers } from '@/lib/db/vouchers';
import { getRequestsByBeneficiary } from '@/lib/db/requests';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const vouchers = await getUserVouchers(session.userId);
  const requests = await getRequestsByBeneficiary(session.userId);

  const voucherRequests = requests
    .filter((request) => request.request_type === 'VOUCHER')
    .map((request) => ({
      id: request.id,
      status: request.status,
      created_at: request.created_at,
      urgency: request.urgency,
    }));

  return NextResponse.json({ vouchers, voucherRequests });
}
