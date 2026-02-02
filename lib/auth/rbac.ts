import type { UserRole } from './roles';

type RouteRule = {
  prefix: string;
  roles: UserRole[];
};

const ROUTE_RULES: RouteRule[] = [
  { prefix: '/api/admin', roles: ['ADMIN'] },
  { prefix: '/api/partners', roles: ['PARTNER_OWNER', 'PARTNER_STAFF', 'ADMIN'] },
  { prefix: '/api/redeem', roles: ['PARTNER_OWNER', 'PARTNER_STAFF', 'ADMIN'] },
  { prefix: '/api/donations', roles: ['DONOR', 'ADMIN'] },
  { prefix: '/api/impact', roles: ['DONOR', 'ADMIN'] },
  { prefix: '/api/requests', roles: ['BENEFICIARY', 'ADMIN'] },
  { prefix: '/api/vouchers', roles: ['BENEFICIARY', 'ADMIN'] },
  { prefix: '/api/surplus', roles: ['BENEFICIARY', 'ADMIN'] },
  { prefix: '/admin', roles: ['ADMIN'] },
  { prefix: '/partner', roles: ['PARTNER_OWNER', 'PARTNER_STAFF', 'ADMIN'] },
  { prefix: '/donor', roles: ['DONOR', 'ADMIN'] },
  { prefix: '/app', roles: ['BENEFICIARY', 'ADMIN'] },
];

export function getRequiredRoles(pathname: string) {
  const match = ROUTE_RULES.find((rule) => pathname.startsWith(rule.prefix));
  return match?.roles ?? null;
}

export function isRoleAllowed(role: UserRole, allowed: UserRole[]) {
  return allowed.includes(role);
}
