import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { verifySessionToken } from '@/lib/auth/jwt';
import { upsertBeneficiaryProfile } from '@/lib/db/beneficiaryProfiles';
import { updateUser } from '@/lib/db/users';

const affiliationMap: Record<string, 'STUDENT' | 'STAFF' | 'COMMUNITY'> = {
  student: 'STUDENT',
  staff: 'STAFF',
  'community member': 'COMMUNITY',
  community: 'COMMUNITY',
};

const needLevelMap: Record<string, 'LOW' | 'MED' | 'HIGH'> = {
  low: 'LOW',
  medium: 'MED',
  high: 'HIGH',
};

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const session = await verifySessionToken(token);
    if (!session || session.role !== 'BENEFICIARY') {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
    }

    const body = await request.json();
    const affiliationRaw = String(body.affiliation || '').trim().toLowerCase();
    const location = String(body.location || '').trim();
    const needLevelRaw = String(body.needLevel || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();

    const affiliation = affiliationMap[affiliationRaw];
    const needLevel = needLevelMap[needLevelRaw];

    if (!affiliation || !needLevel || !location) {
      return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
    }

    await upsertBeneficiaryProfile(session.userId, {
      affiliation,
      location_text: location,
      need_level: needLevel,
    });

    if (phone) {
      await updateUser(session.userId, { phone });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Unable to save profile.' }, { status: 500 });
  }
}
