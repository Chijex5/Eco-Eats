import { NextResponse } from 'next/server';
import { findUserByEmail, verifyUserEmail } from '@/lib/db/users';
import { consumeOtp, getLatestActiveOtp } from '@/lib/db/auth-otp';
import { hashOtp } from '@/lib/auth/otp';
import { signSessionToken } from '@/lib/auth/jwt';
import { applySessionCookie } from '@/lib/auth/cookies';
import { roleHomePath } from '@/lib/auth/roles';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const otp = String(body.otp || '').trim();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }

    if (user.is_email_verified) {
      return NextResponse.json({ error: 'Email is already verified. Please sign in.' }, { status: 400 });
    }

    const record = await getLatestActiveOtp(user.id, 'PASSWORD_RESET');
    if (!record) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }

    if (record.expires_at.getTime() < Date.now()) {
      return NextResponse.json({ error: 'OTP has expired. Request a new code.' }, { status: 400 });
    }

    if (hashOtp(otp) !== record.otp_hash) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }

    await consumeOtp(record.id);
    const verifiedUser = await verifyUserEmail(user.id);

    const token = await signSessionToken({
      userId: verifiedUser.id,
      role: verifiedUser.role,
      email: verifiedUser.email,
      name: verifiedUser.full_name,
    });

    const response = NextResponse.json({
      user: {
        id: verifiedUser.id,
        full_name: verifiedUser.full_name,
        email: verifiedUser.email,
        role: verifiedUser.role,
      },
      redirect: roleHomePath(verifiedUser.role),
    });

    applySessionCookie(response, token);
    return response;
  } catch (error) {
    console.error('Signup verify error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP.' }, { status: 500 });
  }
}
