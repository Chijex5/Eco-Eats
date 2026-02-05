import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db/users';
import { verifyPassword } from '@/lib/auth/password';
import { applySessionCookie } from '@/lib/auth/cookies';
import { roleHomePath } from '@/lib/auth/roles';
import { signSessionToken } from '@/lib/auth/jwt';
import { hasBeneficiaryProfile } from '@/lib/db/beneficiaryProfiles';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = await signSessionToken({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.full_name,
    });

    const hasProfile = user.role === 'BENEFICIARY' ? await hasBeneficiaryProfile(user.id) : undefined;
    const response = NextResponse.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
      redirect: roleHomePath(user.role, { hasProfile }),
    });
    applySessionCookie(response, token);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to sign in.' }, { status: 500 });
  }
}
