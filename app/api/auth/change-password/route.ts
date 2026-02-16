import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { findUserById, updateUserPassword } from '@/lib/db/users';
import { applySessionCookie } from '@/lib/auth/cookies';
import { signSessionToken } from '@/lib/auth/jwt';
import { roleHomePath } from '@/lib/auth/roles';

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const currentPassword = String(body.currentPassword || '');
    const newPassword = String(body.newPassword || '');

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new passwords are required.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const isValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }

    const newPasswordHash = await hashPassword(newPassword);
    const updated = await updateUserPassword(user.id, newPasswordHash, true);

    const token = await signSessionToken({
      userId: updated.id,
      role: updated.role,
      email: updated.email,
      name: updated.full_name,
      mustChangePassword: false,
    });

    const response = NextResponse.json({
      success: true,
      redirect: roleHomePath(updated.role),
    });
    applySessionCookie(response, token);
    return response;
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Failed to change password.' }, { status: 500 });
  }
}
