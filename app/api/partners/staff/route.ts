import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { getPartnerByOwnerUserId, addPartnerStaffMember } from '@/lib/db/partners';
import { createUser, findUserByEmail } from '@/lib/db/users';
import { hashPassword } from '@/lib/auth/password';

function isValidEmail(email: string) {
  return /.+@.+\..+/.test(email);
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'PARTNER_OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const partner = await getPartnerByOwnerUserId(session.userId);
    if (!partner) {
      return NextResponse.json({ error: 'Partner profile not found.' }, { status: 404 });
    }

    const body = await request.json();
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const temporaryPassword = String(body.temporaryPassword || '');
    const staffRole = String(body.staffRole || '').trim();
    const canRedeem = body.canRedeem !== false;
    const canPostSurplus = Boolean(body.canPostSurplus);

    if (!fullName || !email || !temporaryPassword) {
      return NextResponse.json({ error: 'Name, email, and temporary password are required.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (temporaryPassword.length < 8) {
      return NextResponse.json({ error: 'Temporary password must be at least 8 characters.' }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(temporaryPassword);
    const user = await createUser({
      full_name: fullName,
      email,
      password_hash: passwordHash,
      role: 'PARTNER_STAFF',
      must_change_password: true,
    });

    const staff = await addPartnerStaffMember({
      partner_id: partner.id,
      user_id: user.id,
      staff_role: staffRole || null,
      can_redeem: canRedeem,
      can_post_surplus: canPostSurplus,
    });

    return NextResponse.json({
      staff,
      message: 'Staff member created. Temporary password must be changed at first login.',
    }, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'This user is already assigned as staff.' }, { status: 409 });
    }
    console.error('Create partner staff error:', error);
    return NextResponse.json({ error: 'Failed to create staff member.' }, { status: 500 });
  }
}
