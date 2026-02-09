/**
 * Voucher queries
 * Database operations for vouchers table
 */

import { query, getConnection } from './connection';
import { generateId } from './ids';
import { generateQRToken, generateVoucherCode } from '@/lib/utils/voucher-codes';
import { logImpactEvent } from './impact';
import type { RowDataPacket } from 'mysql2/promise';

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

export type AdminVoucherSummary = {
  issued: number;
  active: number;
  redeemed: number;
  expiringSoon: number;
};

export async function getAdminVoucherSummary(windowDays = 7): Promise<AdminVoucherSummary> {
  const result = await query<RowDataPacket>(
    `SELECT COUNT(*) AS issued,
            SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS active,
            SUM(CASE WHEN status = 'REDEEMED' THEN 1 ELSE 0 END) AS redeemed,
            SUM(CASE WHEN status = 'ACTIVE'
                      AND expires_at IS NOT NULL
                      AND expires_at <= DATE_ADD(NOW(), INTERVAL ? DAY)
                     THEN 1 ELSE 0 END) AS expiringSoon
     FROM vouchers`,
    [windowDays]
  );

  const row = result.rows[0] ?? {};
  return {
    issued: Number(row.issued ?? 0),
    active: Number(row.active ?? 0),
    redeemed: Number(row.redeemed ?? 0),
    expiringSoon: Number(row.expiringSoon ?? 0),
  };
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
  const id = generateId();
  
  await query(
    `INSERT INTO vouchers (id, code, qr_token, value_kobo, beneficiary_user_id, issued_by_admin_id, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, code, qr_token, data.value_kobo, data.beneficiary_user_id, data.issued_by_admin_id, data.expires_at]
  );
  await logImpactEvent({ eventType: 'MEAL_FUNDED', relatedId: id });
  const result = await query('SELECT * FROM vouchers WHERE id = ?', [id]);
  return result.rows[0] as Voucher;
}

/**
 * Get vouchers by beneficiary
 */
export async function getVouchersByBeneficiary(userId: string) {
  const result = await query(
    'SELECT * FROM vouchers WHERE beneficiary_user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return result.rows as Voucher[];
}

/**
 * Get non-revoked vouchers for a beneficiary
 */
export async function getUserVouchers(userId: string) {
  const result = await query(
    "SELECT * FROM vouchers WHERE beneficiary_user_id = ? AND status != 'REVOKED' ORDER BY created_at DESC",
    [userId]
  );
  return result.rows as Voucher[];
}

/**
 * Find voucher by code
 */
export async function findVoucherByCode(code: string) {
  const result = await query(
    'SELECT * FROM vouchers WHERE code = ?',
    [code]
  );
  return result.rows[0] as Voucher | undefined;
}

/**
 * Find voucher by QR token
 */
export async function findVoucherByQRToken(qr_token: string) {
  const result = await query(
    'SELECT * FROM vouchers WHERE qr_token = ?',
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
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Get voucher
    const [voucherRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM vouchers WHERE id = ? FOR UPDATE',
      [voucherId]
    );
    const voucher = voucherRows[0] as Voucher | undefined;

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
    await connection.execute(
      'UPDATE vouchers SET status = ? WHERE id = ?',
      ['REDEEMED', voucherId]
    );

    // Create redemption record
    const redemptionId = generateId();
    await connection.execute(
      `INSERT INTO voucher_redemptions 
       (id, voucher_id, partner_id, redeemed_by_user_id, confirmed_by_staff_id, meal_description, value_kobo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [redemptionId, voucherId, partnerId, redeemedByUserId, confirmedByStaffId, mealDescription, voucher.value_kobo]
    );

    await logImpactEvent({
      eventType: 'MEAL_SERVED',
      relatedId: redemptionId,
      connection,
    });

    const [redemptionRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM voucher_redemptions WHERE id = ?',
      [redemptionId]
    );

    await connection.commit();

    return redemptionRows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
