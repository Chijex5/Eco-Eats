import { query } from './connection';
import type { RowDataPacket } from 'mysql2/promise';

export type AdminPartnerSummary = {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  rejected: number;
};

export type AdminPartnerOverview = {
  id: string;
  name: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  redemptions_last_7_days: number;
  surplus_listings_last_7_days: number;
  created_at: Date;
};

export async function getAdminPartnerOverview({
  limit = 6,
  windowDays = 7,
}: {
  limit?: number;
  windowDays?: number;
} = {}) {
  const partners = await query<RowDataPacket>(
    `SELECT fp.id,
            fp.name,
            fp.status,
            fp.created_at,
            COUNT(DISTINCT vr.id) AS redemptions_last_7_days,
            COUNT(DISTINCT sl.id) AS surplus_listings_last_7_days
     FROM food_partners fp
     LEFT JOIN voucher_redemptions vr
       ON vr.partner_id = fp.id
      AND vr.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     LEFT JOIN surplus_listings sl
       ON sl.partner_id = fp.id
      AND sl.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY fp.id
     ORDER BY fp.created_at DESC
     LIMIT ?`,
    [windowDays, windowDays, limit]
  );

  const summary = await query<RowDataPacket>(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) AS active,
            SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pending,
            SUM(CASE WHEN status = 'SUSPENDED' THEN 1 ELSE 0 END) AS suspended,
            SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) AS rejected
     FROM food_partners`
  );

  return {
    partners: partners.rows as AdminPartnerOverview[],
    summary: {
      total: Number(summary.rows[0]?.total ?? 0),
      active: Number(summary.rows[0]?.active ?? 0),
      pending: Number(summary.rows[0]?.pending ?? 0),
      suspended: Number(summary.rows[0]?.suspended ?? 0),
      rejected: Number(summary.rows[0]?.rejected ?? 0),
    },
  };
}
