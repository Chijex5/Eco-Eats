import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function HowItWorks() {
  const programs = [
    {
      title: 'Meal Voucher Program',
      summary: 'Donations become vouchers that can be redeemed at verified partners.',
      steps: [
        'Donors fund meal vouchers through the platform',
        'Beneficiaries submit requests for food support',
        'Admins review and approve eligible requests',
        'Approved beneficiaries receive digital vouchers',
        'Vouchers are redeemed at partner food locations',
        'Partners confirm redemption via QR code or unique code',
        'System tracks and records impact metrics',
      ],
      benefits: [
        'Dignified access to meals',
        'Transparent tracking from donation to meal',
        'Prevents fraud with unique redemption codes',
        'Real-time impact reporting',
      ],
    },
    {
      title: 'Surplus Food Rescue',
      summary: 'Surplus meals are listed and claimed by people who need them most.',
      steps: [
        'Food partners list available surplus food packs',
        'Beneficiaries can browse and claim available packs',
        'System generates unique pickup codes',
        'Beneficiaries present code at pickup location',
        'Partners confirm pickup and mark as complete',
        'Reduces food waste while feeding communities',
      ],
      benefits: [
        'Reduces food waste',
        'Provides fresh meals to those in need',
        'Easy coordination between partners and beneficiaries',
        'Environmental impact alongside social impact',
      ],
    },
  ];

  const roles = [
    {
      role: 'Beneficiaries',
      description: 'People needing food support',
      actions: [
        'Sign up with minimal friction',
        'Request food support discreetly',
        'Receive digital vouchers or claim surplus packs',
        'Redeem support with QR codes',
        'Give feedback on experiences',
      ],
    },
    {
      role: 'Food Partners',
      description: 'Restaurants, cafeterias, community kitchens',
      actions: [
        'Register and get verified',
        'List available surplus meals',
        'Accept voucher redemptions',
        'Confirm pickups and deliveries',
        'View impact statistics',
      ],
    },
    {
      role: 'Donors',
      description: 'Individuals, organizations, CSR programs',
      actions: [
        'Fund meal vouchers or food packs',
        'Choose donation amounts',
        'Track donation impact',
        'View transparent reports',
        'See aggregate community impact',
      ],
    },
    {
      role: 'Admins',
      description: 'Schools, NGOs, community organizations',
      actions: [
        'Verify and approve partners',
        'Review beneficiary requests',
        'Issue and manage vouchers',
        'Monitor for fraud',
        'Generate impact reports',
      ],
    },
  ];

  const flow = [
    {
      title: 'Request',
      description: 'Beneficiaries submit a request and verification begins.',
    },
    {
      title: 'Fund',
      description: 'Donors contribute to voucher pools in real time.',
    },
    {
      title: 'Approve',
      description: 'Admins confirm eligibility and issue vouchers.',
    },
    {
      title: 'Issue',
      description: 'Digital vouchers are delivered to beneficiaries.',
    },
    {
      title: 'Redeem',
      description: 'Partners serve meals and confirm redemption.',
    },
    {
      title: 'Track',
      description: 'Impact metrics are recorded and shared.',
    },
  ];

  const heroDelay = { '--delay': '120ms' } as CSSProperties;
  const sectionDelay = { '--delay': '160ms' } as CSSProperties;
  const cardDelay = { '--delay': '220ms' } as CSSProperties;

  return (
    <div className="page-shell">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 soft-divider">
        <div className="max-w-3xl space-y-6 reveal" style={heroDelay}>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">How it works</p>
          <h1 className="text-4xl sm:text-5xl text-[var(--foreground)]">A clear path from need to nourishment.</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            EcoEats is designed for transparency and dignity, connecting beneficiaries, donors, and partners through verified steps.
          </p>
        </div>
      </section>

      <section className="section-muted soft-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10 reveal" style={sectionDelay}>
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)]">Core programs</h2>
            <p className="text-[var(--muted-foreground)] mt-2">Two pathways built to reduce hunger and waste.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((program) => (
              <Card key={program.title} className="reveal" style={cardDelay}>
                <CardHeader>
                  <CardTitle className="text-2xl">{program.title}</CardTitle>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">
                    {program.summary}
                  </p>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-3">Steps</h4>
                    <ol className="space-y-2 text-sm text-[var(--muted-foreground)]">
                      {program.steps.map((step, i) => (
                        <li key={step} className="flex gap-3">
                          <span className="text-[var(--primary)] font-semibold">{String(i + 1).padStart(2, '0')}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-3">Benefits</h4>
                    <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                      {program.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2">
                          <span className="text-[var(--primary)]">-</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 soft-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl reveal" style={sectionDelay}>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Who joins</p>
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">Every role is supported.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {roles.map((roleData) => (
              <Card key={roleData.role} className="reveal" style={cardDelay}>
                <CardHeader>
                  <CardTitle className="text-lg">{roleData.role}</CardTitle>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">
                    {roleData.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-left text-sm text-[var(--muted-foreground)]">
                    {roleData.actions.map((action) => (
                      <li key={action} className="flex items-start gap-2">
                        <span className="text-[var(--primary)]">-</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-muted soft-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10 reveal" style={sectionDelay}>
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)]">End-to-end impact flow</h2>
            <p className="text-[var(--muted-foreground)] mt-3">Every step is verified and visible.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flow.map((item, index) => (
              <div key={item.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 reveal" style={cardDelay}>
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Step {String(index + 1).padStart(2, '0')}
                </div>
                <div className="text-lg font-semibold text-[var(--foreground)] mt-2">{item.title}</div>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-[var(--primary)] text-white border-none shadow-[var(--shadow)] reveal" style={sectionDelay}>
            <CardContent className="py-12">
              <h2 className="text-3xl sm:text-4xl mb-4">Ready to make a difference?</h2>
              <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
                Join EcoEats today and take part in a transparent solution to hunger in your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/partners/join">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-[var(--primary)] border-white hover:bg-white/90">
                    Become a Partner
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
