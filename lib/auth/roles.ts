export type UserRole =
  | 'BENEFICIARY'
  | 'DONOR'
  | 'PARTNER_OWNER'
  | 'PARTNER_STAFF'
  | 'VOLUNTEER'
  | 'ADMIN';

const SIGNUP_ROLE_MAP: Record<string, UserRole> = {
  beneficiary: 'BENEFICIARY',
  donor: 'DONOR',
  partner: 'PARTNER_OWNER',
};

export function normalizeRole(input: string | null | undefined): UserRole | null {
  if (!input) return null;
  const trimmed = input.trim();
  const upper = trimmed.toUpperCase();
  if (
    upper === 'BENEFICIARY' ||
    upper === 'DONOR' ||
    upper === 'PARTNER_OWNER' ||
    upper === 'PARTNER_STAFF' ||
    upper === 'VOLUNTEER' ||
    upper === 'ADMIN'
  ) {
    return upper as UserRole;
  }

  const mapped = SIGNUP_ROLE_MAP[trimmed.toLowerCase()];
  return mapped ?? null;
}

export function roleHomePath(role: UserRole) {
  switch (role) {
    case 'BENEFICIARY':
      return '/app';
    case 'DONOR':
      return '/donor/dashboard';
    case 'PARTNER_OWNER':
    case 'PARTNER_STAFF':
      return '/partner/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    case 'VOLUNTEER':
    default:
      return '/';
  }
}
