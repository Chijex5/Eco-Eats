import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { findVoucherByCode, findVoucherByQRToken, redeemVoucher } from '@/lib/db/vouchers';
import { getPartnerIdForUser } from '@/lib/db/redemptions';

type RedeemPayload = {
  code?: string;
  qrToken?: string;
  mealDescription?: string;
};

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: RedeemPayload;
  try {
    payload = (await request.json()) as RedeemPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const code = payload.code?.trim();
  const qrToken = payload.qrToken?.trim();

  if (!code && !qrToken) {
    return NextResponse.json({ error: 'Provide a voucher code or QR token' }, { status: 400 });
  }

  const voucher = code
    ? await findVoucherByCode(code)
    : await findVoucherByQRToken(qrToken as string);

  if (!voucher) {
    return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
  }

  const partnerId = await getPartnerIdForUser(session.userId);
  if (!partnerId) {
    return NextResponse.json({ error: 'Partner association required to redeem vouchers' }, { status: 403 });
  }

  try {
    const redemption = await redeemVoucher(
      voucher.id,
      partnerId,
      session.userId,
      session.userId,
      payload.mealDescription
    );

    return NextResponse.json({ success: true, voucher, redemption });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Unable to redeem voucher' }, { status: 400 });
  }
}
