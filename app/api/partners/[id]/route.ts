import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getPartnerIdForUser } from '@/lib/db/redemptions';
import { updatePartner } from '@/lib/db/partners';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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
    name?: string;
    description?: string | null;
    logoUrl?: string | null;
    locationText?: string | null;
    lat?: number | null;
    lng?: number | null;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    openingHours?: Record<string, unknown> | null;
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (payload?.status && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only admins can change partner status.' }, { status: 403 });
  }

  const partner = await updatePartner(partnerId, {
    name: payload?.name,
    description: payload?.description ?? undefined,
    logo_url: payload?.logoUrl ?? undefined,
    location_text: payload?.locationText ?? undefined,
    lat: payload?.lat ?? undefined,
    lng: payload?.lng ?? undefined,
    status: payload?.status,
    opening_hours_json: payload?.openingHours ?? undefined,
  });

  if (!partner) {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  }

  return NextResponse.json({ partner });
}
