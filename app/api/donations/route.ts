import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth/session';
import { createDonation, getDonationsByDonor, getDonorDonationSummary } from '@/lib/db/donations';
import { findUserById } from '@/lib/db/users';
import { sendDonationReceiptEmail } from '@/lib/email/service';

const DONATION_TYPES = new Set(['VOUCHER', 'FOOD_PACK', 'SURPLUS']);

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'DONOR' && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [donations, summary] = await Promise.all([
      getDonationsByDonor(session.userId),
      getDonorDonationSummary(session.userId),
    ]);

    return NextResponse.json({ donations, summary }, { status: 200 });
  } catch (error) {
    console.error('Get donations error:', error);
    return NextResponse.json({ error: 'Failed to fetch donations.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'DONOR' && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const amountNgn = Number(body.amountNgn ?? 0);
    const donationType = String(body.donationType ?? '').trim().toUpperCase();
    const mealCount = body.mealCount ? Number(body.mealCount) : undefined;

    if (!Number.isFinite(amountNgn) || amountNgn <= 0) {
      return NextResponse.json({ error: 'Invalid donation amount.' }, { status: 400 });
    }
    if (!DONATION_TYPES.has(donationType)) {
      return NextResponse.json({ error: 'Invalid donation type.' }, { status: 400 });
    }
    if (mealCount !== undefined && (!Number.isFinite(mealCount) || mealCount <= 0)) {
      return NextResponse.json({ error: 'Invalid meal count.' }, { status: 400 });
    }

    const amountKobo = Math.round(amountNgn * 100);
    const donation = await createDonation({
      donorUserId: session.userId,
      amountKobo,
      donationType,
      mealCount: mealCount ? Math.round(mealCount) : undefined,
    });

    const donor = await findUserById(session.userId);
    if (donor) {
      await sendDonationReceiptEmail(
        donor.email,
        donor.full_name,
        (donation.amount_kobo / 100).toFixed(2),
        donation.donation_type
      );
    }

    return NextResponse.json({ donation }, { status: 201 });
  } catch (error) {
    console.error('Create donation error:', error);
    return NextResponse.json({ error: 'Failed to create donation.' }, { status: 500 });
  }
}
