import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { hasApprovedFoodPackRequest } from '@/lib/db/requests';
import { claimSurplusListing } from '@/lib/db/surplus';

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

    const canClaim = await hasApprovedFoodPackRequest(session.userId);
    if (!canClaim) {
      return NextResponse.json(
        { error: 'You do not have an approved food pack request yet.' },
        { status: 403 }
      );
    }

    const claim = await claimSurplusListing(listingId, session.userId);
    return NextResponse.json({ claim }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to claim this surplus listing.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
