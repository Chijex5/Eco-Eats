/**
 * User queries
 * Database operations for users table
 */

import { query } from './connection';
import { generateId } from './ids';

function isMissingMustChangePasswordColumn(error: unknown) {
  return (
    (error as { code?: string })?.code === 'ER_BAD_FIELD_ERROR' &&
    String((error as { sqlMessage?: string })?.sqlMessage ?? '').includes('must_change_password')
  );
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: 'BENEFICIARY' | 'DONOR' | 'PARTNER_OWNER' | 'PARTNER_STAFF' | 'VOLUNTEER' | 'ADMIN';
  must_change_password: boolean;
  is_email_verified: boolean;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

export type PublicUser = Pick<User, 'id' | 'full_name' | 'email' | 'role' | 'is_email_verified' | 'created_at' | 'updated_at'>;
export type UserRoleCount = Pick<User, 'role'> & { total: number };

/**
 * Create a new user
 */
export async function createUser(data: {
  full_name: string;
  email: string;
  password_hash: string;
  role: User['role'];
  phone?: string;
  must_change_password?: boolean;
}) {
  const id = generateId();
  try {
    await query(
      `INSERT INTO users (id, full_name, email, password_hash, role, must_change_password, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.full_name,
        data.email,
        data.password_hash,
        data.role,
        data.must_change_password ?? false,
        data.phone ?? null,
      ]
    );
  } catch (error) {
    if (!isMissingMustChangePasswordColumn(error)) {
      throw error;
    }

    await query(
      `INSERT INTO users (id, full_name, email, password_hash, role, phone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.full_name,
        data.email,
        data.password_hash,
        data.role,
        data.phone ?? null,
      ]
    );
  }
  const result = await query('SELECT * FROM users WHERE id = ?', [id]);
  return result.rows[0] as User;
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
  const result = await query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return result.rows[0] as User | undefined;
}

/**
 * Find user by ID
 */
export async function findUserById(id: string) {
  const result = await query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return result.rows[0] as User | undefined;
}

/**
 * List users by role
 */
export async function listUsersByRole(role: User['role']) {
  const result = await query(
    `SELECT id, full_name, email, role, is_email_verified, created_at, updated_at
     FROM users
     WHERE role = ?
     ORDER BY created_at DESC`,
    [role]
  );
  return result.rows as PublicUser[];
}

/**
 * List all users for admin reporting
 */
export async function listUsersForAdmin() {
  const result = await query(
    `SELECT id, full_name, email, role, is_email_verified, created_at, updated_at
     FROM users
     ORDER BY created_at DESC`
  );
  return result.rows as PublicUser[];
}

/**
 * Count users grouped by role
 */
export async function countUsersByRole() {
  const result = await query(
    `SELECT role, COUNT(*) AS total
     FROM users
     GROUP BY role
     ORDER BY total DESC, role ASC`
  );

  return (result.rows as Array<{ role: User['role']; total: number | string }>).map((row) => ({
    role: row.role,
    total: Number(row.total),
  })) as UserRoleCount[];
}

/**
 * Update user email verification status
 */
export async function verifyUserEmail(userId: string) {
  await query(
    `UPDATE users 
     SET is_email_verified = TRUE, updated_at = NOW()
     WHERE id = ?`,
    [userId]
  );
  const result = await query('SELECT * FROM users WHERE id = ?', [userId]);
  return result.rows[0] as User;
}

/**
 * Update user profile
 */
export async function updateUser(userId: string, data: Partial<User>) {
  const fields: string[] = [];
  const values: Array<string | number | boolean | Date | null> = [];

  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'id' && value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  fields.push(`updated_at = NOW()`);
  values.push(userId);

  await query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  const result = await query('SELECT * FROM users WHERE id = ?', [userId]);
  return result.rows[0] as User;
}

export async function updateUserPassword(userId: string, passwordHash: string, clearMustChangePassword = true) {
  try {
    await query(
      `UPDATE users
       SET password_hash = ?,
           must_change_password = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [passwordHash, clearMustChangePassword ? false : true, userId]
    );
  } catch (error) {
    if (!isMissingMustChangePasswordColumn(error)) {
      throw error;
    }

    await query(
      `UPDATE users
       SET password_hash = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [passwordHash, userId]
    );
  }

  const result = await query('SELECT * FROM users WHERE id = ?', [userId]);
  return result.rows[0] as User;
}
