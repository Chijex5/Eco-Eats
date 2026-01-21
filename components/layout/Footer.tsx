import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1b231f] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center text-xs font-semibold">
                EE
              </div>
              <div>
                <p className="text-lg font-semibold">EcoEats</p>
                <p className="text-sm text-white/70">Reducing hunger with clarity and care.</p>
              </div>
            </div>
            <p className="text-sm text-white/70 max-w-md">
              We connect people who need food, community partners, and donors through a transparent system that keeps every meal accountable.
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-white/60 mb-4">Navigate</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/partners/join" className="hover:text-white transition-colors">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-white transition-colors">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-white/60 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/auth/signup" className="hover:text-white transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <span>&copy; {currentYear} EcoEats. All rights reserved.</span>
          <span className="inline-flex items-center gap-2">
            <span className="px-2 py-1 text-[10px] bg-white/10 rounded-full">SDG 2</span>
            Zero Hunger
          </span>
        </div>
      </div>
    </footer>
  );
};
