'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

type NavLink = { href: string; label: string };
type Session = { role: string; name: string } | null;

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

interface NavigationClientProps {
  session: Session;
  navLinks: NavLink[];
  initials: string;
}

export function NavigationClient({ session, navLinks, initials }: NavigationClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const naviLinks = session ? roleLinks[session.role] ?? publicLinks : publicLinks;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore logout errors and continue to redirect to login.
    } finally {
      window.location.href = '/auth/login';
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('mobile-menu');
      const button = document.getElementById('mobile-menu-button');
      if (nav && button && !nav.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open using CSS class
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={session ? naviLinks[0]?.href ?? '/' : '/'} className="flex items-center gap-3 group">
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
            {naviLinks.map((link) => (
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
              <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
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

          {/* Mobile menu button */}
          <button
            id="mobile-menu-button"
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary)] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        aria-hidden={!isMobileMenuOpen}
        className={`md:hidden border-t border-[var(--border)] bg-[var(--surface)] shadow-lg transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {naviLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-lg text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 space-y-2 border-t border-[var(--border)] mt-3">
            {session ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={async () => {
                  setIsMobileMenuOpen(false);
                  await handleLogout();
                }}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            ) : (
              <>
                <Link href="/auth/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" className="block" onClick={() => setIsMobileMenuOpen(false)}>
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
}

export { publicLinks, roleLinks };
