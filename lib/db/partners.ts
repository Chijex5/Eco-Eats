/**
 * Partner queries
 * Database operations for food_partners and partner_staff tables
 */

import { query } from './connection';
import { generateId } from './ids';
import { logImpactEvent } from './impact';
import type { RowDataPacket } from 'mysql2/promise';

export type PartnerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface Partner {
  id: string;
  owner_user_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  location_text?: string;
  lat?: number | null;
  lng?: number | null;
  status: PartnerStatus;
  opening_hours_json?: Record<string, unknown> | null;
  created_at: Date;
}

export interface PartnerStats {
  activeSurplus: number;
  pendingPickups: number;
  redeemedVouchers: number;
  staffCount: number;
}

export interface PartnerStaffMember {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  staff_role?: string | null;
  can_redeem: number;
  can_post_surplus: number;
  created_at: Date;
}

export async function createPartner(data: {
  owner_user_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  location_text?: string;
  lat?: number | null;
  lng?: number | null;
  opening_hours_json?: Record<string, unknown> | null;
}) {
  const id = generateId();
  await query(
    `INSERT INTO food_partners
      (id, owner_user_id, name, description, logo_url, location_text, lat, lng, opening_hours_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    [
      id,
      data.owner_user_id,
      data.name,
      data.description ?? null,
      data.logo_url ?? null,
      data.location_text ?? null,
      data.lat ?? null,
      data.lng ?? null,
      data.opening_hours_json ? JSON.stringify(data.opening_hours_json) : null,
    ]
  );
  await logImpactEvent({ eventType: 'PARTNER_JOINED', relatedId: id });
  const result = await query('SELECT * FROM food_partners WHERE id = ?', [id]);
  return result.rows[0] as Partner;
}

export async function updatePartner(
  id: string,
  updates: Partial<{
    name: string;
    description: string | null;
    logo_url: string | null;
    location_text: string | null;
    lat: number | null;
    lng: number | null;
    status: PartnerStatus;
    opening_hours_json: Record<string, unknown> | null;
  }>
) {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];

  const addField = (key: string, value: string | number | null) => {
    fields.push(`${key} = ?`);
    values.push(value);
  };

  if (updates.name !== undefined) addField('name', updates.name);
  if (updates.description !== undefined) addField('description', updates.description);
  if (updates.logo_url !== undefined) addField('logo_url', updates.logo_url);
  if (updates.location_text !== undefined) addField('location_text', updates.location_text);
  if (updates.lat !== undefined) addField('lat', updates.lat);
  if (updates.lng !== undefined) addField('lng', updates.lng);
  if (updates.status !== undefined) addField('status', updates.status);
  if (updates.opening_hours_json !== undefined) {
    addField(
      'opening_hours_json',
      updates.opening_hours_json ? JSON.stringify(updates.opening_hours_json) : null
    );
  }

  if (!fields.length) {
    const result = await query('SELECT * FROM food_partners WHERE id = ?', [id]);
    return result.rows[0] as Partner | undefined;
  }

  await query(`UPDATE food_partners SET ${fields.join(', ')} WHERE id = ?`, [...values, id]);
  const result = await query('SELECT * FROM food_partners WHERE id = ?', [id]);
  return result.rows[0] as Partner | undefined;
}

export async function getPartnerByOwnerUserId(userId: string) {
  const result = await query('SELECT * FROM food_partners WHERE owner_user_id = ? LIMIT 1', [userId]);
  return result.rows[0] as Partner | undefined;
}

export async function getPartnerById(id: string) {
  const result = await query('SELECT * FROM food_partners WHERE id = ? LIMIT 1', [id]);
  return result.rows[0] as Partner | undefined;
}

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
  const boundedWindowDays = Math.max(1, Math.floor(windowDays));
  const boundedLimit = Math.max(1, Math.floor(limit));

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
      AND vr.created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL ${boundedWindowDays} DAY)
     LEFT JOIN surplus_listings sl
       ON sl.partner_id = fp.id
      AND sl.created_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL ${boundedWindowDays} DAY)
     GROUP BY fp.id
     ORDER BY fp.created_at DESC
     LIMIT ${boundedLimit}`
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

export async function getPartnerStats(partnerId: string): Promise<PartnerStats> {
  const surplus = await query<RowDataPacket>(
    `SELECT COUNT(*) AS count
     FROM surplus_listings
     WHERE partner_id = ? AND status = 'ACTIVE'`,
    [partnerId]
  );

  const pendingPickups = await query<RowDataPacket>(
    `SELECT COUNT(*) AS count
     FROM surplus_claims sc
     JOIN surplus_listings sl ON sc.listing_id = sl.id
     WHERE sl.partner_id = ? AND sc.status = 'PENDING'`,
    [partnerId]
  );

  const redemptions = await query<RowDataPacket>(
    'SELECT COUNT(*) AS count FROM voucher_redemptions WHERE partner_id = ?',
    [partnerId]
  );

  const staffCount = await query<RowDataPacket>(
    'SELECT COUNT(*) AS count FROM partner_staff WHERE partner_id = ?',
    [partnerId]
  );

  return {
    activeSurplus: Number(surplus.rows[0]?.count ?? 0),
    pendingPickups: Number(pendingPickups.rows[0]?.count ?? 0),
    redeemedVouchers: Number(redemptions.rows[0]?.count ?? 0),
    staffCount: Number(staffCount.rows[0]?.count ?? 0),
  };
}

export async function getPartnerRecentRedemptions(partnerId: string, limit = 5) {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 5;

  const result = await query(
    `SELECT vr.id, vr.redeemed_at, vr.meal_description, vr.value_kobo, v.code AS voucher_code
     FROM voucher_redemptions vr
     LEFT JOIN vouchers v ON vr.voucher_id = v.id
     WHERE vr.partner_id = ?
     ORDER BY vr.redeemed_at DESC
     LIMIT ${safeLimit}`,
    [partnerId]
  );

  return result.rows as Array<{
    id: string;
    redeemed_at: Date;
    meal_description?: string | null;
    value_kobo: number;
    voucher_code?: string | null;
  }>;
}

export async function getPartnerRecentPickups(partnerId: string, limit = 5) {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 5;

  const result = await query(
    `SELECT sc.id,
            sc.pickup_code,
            sc.status,
            sc.created_at,
            sl.title,
            sl.pickup_deadline,
            u.full_name AS beneficiary_name,
            u.email AS beneficiary_email
     FROM surplus_claims sc
     JOIN surplus_listings sl ON sc.listing_id = sl.id
     LEFT JOIN users u ON sc.beneficiary_user_id = u.id
     WHERE sl.partner_id = ?
     ORDER BY sc.created_at DESC
     LIMIT ${safeLimit}`,
    [partnerId]
  );

  return result.rows as Array<{
    id: string;
    pickup_code: string;
    status: string;
    created_at: Date;
    title: string;
    pickup_deadline: Date;
    beneficiary_name?: string | null;
    beneficiary_email?: string | null;
  }>;
}

export async function getPartnerStaff(partnerId: string) {
  const result = await query(
    `SELECT ps.id, ps.user_id, ps.staff_role, ps.can_redeem, ps.can_post_surplus,
            ps.created_at, u.full_name, u.email
     FROM partner_staff ps
     JOIN users u ON ps.user_id = u.id
     WHERE ps.partner_id = ?
     ORDER BY ps.created_at DESC`,
    [partnerId]
  );

  return result.rows as PartnerStaffMember[];
}


export async function addPartnerStaffMember(data: {
  partner_id: string;
  user_id: string;
  staff_role?: string | null;
  can_redeem?: boolean;
  can_post_surplus?: boolean;
}) {
  const id = generateId();
  await query(
    `INSERT INTO partner_staff (id, partner_id, user_id, staff_role, can_redeem, can_post_surplus)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.partner_id,
      data.user_id,
      data.staff_role ?? null,
      data.can_redeem ?? true,
      data.can_post_surplus ?? false,
    ]
  );

  const result = await query(
    `SELECT ps.id, ps.user_id, ps.staff_role, ps.can_redeem, ps.can_post_surplus,
            ps.created_at, u.full_name, u.email
     FROM partner_staff ps
     JOIN users u ON ps.user_id = u.id
     WHERE ps.id = ?
     LIMIT 1`,
    [id]
  );

  return result.rows[0] as PartnerStaffMember;
}
