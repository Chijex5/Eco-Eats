import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { createUser, findUserByEmail, listUsersByRole } from '@/lib/db/users';
import { hashPassword } from '@/lib/auth/password';

function isValidEmail(email: string) {
  return /.+@.+\..+/.test(email);
}

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const admins = await listUsersByRole('ADMIN');
    return NextResponse.json({ admins }, { status: 200 });
  } catch (error) {
    console.error('Get admins error:', error);
    return NextResponse.json({ error: 'Failed to fetch admins.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const fullName = String(body.full_name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!fullName || !email || !password) {
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
    const admin = await createUser({
      full_name: fullName,
      email,
      password_hash: passwordHash,
      role: 'ADMIN',
    });

    return NextResponse.json(
      {
        admin: {
          id: admin.id,
          full_name: admin.full_name,
          email: admin.email,
          role: admin.role,
          created_at: admin.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error && typeof error === 'object' && "code" in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
    }
    console.error('Create admin error:', error);
    return NextResponse.json({ error: 'Failed to create admin.' }, { status: 500 });
  }
}
