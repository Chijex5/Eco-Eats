/**
 * Support request queries
 * Database operations for support_requests table
 */

import { query } from './connection';
import { generateId } from './ids';
import { logImpactEvent } from './impact';

export interface SupportRequest {
  id: string;
  beneficiary_user_id: string;
  request_type: 'VOUCHER' | 'FOOD_PACK';
  message?: string;
  urgency: 'LOW' | 'MED' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'FULFILLED';
  reviewed_by?: string;
  reviewed_at?: Date;
  created_at: Date;
}

export interface AdminSupportRequest extends SupportRequest {
  full_name: string;
  email: string;
}

/**
 * Create a support request
 */
export async function createSupportRequest(data: {
  beneficiary_user_id: string;
  request_type: 'VOUCHER' | 'FOOD_PACK';
  message?: string;
  urgency: 'LOW' | 'MED' | 'HIGH';
}) {
  const id = generateId();
  await query(
    `INSERT INTO support_requests (id, beneficiary_user_id, request_type, message, urgency)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.beneficiary_user_id, data.request_type, data.message, data.urgency]
  );
  const result = await query('SELECT * FROM support_requests WHERE id = ?', [id]);
  return result.rows[0] as SupportRequest;
}

/**
 * Create a support request (API-friendly signature)
 */
export async function createRequest(data: {
  beneficiaryUserId: string;
  requestType: SupportRequest['request_type'];
  message?: string;
  urgency: SupportRequest['urgency'];
}) {
  return createSupportRequest({
    beneficiary_user_id: data.beneficiaryUserId,
    request_type: data.requestType,
    message: data.message,
    urgency: data.urgency,
  });
}

/**
 * Get requests by beneficiary
 */
export async function getRequestsByBeneficiary(userId: string) {
  const result = await query(
    'SELECT * FROM support_requests WHERE beneficiary_user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return result.rows as SupportRequest[];
}

/**
 * Get request by ID
 */
export async function getSupportRequestById(requestId: string) {
  const result = await query(
    'SELECT * FROM support_requests WHERE id = ?',
    [requestId]
  );
  return result.rows[0] as SupportRequest | undefined;
}

/**
 * Mark request as fulfilled
 */
export async function markRequestFulfilled(requestId: string, reviewedBy: string) {
  await query(
    `UPDATE support_requests 
     SET status = 'FULFILLED', reviewed_by = ?, reviewed_at = NOW()
     WHERE id = ?`,
    [reviewedBy, requestId]
  );
  const result = await query('SELECT * FROM support_requests WHERE id = ?', [requestId]);
  return result.rows[0] as SupportRequest;
}

/**
 * Get pending requests (for admin)
 */
export async function getPendingRequests() {
  const result = await query(
    `SELECT sr.*, u.full_name, u.email 
     FROM support_requests sr
     JOIN users u ON sr.beneficiary_user_id = u.id
     WHERE sr.status = 'PENDING'
     ORDER BY sr.created_at ASC`
  );
  return result.rows;
}

/**
 * Get admin requests, optionally filtered by status
 */
export async function getAdminRequests(status?: SupportRequest['status']) {
  const filters: string[] = [];
  const values: Array<string> = [];

  if (status) {
    filters.push('sr.status = ?');
    values.push(status);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  const result = await query(
    `SELECT sr.*, u.full_name, u.email
     FROM support_requests sr
     JOIN users u ON sr.beneficiary_user_id = u.id
     ${whereClause}
     ORDER BY sr.created_at DESC`,
    values
  );
  return result.rows as AdminSupportRequest[];
}

/**
 * Update request status
 */
export async function updateRequestStatus(
  requestId: string,
  status: SupportRequest['status'],
  reviewedBy: string
) {
  await query(
    `UPDATE support_requests 
     SET status = ?, reviewed_by = ?, reviewed_at = NOW()
     WHERE id = ?`,
    [status, reviewedBy, requestId]
  );
  if (status === 'APPROVED') {
    await logImpactEvent({ eventType: 'REQUEST_APPROVED', relatedId: requestId });
  }
  const result = await query('SELECT * FROM support_requests WHERE id = ?', [requestId]);
  return result.rows[0] as SupportRequest;
}
