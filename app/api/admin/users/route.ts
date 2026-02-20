import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { countUsersByRole, listUsersForAdmin } from '@/lib/db/users';

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [users, countsByRole] = await Promise.all([
      listUsersForAdmin(),
      countUsersByRole(),
    ]);

    return NextResponse.json({ users, countsByRole }, { status: 200 });
  } catch (error) {
    console.error('List users for admin error:', error);
    return NextResponse.json({ error: 'Failed to fetch users.' }, { status: 500 });
  }
}
