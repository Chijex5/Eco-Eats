import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db/users';
import { getLatestActiveOtp } from '@/lib/db/auth-otp';
import { hashOtp } from '@/lib/auth/otp';

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

    const record = await getLatestActiveOtp(user.id, 'PASSWORD_RESET');
    if (!record) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }

    if (new Date(record.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 });
    }

    if (hashOtp(otp) !== record.otp_hash) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password verify error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP.' }, { status: 500 });
  }
}
