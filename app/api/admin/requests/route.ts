import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getAdminRequests, type SupportRequest } from '@/lib/db/requests';

const STATUS_VALUES = new Set(['PENDING', 'APPROVED', 'DECLINED', 'FULFILLED']);

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    let status: SupportRequest['status'] | undefined;

    if (statusParam) {
      const normalized = statusParam.trim().toUpperCase();
      if (!STATUS_VALUES.has(normalized)) {
        return NextResponse.json({ error: 'Invalid status filter.' }, { status: 400 });
      }
      status = normalized as SupportRequest['status'];
    }

    const requests = await getAdminRequests(status);
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Get admin requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch requests.' }, { status: 500 });
  }
}
