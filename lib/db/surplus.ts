/**
 * Surplus listings and pickup confirmations
 */

import { query, getConnection } from './connection';
import { generateId } from './ids';
import { logImpactEvent } from './impact';
import type { RowDataPacket } from 'mysql2/promise';

export interface SurplusListing {
  id: string;
  partner_id: string;
  title: string;
  description?: string | null;
  quantity_available: number;
  claim_limit_per_user: number;
  pickup_deadline: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'COMPLETED';
  created_at: Date;
}

export interface SurplusClaim {
  id: string;
  listing_id: string;
  beneficiary_user_id: string;
  status: 'PENDING' | 'PICKED_UP' | 'CANCELLED';
  pickup_code: string;
  confirmed_by_staff_id?: string | null;
  created_at: Date;
}

export type BeneficiarySurplusClaim = SurplusClaim & {
  title: string;
  partner_name?: string | null;
  pickup_deadline: Date;
};

const generatePickupCode = () =>
  `PK${Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(2, 8)}`;

export async function getAvailableSurplusListings(limit = 12) {
  const parsedLimit = Number.isFinite(limit) ? Math.trunc(limit) : 12;
  const safeLimit = Math.min(Math.max(parsedLimit, 1), 100);

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
     LIMIT ${safeLimit}`
  );

  return result.rows as SurplusListing[];
}

export async function getBeneficiarySurplusClaims(userId: string) {
  const result = await query<RowDataPacket>(
    `SELECT sc.*,
            sl.title,
            sl.pickup_deadline,
            fp.name AS partner_name
     FROM surplus_claims sc
     JOIN surplus_listings sl ON sc.listing_id = sl.id
     LEFT JOIN food_partners fp ON sl.partner_id = fp.id
     WHERE sc.beneficiary_user_id = ?
       AND sc.status IN ('PENDING', 'PICKED_UP')
     ORDER BY sc.created_at DESC`,
    [userId]
  );

  return result.rows as BeneficiarySurplusClaim[];
}

export async function claimSurplusListing(listingId: string, userId: string) {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const [listingRows] = await connection.execute<RowDataPacket[]>(
      `SELECT id, quantity_available, claim_limit_per_user, pickup_deadline, status
       FROM surplus_listings
       WHERE id = ?
       FOR UPDATE`,
      [listingId]
    );

    const listing = listingRows[0] as {
      id: string;
      quantity_available: number;
      claim_limit_per_user: number;
      pickup_deadline: Date;
      status: 'ACTIVE' | 'EXPIRED' | 'COMPLETED';
    } | undefined;

    if (!listing) {
      throw new Error('Listing not found.');
    }

    if (listing.status !== 'ACTIVE') {
      throw new Error('Listing is no longer active.');
    }

    if (new Date(listing.pickup_deadline) < new Date()) {
      throw new Error('Pickup deadline has passed.');
    }

    const [claimedRows] = await connection.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS count
       FROM surplus_claims
       WHERE listing_id = ?
         AND status != 'CANCELLED'`,
      [listingId]
    );

    const claimedCount = Number(claimedRows[0]?.count ?? 0);
    if (claimedCount >= listing.quantity_available) {
      throw new Error('No slots remaining for this listing.');
    }

    const [userClaimsRows] = await connection.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS count
       FROM surplus_claims
       WHERE listing_id = ?
         AND beneficiary_user_id = ?
         AND status != 'CANCELLED'`,
      [listingId, userId]
    );

    const userClaimCount = Number(userClaimsRows[0]?.count ?? 0);
    if (userClaimCount >= listing.claim_limit_per_user) {
      throw new Error('You have reached the claim limit for this listing.');
    }

    const claimId = generateId();
    const pickupCode = generatePickupCode();

    await connection.execute(
      `INSERT INTO surplus_claims
        (id, listing_id, beneficiary_user_id, status, pickup_code)
       VALUES (?, ?, ?, 'PENDING', ?)`,
      [claimId, listingId, userId, pickupCode]
    );

    await logImpactEvent({
      eventType: 'PACK_CLAIMED',
      relatedId: claimId,
      connection,
    });

    const [createdRows] = await connection.execute<RowDataPacket[]>(
      `SELECT sc.*, sl.title, sl.pickup_deadline, fp.name AS partner_name
       FROM surplus_claims sc
       JOIN surplus_listings sl ON sc.listing_id = sl.id
       LEFT JOIN food_partners fp ON sl.partner_id = fp.id
       WHERE sc.id = ?`,
      [claimId]
    );

    await connection.commit();

    return createdRows[0] as BeneficiarySurplusClaim;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function createSurplusListing(data: {
  partner_id: string;
  title: string;
  description?: string;
  quantity_available: number;
  claim_limit_per_user?: number;
  pickup_deadline: Date;
}) {
  const id = generateId();
  await query(
    `INSERT INTO surplus_listings
      (id, partner_id, title, description, quantity_available, claim_limit_per_user, pickup_deadline)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.partner_id,
      data.title,
      data.description ?? null,
      data.quantity_available,
      data.claim_limit_per_user ?? 1,
      data.pickup_deadline,
    ]
  );

  const result = await query('SELECT * FROM surplus_listings WHERE id = ?', [id]);
  return result.rows[0] as SurplusListing;
}

export async function getPartnerSurplusListings(partnerId: string) {
  const result = await query(
    'SELECT * FROM surplus_listings WHERE partner_id = ? ORDER BY created_at DESC',
    [partnerId]
  );
  return result.rows as SurplusListing[];
}

export async function findSurplusClaimByPickupCode(pickupCode: string) {
  const result = await query(
    `SELECT sc.*, sl.partner_id
     FROM surplus_claims sc
     JOIN surplus_listings sl ON sc.listing_id = sl.id
     WHERE sc.pickup_code = ?
     LIMIT 1`,
    [pickupCode]
  );

  return result.rows[0] as (SurplusClaim & { partner_id: string }) | undefined;
}

export async function redeemSurplusPickup(
  pickupCode: string,
  partnerId: string,
  staffId: string
) {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const [claimRows] = await connection.execute<RowDataPacket[]>(
      `SELECT sc.*, sl.partner_id
       FROM surplus_claims sc
       JOIN surplus_listings sl ON sc.listing_id = sl.id
       WHERE sc.pickup_code = ?
       FOR UPDATE`,
      [pickupCode]
    );

    const claim = claimRows[0] as (SurplusClaim & { partner_id: string }) | undefined;

    if (!claim) {
      throw new Error('Pickup code not found');
    }

    if (claim.partner_id !== partnerId) {
      throw new Error('Pickup code does not match this partner');
    }

    if (claim.status !== 'PENDING') {
      throw new Error(`Pickup is already ${claim.status.toLowerCase()}`);
    }

    await connection.execute(
      'UPDATE surplus_claims SET status = ?, confirmed_by_staff_id = ? WHERE id = ?',
      ['PICKED_UP', staffId, claim.id]
    );

    await logImpactEvent({
      eventType: 'PACK_PICKED_UP',
      relatedId: claim.id,
      connection,
    });

    const [updatedRows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM surplus_claims WHERE id = ?',
      [claim.id]
    );

    await connection.commit();

    return updatedRows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
