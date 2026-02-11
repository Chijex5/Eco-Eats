/**
 * Support request queries
 * Database operations for support_requests table
 */

import { query } from './connection';
import { generateId } from './ids';
import { logImpactEvent } from './impact';
import type { RowDataPacket } from 'mysql2/promise';

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
    [id, data.beneficiary_user_id, data.request_type, data.message ?? null, data.urgency]
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

export type FoodPackClaimEligibility = {
  hasApprovedFoodPack: boolean;
  canClaimSurplus: boolean;
  approvedFoodPackCount: number;
  usedFoodPackCount: number;
};

export async function getFoodPackClaimEligibility(userId: string): Promise<FoodPackClaimEligibility> {
  const [approvedResult, usedResult] = await Promise.all([
    query<RowDataPacket>(
      `SELECT COUNT(*) AS count
       FROM support_requests
       WHERE beneficiary_user_id = ?
         AND request_type = 'FOOD_PACK'
         AND status IN ('APPROVED', 'FULFILLED')`,
      [userId]
    ),
    query<RowDataPacket>(
      `SELECT COUNT(*) AS count
       FROM surplus_claims
       WHERE beneficiary_user_id = ?
         AND status != 'CANCELLED'`,
      [userId]
    ),
  ]);

  const approvedFoodPackCount = Number(approvedResult.rows[0]?.count ?? 0);
  const usedFoodPackCount = Number(usedResult.rows[0]?.count ?? 0);

  return {
    hasApprovedFoodPack: approvedFoodPackCount > 0,
    canClaimSurplus: approvedFoodPackCount > usedFoodPackCount,
    approvedFoodPackCount,
    usedFoodPackCount,
  };
}

export async function hasApprovedFoodPackRequest(userId: string) {
  const eligibility = await getFoodPackClaimEligibility(userId);
  return eligibility.hasApprovedFoodPack;
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
