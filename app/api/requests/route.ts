import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { createRequest } from '@/lib/db/requests';

const REQUEST_TYPES = new Set(['VOUCHER', 'FOOD_PACK']);
const URGENCY_LEVELS = new Set(['LOW', 'MED', 'HIGH']);

function normalizeUrgency(input: string) {
  const value = input.trim().toUpperCase();
  if (value === 'MEDIUM') {
    return 'MED';
  }
  return value;
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'BENEFICIARY') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const requestType = String(body.requestType || '').trim().toUpperCase();
    const message = String(body.message || '').trim();
    const urgency = normalizeUrgency(String(body.urgency || '').trim());

    if (!REQUEST_TYPES.has(requestType)) {
      return NextResponse.json({ error: 'Invalid request type.' }, { status: 400 });
    }
    if (!URGENCY_LEVELS.has(urgency)) {
      return NextResponse.json({ error: 'Invalid urgency level.' }, { status: 400 });
    }

    const created = await createRequest({
      beneficiaryUserId: session.userId,
      requestType: requestType as 'VOUCHER' | 'FOOD_PACK',
      message: message.length > 0 ? message : undefined,
      urgency: urgency as 'LOW' | 'MED' | 'HIGH',
    });

    return NextResponse.json({ id: created.id, status: created.status }, { status: 201 });
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json({ error: 'Failed to create request.' }, { status: 500 });
  }
}
