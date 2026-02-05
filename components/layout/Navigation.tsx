import Link from 'next/link';
import { cookies } from 'next/headers';
import { Button } from '../ui/Button';
import { verifySessionToken } from '@/lib/auth/jwt';
import type { SessionPayload } from '@/lib/auth/jwt';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';

type NavLink = { href: string; label: string };

const publicLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/beneficiaries', label: 'Beneficiaries' },
  { href: '/learn', label: 'Learn' },
  { href: '/spotlight', label: 'Spotlight' },
  { href: '/partners/join', label: 'Become a Partner' },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact' },
];

const roleLinks: Record<string, NavLink[]> = {
  BENEFICIARY: [
    { href: '/app', label: 'Dashboard' },
    { href: '/app/request-help', label: 'Request help' },
    { href: '/app/vouchers', label: 'Vouchers' },
    { href: '/app/surplus', label: 'Surplus packs' },
    { href: '/app/history', label: 'History' },
  ],
  DONOR: [
    { href: '/donor/dashboard', label: 'Dashboard' },
    { href: '/donor/donate', label: 'Donate' },
    { href: '/donor/history', label: 'History' },
    { href: '/donor/impact', label: 'Impact' },
  ],
  PARTNER_OWNER: [
    { href: '/partner/dashboard', label: 'Dashboard' },
    { href: '/partner/surplus', label: 'Surplus' },
    { href: '/partner/redeem', label: 'Redeem' },
    { href: '/partner/history', label: 'History' },
    { href: '/partner/settings', label: 'Settings' },
  ],
  PARTNER_STAFF: [
    { href: '/partner/dashboard', label: 'Dashboard' },
    { href: '/partner/redeem', label: 'Redeem' },
    { href: '/partner/history', label: 'History' },
  ],
  ADMIN: [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/requests', label: 'Requests' },
    { href: '/admin/partners', label: 'Partners' },
    { href: '/admin/vouchers', label: 'Vouchers' },
    { href: '/admin/impact', label: 'Impact' },
  ],
  VOLUNTEER: [
    { href: '/volunteer', label: 'Dashboard' },
  ],
};

async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export const Navigation = async () => {
  const session = await getSession();
  const navLinks = session ? roleLinks[session.role] ?? publicLinks : publicLinks;
  const initials = session?.name
    ? session.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'EE';

  return (
    <nav className="bg-[var(--background)]/85 backdrop-blur border-b border-[var(--border)] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={session ? navLinks[0]?.href ?? '/' : '/'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-semibold shadow-sm group-hover:shadow-md transition-shadow">
              {initials}
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-semibold">EcoEats</span>
              <span className="hidden sm:block text-xs text-[var(--muted-foreground)]">
                {session ? `Signed in as ${session.name}` : 'Zero hunger, grounded delivery'}
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Switch account
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 space-y-2 border-t border-[var(--border)]">
            {session ? (
              <Link href="/auth/login" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  Switch account
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
