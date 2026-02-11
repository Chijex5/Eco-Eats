import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/db/users';
import { createPartner } from '@/lib/db/partners';
import { hashPassword } from '@/lib/auth/password';
import { applySessionCookie } from '@/lib/auth/cookies';
import { normalizeRole, roleHomePath } from '@/lib/auth/roles';
import { signSessionToken } from '@/lib/auth/jwt';

function isValidEmail(email: string) {
  return /.+@.+\..+/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.full_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const role = normalizeRole(body.role);
    if (role !== 'BENEFICIARY' && role !== 'DONOR' && role !== 'PARTNER_OWNER') {
      return NextResponse.json({ error: 'Invalid role for registration.' }, { status: 400 });
    }
    const partnerOrganization = String(body.organization || '').trim();
    const partnerServiceArea = String(body.service_area || '').trim();

    if (!fullName || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({
      full_name: fullName,
      email,
      password_hash: passwordHash,
      role,
    });

    if (role === 'PARTNER_OWNER') {
      await createPartner({
        owner_user_id: user.id,
        name: partnerOrganization || `${fullName}'s Kitchen`,
        location_text: partnerServiceArea || null,
      });
    }

    const token = await signSessionToken({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.full_name,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
      redirect: roleHomePath(user.role),
    });
    applySessionCookie(response, token);
    return response;
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
    }
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Failed to register.' }, { status: 500 });
  }
}
