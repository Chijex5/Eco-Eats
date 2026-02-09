import { query } from './connection';
import type { RowDataPacket } from 'mysql2/promise';

export type SurplusListing = {
  id: string;
  title: string;
  description?: string | null;
  pickup_deadline: Date;
  quantity_available: number;
  claimed_count: number;
  partner_name?: string | null;
};

export async function getAvailableSurplusListings(limit = 12) {
  const result = await query<RowDataPacket>(
    `SELECT sl.id,
            sl.title,
            sl.description,
            sl.pickup_deadline,
            sl.quantity_available,
            COUNT(sc.id) AS claimed_count,
            fp.name AS partner_name
     FROM surplus_listings sl
     LEFT JOIN surplus_claims sc
       ON sc.listing_id = sl.id
      AND sc.status != 'CANCELLED'
     LEFT JOIN food_partners fp
       ON sl.partner_id = fp.id
     WHERE sl.status = 'ACTIVE'
       AND sl.pickup_deadline >= NOW()
     GROUP BY sl.id
     ORDER BY sl.pickup_deadline ASC
     LIMIT ?`,
    [limit]
  );

  return result.rows as SurplusListing[];
}
