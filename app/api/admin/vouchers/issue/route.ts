import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { createVoucher } from '@/lib/db/vouchers';
import { getSupportRequestById, markRequestFulfilled } from '@/lib/db/requests';

type IssueVoucherPayload = {
  requestId: string;
  valueKobo: number;
  expiresInDays?: number;
};

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: IssueVoucherPayload;
  try {
    payload = (await request.json()) as IssueVoucherPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (!payload?.requestId || typeof payload.valueKobo !== 'number') {
    return NextResponse.json({ error: 'requestId and valueKobo are required' }, { status: 400 });
  }

  if (payload.valueKobo <= 0) {
    return NextResponse.json({ error: 'valueKobo must be greater than zero' }, { status: 400 });
  }

  if (payload.expiresInDays !== undefined && payload.expiresInDays <= 0) {
    return NextResponse.json({ error: 'expiresInDays must be greater than zero' }, { status: 400 });
  }

  const supportRequest = await getSupportRequestById(payload.requestId);
  if (!supportRequest) {
    return NextResponse.json({ error: 'Support request not found' }, { status: 404 });
  }

  if (supportRequest.status !== 'APPROVED') {
    return NextResponse.json({ error: 'Support request must be approved before issuing a voucher' }, { status: 400 });
  }

  if (supportRequest.request_type !== 'VOUCHER') {
    return NextResponse.json({ error: 'Support request is not voucher eligible' }, { status: 400 });
  }

  const expiresAt = payload.expiresInDays
    ? new Date(Date.now() + payload.expiresInDays * 24 * 60 * 60 * 1000)
    : undefined;

  const voucher = await createVoucher({
    value_kobo: payload.valueKobo,
    beneficiary_user_id: supportRequest.beneficiary_user_id,
    issued_by_admin_id: session.userId,
    expires_at: expiresAt,
  });

  await markRequestFulfilled(supportRequest.id, session.userId);

  return NextResponse.json({ voucher });
}
