/**
 * Redemption helpers
 * Database operations for voucher_redemptions and partner lookups
 */

import { query } from './connection';

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
