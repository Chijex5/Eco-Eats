import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { updateRequestStatus } from '@/lib/db/requests';

const ALLOWED_STATUS = new Set(['APPROVED', 'DECLINED']);

export async function PATCH(request: Request, context: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'Request id is required.' }, { status: 400 });
    }

    const body = await request.json();
    const status = String(body.status || '').trim().toUpperCase();
    if (!ALLOWED_STATUS.has(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const updated = await updateRequestStatus(
      id,
      status as 'APPROVED' | 'DECLINED',
      session.userId
    );

    return NextResponse.json({ request: updated }, { status: 200 });
  } catch (error) {
    console.error('Update request status error:', error);
    return NextResponse.json({ error: 'Failed to update request.' }, { status: 500 });
  }
}
