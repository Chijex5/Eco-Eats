import { query } from './connection';
import type { RowDataPacket } from 'mysql2/promise';

export type AdminDashboardSummary = {
  pendingRequests: number;
  vouchersIssued: number;
  mealsServed: number;
  activePartners: number;
};

export type ImpactActivity = {
  id: string;
  event_type: string;
  related_id?: string | null;
  count: number;
  created_at: Date;
};

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const requestCounts = await query<RowDataPacket>(
    `SELECT SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pending
     FROM support_requests`
  );

  const voucherCounts = await query<RowDataPacket>(
    `SELECT COUNT(*) AS issued
     FROM vouchers`
  );

  const mealCounts = await query<RowDataPacket>(
    `SELECT SUM(count) AS served
     FROM impact_events
     WHERE event_type = 'MEAL_SERVED'`
  );

  const partnerCounts = await query<RowDataPacket>(
    `SELECT SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) AS active
     FROM food_partners`
  );

  const pending = Number(requestCounts.rows[0]?.pending ?? 0);
  const issued = Number(voucherCounts.rows[0]?.issued ?? 0);
  const served = Number(mealCounts.rows[0]?.served ?? 0);
  const activePartners = Number(partnerCounts.rows[0]?.active ?? 0);

  return {
    pendingRequests: pending,
    vouchersIssued: issued,
    mealsServed: served,
    activePartners,
  };
}

export async function getRecentImpactActivity(limit = 6): Promise<ImpactActivity[]> {
  const result = await query<RowDataPacket>(
    `SELECT id, event_type, related_id, count, created_at
     FROM impact_events
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit]
  );

  return result.rows as ImpactActivity[];
}
