import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--surface-alt)] text-[var(--foreground)] mt-auto border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-xs font-semibold text-white">
                EE
              </div>
              <div>
                <p className="text-lg font-semibold">EcoEats</p>
                <p className="text-sm text-[var(--muted-foreground)]">Reducing hunger with clarity and care.</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md">
              We connect people who need food, community partners, and donors through a transparent system that keeps every meal accountable.
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-4">Navigate</h4>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>
                <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[var(--foreground)] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-[var(--foreground)] transition-colors">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/spotlight" className="hover:text-[var(--foreground)] transition-colors">
                  Spotlight
                </Link>
              </li>
              <li>
                <Link href="/partners/join" className="hover:text-[var(--foreground)] transition-colors">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-[var(--foreground)] transition-colors">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>
                <Link href="/auth/signup" className="hover:text-[var(--foreground)] transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--foreground)] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--foreground)] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-foreground)]">
          <span>&copy; {currentYear} EcoEats. All rights reserved.</span>
          <span className="inline-flex items-center gap-2">
            <span className="px-2 py-1 text-[10px] bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] rounded-full">SDG 2</span>
            Zero Hunger
          </span>
        </div>
      </div>
    </footer>
  );
};
