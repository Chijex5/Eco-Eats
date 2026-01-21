import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function JoinPartners() {
  const benefits = [
    {
      title: 'Make real impact',
      description: 'Help feed people in your community and reduce hunger where it matters most.',
    },
    {
      title: 'Reduce food waste',
      description: 'Turn surplus food into meals instead of waste, supporting sustainability goals.',
    },
    {
      title: 'Track your impact',
      description: 'See how many meals you provide and people you support over time.',
    },
    {
      title: 'Build community trust',
      description: 'Strengthen your reputation by contributing to a transparent program.',
    },
    {
      title: 'Easy to manage',
      description: 'Use a simple dashboard for listings, redemptions, and analytics.',
    },
    {
      title: 'SDG alignment',
      description: 'Contribute to SDG 2: Zero Hunger and demonstrate responsibility.',
    },
  ];

  const partnerTypes = [
    {
      type: 'Restaurants',
      description: 'Accept meal vouchers and list surplus food from daily operations.',
    },
    {
      type: 'Cafeterias',
      description: 'Support students and staff with subsidized meals and surplus programs.',
    },
    {
      type: 'Community kitchens',
      description: 'Coordinate meal distribution and serve voucher holders in your area.',
    },
    {
      type: 'Food vendors',
      description: 'Participate in food rescue programs and accept digital vouchers.',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Apply to join',
      description: 'Fill out the partner application form with your business details.',
    },
    {
      step: '2',
      title: 'Get verified',
      description: 'Our team reviews and verifies your application (usually within 48 hours).',
    },
    {
      step: '3',
      title: 'Set up profile',
      description: 'Complete your profile with location, hours, and services offered.',
    },
    {
      step: '4',
      title: 'Start helping',
      description: 'Begin accepting vouchers and listing surplus food to help your community.',
    },
  ];

  const dashboardFeatures = [
    {
      title: 'Voucher redemption',
      items: [
        'Scan QR codes or enter redemption codes',
        'Instant verification and confirmation',
        'Track all redemptions in real time',
      ],
    },
    {
      title: 'Surplus management',
      items: [
        'List available surplus food packs',
        'Set pickup times and quantities',
        'Confirm pickups with unique codes',
      ],
    },
    {
      title: 'Impact analytics',
      items: [
        'See total meals served',
        'Track people helped over time',
        'View detailed impact reports',
      ],
    },
    {
      title: 'Easy management',
      items: [
        'Manage staff access and permissions',
        'Update business hours and details',
        'View redemption history',
      ],
    },
  ];

  return (
    <div className="page-shell">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Partners</p>
          <h1 className="text-4xl sm:text-5xl text-[var(--foreground)]">Become a food partner.</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Join EcoEats to reduce hunger and food waste while serving your community with clarity.
          </p>
        </div>
      </section>

      <section className="section-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl sm:text-4xl text-[var(--foreground)] mb-8">Who can partner?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerTypes.map((partner) => (
              <Card key={partner.type} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{partner.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--muted-foreground)]">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Benefits</p>
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">Why partner with EcoEats?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {benefits.map((benefit, index) => (
              <Card key={benefit.title}>
                <CardHeader>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Benefit {String(index + 1).padStart(2, '0')}</div>
                  <CardTitle className="text-lg mt-3">{benefit.title}</CardTitle>
                  <p className="text-sm text-[var(--muted-foreground)] mt-3">{benefit.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl sm:text-4xl text-[var(--foreground)] mb-10">Getting started is easy</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item) => (
              <div key={item.step} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Step {item.step}</div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mt-3">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-[var(--surface-alt)] border-none">
            <CardHeader>
              <CardTitle className="text-3xl">Partner dashboard features</CardTitle>
              <p className="text-sm text-[var(--muted-foreground)]">
                Simple tools that keep your team efficient and your impact measurable.
              </p>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              {dashboardFeatures.map((feature, index) => (
                <div key={feature.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Area {String(index + 1).padStart(2, '0')}</div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mt-3">{feature.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--muted-foreground)]">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-[var(--primary)]">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-[var(--primary)] text-white border-none shadow-[var(--shadow)]">
            <CardContent className="py-12">
              <h2 className="text-3xl sm:text-4xl mb-4">Ready to join our partner network?</h2>
              <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
                Apply now and help us reduce hunger while building a stronger community.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Apply to Become a Partner
                  </Button>
                </Link>
                <a href="#" className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10">
                  Contact our team
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
