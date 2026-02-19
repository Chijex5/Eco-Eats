import { NextResponse } from 'next/server';
import { findUserByEmail, updateUserPassword } from '@/lib/db/users';
import { hashPassword } from '@/lib/auth/password';
import { getLatestActiveOtp, consumeOtp } from '@/lib/db/auth-otp';
import { hashOtp } from '@/lib/auth/otp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const otp = String(body.otp || '').trim();
    const newPassword = String(body.newPassword || '');

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Email, OTP and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid reset request.' }, { status: 400 });
    }

    const record = await getLatestActiveOtp(user.id, 'PASSWORD_RESET');
    if (!record) {
      return NextResponse.json({ error: 'Invalid reset request.' }, { status: 400 });
    }

    if (new Date(record.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 });
    }

    if (hashOtp(otp) !== record.otp_hash) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);
    await updateUserPassword(user.id, passwordHash, true);
    await consumeOtp(record.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password reset error:', error);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}
