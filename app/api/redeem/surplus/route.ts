import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getPartnerIdForUser } from '@/lib/db/redemptions';
import { redeemSurplusPickup } from '@/lib/db/surplus';

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: { pickupCode?: string };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const pickupCode = payload.pickupCode?.trim();
  if (!pickupCode) {
    return NextResponse.json({ error: 'Pickup code is required.' }, { status: 400 });
  }

  const partnerId = await getPartnerIdForUser(session.userId);
  if (!partnerId) {
    return NextResponse.json({ error: 'Partner association required to confirm pickup.' }, { status: 403 });
  }

  try {
    const claim = await redeemSurplusPickup(pickupCode, partnerId, session.userId);
    return NextResponse.json({ success: true, claim });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Unable to confirm pickup' }, { status: 400 });
  }
}
