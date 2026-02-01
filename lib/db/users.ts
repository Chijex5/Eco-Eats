/**
 * User queries
 * Database operations for users table
 */

import { query } from './connection';

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
  const result = await query(
    `INSERT INTO users (full_name, email, password_hash, role, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.full_name, data.email, data.password_hash, data.role, data.phone]
  );
  return result.rows[0] as User;
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] as User | undefined;
}

/**
 * Find user by ID
 */
export async function findUserById(id: string) {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] as User | undefined;
}

/**
 * Update user email verification status
 */
export async function verifyUserEmail(userId: string) {
  const result = await query(
    `UPDATE users 
     SET is_email_verified = TRUE, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [userId]
  );
  return result.rows[0] as User;
}

/**
 * Update user profile
 */
export async function updateUser(userId: string, data: Partial<User>) {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'id' && value !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  fields.push(`updated_at = NOW()`);
  values.push(userId);

  const result = await query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );
  return result.rows[0] as User;
}
