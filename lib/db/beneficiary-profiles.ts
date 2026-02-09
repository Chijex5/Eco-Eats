/**
 * Beneficiary profile queries
 * Database operations for beneficiary_profiles table
 */

import { query } from './connection';

export interface BeneficiaryProfile {
  user_id: string;
  affiliation: 'STUDENT' | 'STAFF' | 'COMMUNITY' | null;
  location_text: string | null;
  need_level: 'LOW' | 'MED' | 'HIGH' | null;
  verified_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  created_at: Date;
}

export async function getBeneficiaryProfile(userId: string) {
  const result = await query<BeneficiaryProfile>(
    'SELECT * FROM beneficiary_profiles WHERE user_id = ?',
    [userId]
  );
  return result.rows[0];
}

export async function isBeneficiaryProfileComplete(userId: string) {
  const result = await query<Pick<BeneficiaryProfile, 'affiliation' | 'location_text' | 'need_level'>>(
    'SELECT affiliation, location_text, need_level FROM beneficiary_profiles WHERE user_id = ?',
    [userId]
  );
  const profile = result.rows[0];
  if (!profile) return false;
  return Boolean(profile.affiliation && profile.location_text && profile.need_level);
}
