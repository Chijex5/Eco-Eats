/**
 * Voucher queries
 * Database operations for vouchers table
 */

import { query } from './connection';

export interface Voucher {
  id: string;
  code: string;
  qr_token: string;
  value_kobo: number;
  beneficiary_user_id?: string;
  issued_by_admin_id?: string;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'REVOKED';
  expires_at?: Date;
  created_at: Date;
}

/**
 * Generate a unique voucher code
 */
function generateVoucherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'EAT-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generate a unique QR token
 */
function generateQRToken(): string {
  return `qr_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Create a voucher
 */
export async function createVoucher(data: {
  value_kobo: number;
  beneficiary_user_id?: string;
  issued_by_admin_id: string;
  expires_at?: Date;
}) {
  const code = generateVoucherCode();
  const qr_token = generateQRToken();
  
  const result = await query(
    `INSERT INTO vouchers (code, qr_token, value_kobo, beneficiary_user_id, issued_by_admin_id, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [code, qr_token, data.value_kobo, data.beneficiary_user_id, data.issued_by_admin_id, data.expires_at]
  );
  return result.rows[0] as Voucher;
}

/**
 * Get vouchers by beneficiary
 */
export async function getVouchersByBeneficiary(userId: string) {
  const result = await query(
    'SELECT * FROM vouchers WHERE beneficiary_user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows as Voucher[];
}

/**
 * Find voucher by code
 */
export async function findVoucherByCode(code: string) {
  const result = await query(
    'SELECT * FROM vouchers WHERE code = $1',
    [code]
  );
  return result.rows[0] as Voucher | undefined;
}

/**
 * Find voucher by QR token
 */
export async function findVoucherByQRToken(qr_token: string) {
  const result = await query(
    'SELECT * FROM vouchers WHERE qr_token = $1',
    [qr_token]
  );
  return result.rows[0] as Voucher | undefined;
}

/**
 * Redeem a voucher
 */
export async function redeemVoucher(
  voucherId: string,
  partnerId: string,
  redeemedByUserId: string,
  confirmedByStaffId: string,
  mealDescription?: string
) {
  // Start transaction
  const client = await query('BEGIN', []);
  
  try {
    // Get voucher
    const voucherResult = await query(
      'SELECT * FROM vouchers WHERE id = $1 FOR UPDATE',
      [voucherId]
    );
    const voucher = voucherResult.rows[0] as Voucher;

    if (!voucher) {
      throw new Error('Voucher not found');
    }

    if (voucher.status !== 'ACTIVE') {
      throw new Error(`Voucher is ${voucher.status.toLowerCase()}`);
    }

    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
      throw new Error('Voucher has expired');
    }

    // Update voucher status
    await query(
      'UPDATE vouchers SET status = $1 WHERE id = $2',
      ['REDEEMED', voucherId]
    );

    // Create redemption record
    const redemptionResult = await query(
      `INSERT INTO voucher_redemptions 
       (voucher_id, partner_id, redeemed_by_user_id, confirmed_by_staff_id, meal_description, value_kobo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [voucherId, partnerId, redeemedByUserId, confirmedByStaffId, mealDescription, voucher.value_kobo]
    );

    // Log impact event
    await query(
      `INSERT INTO impact_events (event_type, related_id)
       VALUES ('MEAL_SERVED', $1)`,
      [redemptionResult.rows[0].id]
    );

    await query('COMMIT', []);
    
    return redemptionResult.rows[0];
  } catch (error) {
    await query('ROLLBACK', []);
    throw error;
  }
}
