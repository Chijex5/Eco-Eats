/**
 * Impact event queries
 * Database operations for impact_events table
 */

import { query } from './connection';
import { generateId } from './ids';
import type { PoolConnection, RowDataPacket } from 'mysql2/promise';

export type ImpactEventType =
  | 'MEAL_FUNDED'
  | 'MEAL_SERVED'
  | 'PACK_CLAIMED'
  | 'PACK_PICKED_UP'
  | 'REQUEST_APPROVED'
  | 'PARTNER_JOINED';

export type ImpactSummary = {
  requests: {
    total: number;
    approved: number;
    declined: number;
    pending: number;
    fulfilled: number;
  };
  vouchers: {
    issued: number;
    redeemed: number;
    active: number;
    expired: number;
    revoked: number;
  };
  meals: {
    funded: number;
    served: number;
  };
  surplus: {
    claimed: number;
    pickedUp: number;
  };
  partners: {
    joined: number;
  };
};

export async function logImpactEvent({
  eventType,
  relatedId,
  count = 1,
  connection,
}: {
  eventType: ImpactEventType;
  relatedId?: string;
  count?: number;
  connection?: PoolConnection;
}) {
  const id = generateId();
  const sql = `INSERT INTO impact_events (id, event_type, related_id, count) VALUES (?, ?, ?, ?)`;
  const params = [id, eventType, relatedId ?? null, count];

  if (connection) {
    await connection.execute(sql, params);
    return { id };
  }

  await query(sql, params);
  return { id };
}

export async function getImpactSummary(): Promise<ImpactSummary> {
  const requestCounts = await query<RowDataPacket>(
    `SELECT COUNT(*) AS total,
        SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN status = 'DECLINED' THEN 1 ELSE 0 END) AS declined,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'FULFILLED' THEN 1 ELSE 0 END) AS fulfilled
     FROM support_requests`
  );

  const voucherCounts = await query<RowDataPacket>(
    `SELECT COUNT(*) AS issued,
        SUM(CASE WHEN status = 'REDEEMED' THEN 1 ELSE 0 END) AS redeemed,
        SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN status = 'EXPIRED' THEN 1 ELSE 0 END) AS expired,
        SUM(CASE WHEN status = 'REVOKED' THEN 1 ELSE 0 END) AS revoked
     FROM vouchers`
  );

  const surplusCounts = await query<RowDataPacket>(
    `SELECT COUNT(*) AS claimed,
        SUM(CASE WHEN status = 'PICKED_UP' THEN 1 ELSE 0 END) AS picked_up
     FROM surplus_claims`
  );

  const impactCounts = await query<RowDataPacket>(
    `SELECT event_type, SUM(count) AS total
     FROM impact_events
     GROUP BY event_type`
  );

  const impactTotals = impactCounts.rows.reduce<Record<string, number>>((acc, row) => {
    acc[String(row.event_type)] = Number(row.total ?? 0);
    return acc;
  }, {});

  const requests = requestCounts.rows[0] ?? {};
  const vouchers = voucherCounts.rows[0] ?? {};
  const surplus = surplusCounts.rows[0] ?? {};

  return {
    requests: {
      total: Number(requests.total ?? 0),
      approved: Number(requests.approved ?? 0),
      declined: Number(requests.declined ?? 0),
      pending: Number(requests.pending ?? 0),
      fulfilled: Number(requests.fulfilled ?? 0),
    },
    vouchers: {
      issued: Number(vouchers.issued ?? 0),
      redeemed: Number(vouchers.redeemed ?? 0),
      active: Number(vouchers.active ?? 0),
      expired: Number(vouchers.expired ?? 0),
      revoked: Number(vouchers.revoked ?? 0),
    },
    meals: {
      funded: Number(impactTotals.MEAL_FUNDED ?? 0),
      served: Number(impactTotals.MEAL_SERVED ?? 0),
    },
    surplus: {
      claimed: Number(impactTotals.PACK_CLAIMED ?? surplus.claimed ?? 0),
      pickedUp: Number(impactTotals.PACK_PICKED_UP ?? surplus.picked_up ?? 0),
    },
    partners: {
      joined: Number(impactTotals.PARTNER_JOINED ?? 0),
    },
  };
}
