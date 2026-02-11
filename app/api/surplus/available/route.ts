import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getAvailableSurplusListings, getBeneficiarySurplusClaims } from '@/lib/db/surplus';
import { hasApprovedFoodPackRequest } from '@/lib/db/requests';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [listings, hasApprovedFoodPack, claims] = await Promise.all([
      getAvailableSurplusListings(),
      hasApprovedFoodPackRequest(session.userId),
      getBeneficiarySurplusClaims(session.userId),
    ]);

    return NextResponse.json({ listings, hasApprovedFoodPack, claims }, { status: 200 });
  } catch (error) {
    console.error('Get surplus listings error:', error);
    return NextResponse.json({ error: 'Failed to fetch surplus listings.' }, { status: 500 });
  }
}
