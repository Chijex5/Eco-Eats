/**
 * Redemption helpers
 * Database operations for voucher_redemptions and partner lookups
 */

import { query } from './connection';

export type PartnerRedemption = {
  id: string;
  redeemed_at: string;
  meal_description?: string | null;
  value_kobo: number;
  voucher_code: string;
  beneficiary_name?: string | null;
};

export async function getPartnerIdForUser(userId: string) {
  const staffResult = await query(
    'SELECT partner_id FROM partner_staff WHERE user_id = ? LIMIT 1',
    [userId]
  );
  const staffRow = staffResult.rows[0] as { partner_id?: string } | undefined;
  if (staffRow?.partner_id) {
    return staffRow.partner_id;
  }

  const ownerResult = await query(
    'SELECT id FROM food_partners WHERE owner_user_id = ? LIMIT 1',
    [userId]
  );
  const ownerRow = ownerResult.rows[0] as { id?: string } | undefined;
  return ownerRow?.id;
}

export async function getPartnerRedemptions(partnerId: string) {
  const result = await query(
    `SELECT 
      vr.id,
      vr.redeemed_at,
      vr.meal_description,
      vr.value_kobo,
      v.code AS voucher_code,
      u.full_name AS beneficiary_name
     FROM voucher_redemptions vr
     JOIN vouchers v ON v.id = vr.voucher_id
     LEFT JOIN users u ON u.id = v.beneficiary_user_id
     WHERE vr.partner_id = ?
     ORDER BY vr.redeemed_at DESC`,
    [partnerId]
  );

  return result.rows as PartnerRedemption[];
}

export async function getPartnerRedemptionSummary(partnerId: string) {
  const result = await query(
    `SELECT 
      COUNT(*) AS total_meals,
      COALESCE(SUM(value_kobo), 0) AS total_value_kobo
     FROM voucher_redemptions
     WHERE partner_id = ?`,
    [partnerId]
  );
  const row = result.rows[0] as { total_meals: number; total_value_kobo: number } | undefined;
  return {
    totalMeals: row?.total_meals ?? 0,
    totalValueKobo: row?.total_value_kobo ?? 0,
  };
}
