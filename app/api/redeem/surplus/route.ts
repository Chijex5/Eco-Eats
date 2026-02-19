import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getPartnerIdForUser } from '@/lib/db/redemptions';
import { redeemSurplusPickup } from '@/lib/db/surplus';
import { findUserById } from '@/lib/db/users';
import { sendSurplusPickedUpEmail } from '@/lib/email/service';

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

    const beneficiary = await findUserById(claim.beneficiary_user_id);
    if (beneficiary) {
      await sendSurplusPickedUpEmail(beneficiary.email, beneficiary.full_name, claim.pickup_code);
    }

    return NextResponse.json({ success: true, claim });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to confirm pickup';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
