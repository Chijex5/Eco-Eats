import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/db/users';
import { createPartner } from '@/lib/db/partners';
import { hashPassword } from '@/lib/auth/password';
import { normalizeRole } from '@/lib/auth/roles';
import { createOtp, invalidateOtps } from '@/lib/db/auth-otp';
import { generateOtpCode, hashOtp } from '@/lib/auth/otp';
import { sendSignupOtpEmail } from '@/lib/email/service';

const OTP_TTL_MINUTES = 10;

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

    if (role !== 'BENEFICIARY' && role !== 'DONOR' && role !== 'PARTNER_OWNER') {
      return NextResponse.json({ error: 'Selected role is not available for self-signup.' }, { status: 403 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing && existing.is_email_verified) {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
    }

    if (existing && !existing.is_email_verified) {
      await invalidateOtps(existing.id, 'PASSWORD_RESET');
      const otp = generateOtpCode();
      const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
      await createOtp({ userId: existing.id, purpose: 'PASSWORD_RESET', otpHash: hashOtp(otp), expiresAt });
      await sendSignupOtpEmail(existing.email, existing.full_name, otp);
      return NextResponse.json({
        message: 'A verification code was sent to your email.',
        requires_verification: true,
        email: existing.email,
      });
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
        location_text: partnerServiceArea || undefined,
      });
    }

    const otp = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    await createOtp({ userId: user.id, purpose: 'PASSWORD_RESET', otpHash: hashOtp(otp), expiresAt });
    await sendSignupOtpEmail(user.email, user.full_name, otp);

    return NextResponse.json({
      message: 'Account created. Enter the OTP sent to your email to complete signup.',
      requires_verification: true,
      email: user.email,
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && "code" in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
    }
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Failed to register.' }, { status: 500 });
  }
}
