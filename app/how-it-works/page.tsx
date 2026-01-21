import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HowItWorks() {
  const programs = [
    {
      title: 'Meal Voucher Program',
      icon: '🎫',
      steps: [
        'Donors fund meal vouchers through the platform',
        'Beneficiaries submit requests for food support',
        'Admin reviews and approves eligible requests',
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
      icon: '♻️',
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
      icon: '👥',
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
      icon: '🍽️',
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
      icon: '💝',
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
      icon: '🛡️',
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

  return (
    <div className="bg-gradient-to-b from-white to-[var(--muted)] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span>🎯</span>
            <span>SDG 2: Zero Hunger</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-6">
            How EcoEats Works
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
            A transparent, accountable system connecting people who need food with those who can provide it.
          </p>
        </div>

        {/* Programs Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">
            Core Programs
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="bg-white">
                <CardHeader>
                  <div className="text-5xl mb-4">{program.icon}</div>
                  <CardTitle className="text-2xl">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h4 className="font-bold text-[var(--foreground)] mb-3">How it works:</h4>
                    <ol className="space-y-2">
                      {program.steps.map((step, i) => (
                        <li key={i} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-[var(--muted-foreground)]">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)] mb-3">Benefits:</h4>
                    <ul className="space-y-2">
                      {program.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-[var(--primary)] mr-2">✓</span>
                          <span className="text-[var(--muted-foreground)]">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Roles Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">
            Who Can Participate
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((roleData, index) => (
              <Card key={index} hover className="text-center">
                <CardHeader>
                  <div className="text-5xl mb-3">{roleData.icon}</div>
                  <CardTitle className="text-lg">{roleData.role}</CardTitle>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">
                    {roleData.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-left text-sm">
                    {roleData.actions.map((action, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-[var(--primary)] mr-2 mt-0.5">→</span>
                        <span className="text-[var(--muted-foreground)]">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Flow */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12 shadow-lg mb-20">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">
            End-to-End Impact Flow
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {[
              { icon: '📝', label: 'Request' },
              { icon: '💰', label: 'Fund' },
              { icon: '✅', label: 'Approve' },
              { icon: '🎫', label: 'Issue' },
              { icon: '🍽️', label: 'Redeem' },
              { icon: '📊', label: 'Track' },
            ].map((item, index, array) => (
              <div key={index} className="flex items-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-full flex items-center justify-center text-3xl mb-2 shadow-lg">
                    {item.icon}
                  </div>
                  <div className="font-semibold text-[var(--foreground)]">{item.label}</div>
                </div>
                {index < array.length - 1 && (
                  <div className="hidden md:block w-12 h-1 bg-[var(--primary)] mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-2xl">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join EcoEats today and be part of the solution to end hunger in your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/partners/join">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white hover:bg-white hover:text-[var(--primary)]">
                    Become a Partner
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
