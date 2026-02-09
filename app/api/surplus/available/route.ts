import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getAvailableSurplusListings } from '@/lib/db/surplus';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const listings = await getAvailableSurplusListings();
    return NextResponse.json({ listings }, { status: 200 });
  } catch (error) {
    console.error('Get surplus listings error:', error);
    return NextResponse.json({ error: 'Failed to fetch surplus listings.' }, { status: 500 });
  }
}
