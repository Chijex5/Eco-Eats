import { query, getConnection } from './connection';
import { generateId } from './ids';

export type OtpPurpose = 'PASSWORD_RESET';

export interface AuthOtp {
  id: string;
  user_id: string;
  purpose: OtpPurpose;
  otp_hash: string;
  expires_at: Date;
  consumed_at: Date | null;
  attempts: number;
  created_at: Date;
}

export async function createOtp(data: {
  userId: string;
  purpose: OtpPurpose;
  otpHash: string;
  expiresAt: Date;
}) {
  const id = generateId();
  await query(
    `INSERT INTO auth_otp_codes (id, user_id, purpose, otp_hash, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.userId, data.purpose, data.otpHash, data.expiresAt]
  );
  const result = await query('SELECT * FROM auth_otp_codes WHERE id = ?', [id]);
  return result.rows[0] as AuthOtp;
}

export async function invalidateOtps(userId: string, purpose: OtpPurpose) {
  await query(
    `UPDATE auth_otp_codes
     SET consumed_at = NOW()
     WHERE user_id = ? AND purpose = ? AND consumed_at IS NULL`,
    [userId, purpose]
  );
}

export async function getLatestActiveOtp(userId: string, purpose: OtpPurpose) {
  const result = await query(
    `SELECT * FROM auth_otp_codes
     WHERE user_id = ? AND purpose = ? AND consumed_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId, purpose]
  );
  return result.rows[0] as AuthOtp | undefined;
}

export async function consumeOtp(otpId: string) {
  await query(
    `UPDATE auth_otp_codes
     SET consumed_at = NOW()
     WHERE id = ? AND consumed_at IS NULL`,
    [otpId]
  );
}

export async function incrementOtpAttempts(otpId: string): Promise<number> {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      `UPDATE auth_otp_codes SET attempts = attempts + 1 WHERE id = ?`,
      [otpId]
    );
    const [rows] = await conn.execute(
      `SELECT attempts FROM auth_otp_codes WHERE id = ? FOR UPDATE`,
      [otpId]
    );
    await conn.commit();
    return (rows as { attempts: number }[])[0].attempts;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
