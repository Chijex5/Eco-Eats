/**
 * User queries
 * Database operations for users table
 */

import { query } from './connection';
import { generateId } from './ids';

export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: 'BENEFICIARY' | 'DONOR' | 'PARTNER_OWNER' | 'PARTNER_STAFF' | 'VOLUNTEER' | 'ADMIN';
  is_email_verified: boolean;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create a new user
 */
export async function createUser(data: {
  full_name: string;
  email: string;
  password_hash: string;
  role: User['role'];
  phone?: string;
}) {
  const id = generateId();
  await query(
    `INSERT INTO users (id, full_name, email, password_hash, role, phone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, data.full_name, data.email, data.password_hash, data.role, data.phone]
  );
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
  const values: any[] = [];

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
