/**
 * Donation queries
 * Database operations for donations table
 */

import { query } from './connection';
import { generateId } from './ids';
import { logImpactEvent } from './impact';

export type DonationStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type DonationRecord = {
  id: string;
  donor_user_id: string;
  amount_kobo: number;
  currency: string;
  donation_type: string;
  status: DonationStatus;
  payment_ref: string;
  created_at: Date;
};

const MEAL_VALUE_KOBO = 100_000;

export async function createDonation(data: {
  donorUserId: string;
  amountKobo: number;
  donationType: string;
  status?: DonationStatus;
  currency?: string;
  mealCount?: number;
}) {
  const id = generateId();
  const paymentRef = `PAY-${generateId()}`;
  const status = data.status ?? 'COMPLETED';
  const currency = data.currency ?? 'NGN';

  await query(
    `INSERT INTO donations (id, donor_user_id, amount_kobo, currency, donation_type, status, payment_ref)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, data.donorUserId, data.amountKobo, currency, data.donationType, status, paymentRef]
  );

  if (status === 'COMPLETED') {
    const estimatedMeals = data.mealCount
      ?? Math.max(1, Math.round(data.amountKobo / MEAL_VALUE_KOBO));
    await logImpactEvent({ eventType: 'MEAL_FUNDED', relatedId: id, count: estimatedMeals });
  }

  const result = await query('SELECT * FROM donations WHERE id = ?', [id]);
  return result.rows[0] as DonationRecord;
}

export async function getDonationsByDonor(donorUserId: string) {
  const result = await query<DonationRecord>(
    `SELECT * FROM donations WHERE donor_user_id = ? ORDER BY created_at DESC`,
    [donorUserId]
  );
  return result.rows;
}

export async function getDonorDonationSummary(donorUserId: string) {
  const result = await query<{ total: number; count: number }>(
    `SELECT COUNT(*) AS count, COALESCE(SUM(amount_kobo), 0) AS total
     FROM donations
     WHERE donor_user_id = ?`,
    [donorUserId]
  );

  const row = result.rows[0] ?? { total: 0, count: 0 };
  return {
    totalAmountKobo: Number(row.total ?? 0),
    donationCount: Number(row.count ?? 0),
  };
}
