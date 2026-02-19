import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getFoodPackClaimEligibility } from '@/lib/db/requests';
import { claimSurplusListing } from '@/lib/db/surplus';
import { findUserById } from '@/lib/db/users';
import { sendSurplusClaimedEmail } from '@/lib/email/service';

type ClaimPayload = {
  listingId?: string;
};

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as ClaimPayload;
    const listingId = String(body.listingId || '').trim();

    if (!listingId) {
      return NextResponse.json({ error: 'listingId is required.' }, { status: 400 });
    }

    const eligibility = await getFoodPackClaimEligibility(session.userId);
    if (!eligibility.hasApprovedFoodPack) {
      return NextResponse.json(
        { error: 'You do not have an approved food pack request yet.' },
        { status: 403 }
      );
    }

    if (!eligibility.canClaimSurplus) {
      return NextResponse.json(
        {
          error:
            'This food pack request has already been used. Cancel your existing surplus claim before claiming another.',
        },
        { status: 403 }
      );
    }

    const claim = await claimSurplusListing(listingId, session.userId);

    const beneficiary = await findUserById(session.userId);
    if (beneficiary) {
      await sendSurplusClaimedEmail(
        beneficiary.email,
        beneficiary.full_name,
        claim.title,
        claim.pickup_code
      );
    }

    return NextResponse.json({ claim }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to claim this surplus listing.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
