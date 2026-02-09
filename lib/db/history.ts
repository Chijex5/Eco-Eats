import { query } from './connection';
import type { RowDataPacket } from 'mysql2/promise';

export type BeneficiaryHistoryItem = {
  id: string;
  title: string;
  detail: string;
  occurred_at: Date;
};

const requestTypeLabel = (type: string) => (type === 'FOOD_PACK' ? 'Food pack' : 'Voucher');

export async function getBeneficiaryHistory(userId: string, limit = 12) {
  const requests = await query<RowDataPacket>(
    `SELECT id, request_type, status, created_at, reviewed_at
     FROM support_requests
     WHERE beneficiary_user_id = ?`,
    [userId]
  );

  const vouchers = await query<RowDataPacket>(
    `SELECT id, code, status, created_at
     FROM vouchers
     WHERE beneficiary_user_id = ?`,
    [userId]
  );

  const redemptions = await query<RowDataPacket>(
    `SELECT vr.id,
            vr.created_at,
            vr.meal_description,
            v.code AS voucher_code,
            fp.name AS partner_name
     FROM voucher_redemptions vr
     JOIN vouchers v ON vr.voucher_id = v.id
     LEFT JOIN food_partners fp ON vr.partner_id = fp.id
     WHERE vr.redeemed_by_user_id = ?`,
    [userId]
  );

  const surplusClaims = await query<RowDataPacket>(
    `SELECT sc.id,
            sc.status,
            sc.pickup_code,
            sc.created_at,
            sl.title AS listing_title,
            fp.name AS partner_name
     FROM surplus_claims sc
     JOIN surplus_listings sl ON sc.listing_id = sl.id
     LEFT JOIN food_partners fp ON sl.partner_id = fp.id
     WHERE sc.beneficiary_user_id = ?`,
    [userId]
  );

  const items: BeneficiaryHistoryItem[] = [];

  for (const row of requests.rows) {
    const requestId = String(row.id);
    const requestType = requestTypeLabel(String(row.request_type));
    const createdAt = new Date(row.created_at);
    items.push({
      id: `request-${requestId}-created`,
      title: 'Support request submitted',
      detail: `${requestType} request`,
      occurred_at: createdAt,
    });

    if (row.reviewed_at) {
      const status = String(row.status);
      const statusLabel = status === 'APPROVED'
        ? 'Support request approved'
        : status === 'DECLINED'
          ? 'Support request declined'
          : status === 'FULFILLED'
            ? 'Support request fulfilled'
            : 'Support request updated';

      items.push({
        id: `request-${requestId}-reviewed`,
        title: statusLabel,
        detail: `Request ID ${requestId.slice(0, 8).toUpperCase()}`,
        occurred_at: new Date(row.reviewed_at),
      });
    }
  }

  for (const row of vouchers.rows) {
    const voucherCode = String(row.code);
    items.push({
      id: `voucher-${row.id}-issued`,
      title: 'Voucher issued',
      detail: `Code ${voucherCode}`,
      occurred_at: new Date(row.created_at),
    });
  }

  for (const row of redemptions.rows) {
    const partnerName = row.partner_name ? ` at ${row.partner_name}` : '';
    const description = row.meal_description ? ` · ${row.meal_description}` : '';
    items.push({
      id: `redemption-${row.id}`,
      title: `Voucher redeemed${partnerName}`,
      detail: `Code ${row.voucher_code}${description}`,
      occurred_at: new Date(row.created_at),
    });
  }

  for (const row of surplusClaims.rows) {
    const partnerName = row.partner_name ? ` at ${row.partner_name}` : '';
    const status = String(row.status);
    const statusLabel = status === 'PICKED_UP'
      ? 'Surplus pack picked up'
      : status === 'CANCELLED'
        ? 'Surplus pack cancelled'
        : 'Surplus pack claimed';
    items.push({
      id: `surplus-${row.id}`,
      title: `${statusLabel}${partnerName}`,
      detail: `${row.listing_title ?? 'Surplus pack'} · Pickup code ${row.pickup_code}`,
      occurred_at: new Date(row.created_at),
    });
  }

  const sorted = items
    .filter((item) => !Number.isNaN(item.occurred_at.getTime()))
    .sort((a, b) => b.occurred_at.getTime() - a.occurred_at.getTime());

  return sorted.slice(0, limit);
}
