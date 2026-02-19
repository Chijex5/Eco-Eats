import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db/users';
import { createOtp, invalidateOtps } from '@/lib/db/auth-otp';
import { generateOtpCode, hashOtp } from '@/lib/auth/otp';
import { sendSignupOtpEmail } from '@/lib/email/service';

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
      return NextResponse.json({ error: 'No account found for that email.' }, { status: 404 });
    }

    if (user.is_email_verified) {
      return NextResponse.json({ error: 'Email is already verified. Please sign in.' }, { status: 400 });
    }

    await invalidateOtps(user.id, 'PASSWORD_RESET');

    const otp = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    await createOtp({ userId: user.id, purpose: 'PASSWORD_RESET', otpHash: hashOtp(otp), expiresAt });

    await sendSignupOtpEmail(user.email, user.full_name, otp);

    return NextResponse.json({ message: 'A new OTP was sent.' });
  } catch (error) {
    console.error('Signup resend OTP error:', error);
    return NextResponse.json({ error: 'Failed to resend OTP.' }, { status: 500 });
  }
}
