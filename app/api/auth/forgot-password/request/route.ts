import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db/users';
import { createOtp, invalidateOtps } from '@/lib/db/auth-otp';
import { generateOtpCode, hashOtp } from '@/lib/auth/otp';
import { sendPasswordResetOtpEmail } from '@/lib/email/service';

const OTP_TTL_MINUTES = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: true });
    }

    await invalidateOtps(user.id, 'PASSWORD_RESET');

    const otp = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    await createOtp({
      userId: user.id,
      purpose: 'PASSWORD_RESET',
      otpHash: hashOtp(otp),
      expiresAt,
    });

    await sendPasswordResetOtpEmail(user.email, user.full_name, otp);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password request error:', error);
    return NextResponse.json({ error: 'Failed to send OTP.' }, { status: 500 });
  }
}
