import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getUserVouchers } from '@/lib/db/vouchers';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const vouchers = await getUserVouchers(session.userId);
  return NextResponse.json({ vouchers });
}
