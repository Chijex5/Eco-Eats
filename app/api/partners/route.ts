import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import {
  createPartner,
  getPartnerByOwnerUserId,
  getPartnerById,
  getPartnerRecentPickups,
  getPartnerRecentRedemptions,
  getPartnerStats,
  getPartnerStaff,
} from '@/lib/db/partners';
import { getPartnerIdForUser } from '@/lib/db/redemptions';

const parseOpeningHours = (value: unknown) => {
  if (!value) {
    return null;
  }
  if (typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  return null;
};

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const partnerId = await getPartnerIdForUser(session.userId);
  if (!partnerId) {
    return NextResponse.json({ error: 'Partner profile not found' }, { status: 404 });
  }

  const partner = await getPartnerById(partnerId);
  if (!partner) {
    return NextResponse.json({ error: 'Partner profile not found' }, { status: 404 });
  }

  const [stats, recentRedemptions, recentPickups, staff] = await Promise.all([
    getPartnerStats(partnerId),
    getPartnerRecentRedemptions(partnerId, 6),
    getPartnerRecentPickups(partnerId, 6),
    getPartnerStaff(partnerId),
  ]);

  return NextResponse.json({
    partner: {
      ...partner,
      opening_hours_json: parseOpeningHours(partner.opening_hours_json),
    },
    stats,
    recentRedemptions,
    recentPickups,
    staff,
  });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.role !== 'PARTNER_OWNER' && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const existing = await getPartnerByOwnerUserId(session.userId);
  if (existing && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Partner already exists for this owner.' }, { status: 409 });
  }

  let payload: {
    name?: string;
    description?: string;
    logoUrl?: string;
    locationText?: string;
    lat?: number | null;
    lng?: number | null;
    openingHours?: Record<string, unknown> | null;
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (!payload?.name) {
    return NextResponse.json({ error: 'Partner name is required.' }, { status: 400 });
  }

  const partner = await createPartner({
    owner_user_id: session.userId,
    name: payload.name,
    description: payload.description,
    logo_url: payload.logoUrl,
    location_text: payload.locationText,
    lat: payload.lat ?? null,
    lng: payload.lng ?? null,
    opening_hours_json: payload.openingHours ?? null,
  });

  return NextResponse.json({ partner }, { status: 201 });
}
