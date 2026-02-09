import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getPartnerIdForUser } from '@/lib/db/redemptions';
import { createSurplusListing, getPartnerSurplusListings } from '@/lib/db/surplus';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const partnerId = params.id;
  if (!partnerId) {
    return NextResponse.json({ error: 'Partner id is required.' }, { status: 400 });
  }

  if (session.role !== 'ADMIN') {
    const userPartnerId = await getPartnerIdForUser(session.userId);
    if (!userPartnerId || userPartnerId !== partnerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const listings = await getPartnerSurplusListings(partnerId);
  return NextResponse.json({ listings });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const partnerId = params.id;
  if (!partnerId) {
    return NextResponse.json({ error: 'Partner id is required.' }, { status: 400 });
  }

  if (session.role !== 'ADMIN') {
    const userPartnerId = await getPartnerIdForUser(session.userId);
    if (!userPartnerId || userPartnerId !== partnerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  let payload: {
    title?: string;
    description?: string;
    quantityAvailable?: number;
    quantity_available?: number;
    claimLimitPerUser?: number;
    pickupDeadline?: string;
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const title = payload?.title?.trim();
  const quantity = payload?.quantityAvailable ?? payload?.quantity_available;
  const pickupDeadline = payload?.pickupDeadline ? new Date(payload.pickupDeadline) : null;

  if (!title || !quantity || !pickupDeadline) {
    return NextResponse.json({ error: 'Title, quantity, and pickup deadline are required.' }, { status: 400 });
  }

  if (Number.isNaN(pickupDeadline.getTime())) {
    return NextResponse.json({ error: 'Pickup deadline must be a valid date.' }, { status: 400 });
  }

  const listing = await createSurplusListing({
    partner_id: partnerId,
    title,
    description: payload.description,
    quantity_available: quantity,
    claim_limit_per_user: payload.claimLimitPerUser,
    pickup_deadline: pickupDeadline,
  });

  return NextResponse.json({ listing }, { status: 201 });
}
