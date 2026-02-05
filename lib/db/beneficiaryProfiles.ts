import { query } from './connection';

export type BeneficiaryProfile = {
  user_id: string;
  affiliation: 'STUDENT' | 'STAFF' | 'COMMUNITY';
  location_text: string;
  need_level: 'LOW' | 'MED' | 'HIGH';
  verified_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  created_at: Date;
};

export async function getBeneficiaryProfile(userId: string) {
  const result = await query('SELECT * FROM beneficiary_profiles WHERE user_id = ?', [userId]);
  return result.rows[0] as BeneficiaryProfile | undefined;
}

export async function hasBeneficiaryProfile(userId: string) {
  const result = await query('SELECT user_id FROM beneficiary_profiles WHERE user_id = ? LIMIT 1', [userId]);
  return result.rows.length > 0;
}

export async function upsertBeneficiaryProfile(
  userId: string,
  data: Pick<BeneficiaryProfile, 'affiliation' | 'location_text' | 'need_level'>
) {
  await query(
    `INSERT INTO beneficiary_profiles (user_id, affiliation, location_text, need_level)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       affiliation = VALUES(affiliation),
       location_text = VALUES(location_text),
       need_level = VALUES(need_level)`,
    [userId, data.affiliation, data.location_text, data.need_level]
  );
  return getBeneficiaryProfile(userId);
}
