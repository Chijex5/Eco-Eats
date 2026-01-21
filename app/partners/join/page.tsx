import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function JoinPartners() {
  const benefits = [
    {
      icon: '❤️',
      title: 'Make Real Impact',
      description: 'Help feed people in your community and reduce hunger where it matters most.',
    },
    {
      icon: '♻️',
      title: 'Reduce Food Waste',
      description: 'Turn surplus food into meals instead of waste, supporting sustainability goals.',
    },
    {
      icon: '📊',
      title: 'Track Your Impact',
      description: 'See exactly how many meals you\'ve provided and people you\'ve helped.',
    },
    {
      icon: '🤝',
      title: 'Build Community',
      description: 'Connect with your local community and enhance your brand reputation.',
    },
    {
      icon: '💼',
      title: 'Easy to Use',
      description: 'Simple dashboard to manage listings, redemptions, and view analytics.',
    },
    {
      icon: '🎯',
      title: 'SDG Alignment',
      description: 'Contribute to SDG 2: Zero Hunger and demonstrate corporate responsibility.',
    },
  ];

  const partnerTypes = [
    {
      type: 'Restaurants',
      icon: '🍴',
      description: 'Accept meal vouchers and list surplus food from daily operations.',
    },
    {
      type: 'Cafeterias',
      icon: '🏫',
      description: 'Support students and staff with subsidized meals and surplus programs.',
    },
    {
      type: 'Community Kitchens',
      icon: '👨‍🍳',
      description: 'Coordinate meal distribution and serve voucher holders in your area.',
    },
    {
      type: 'Food Vendors',
      icon: '🛒',
      description: 'Participate in food rescue programs and accept digital vouchers.',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Apply to Join',
      description: 'Fill out the partner application form with your business details.',
    },
    {
      step: '2',
      title: 'Get Verified',
      description: 'Our team reviews and verifies your application (usually within 48 hours).',
    },
    {
      step: '3',
      title: 'Set Up Profile',
      description: 'Complete your profile with location, hours, and services offered.',
    },
    {
      step: '4',
      title: 'Start Helping',
      description: 'Begin accepting vouchers and listing surplus food to help your community.',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-[var(--muted)] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span>🤝</span>
            <span>Join Our Network</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-6">
            Become a Food Partner
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
            Join EcoEats as a food partner and help reduce hunger while minimizing food waste in your community.
          </p>
        </div>

        {/* Partner Types */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">
            Who Can Become a Partner?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerTypes.map((partner, index) => (
              <Card key={index} hover className="text-center">
                <CardHeader>
                  <div className="text-5xl mb-3">{partner.icon}</div>
                  <CardTitle className="text-lg">{partner.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    {partner.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">
            Why Partner With EcoEats?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} hover>
                <CardHeader>
                  <div className="flex items-start">
                    <div className="text-4xl mr-4">{benefit.icon}</div>
                    <div>
                      <CardTitle className="text-lg mb-2">{benefit.title}</CardTitle>
                      <p className="text-[var(--muted-foreground)] text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">
            Getting Started is Easy
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features for Partners */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12 shadow-lg mb-20">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">
            Partner Dashboard Features
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center">
                <span className="text-2xl mr-3">📱</span>
                Voucher Redemption
              </h3>
              <ul className="space-y-2 ml-11">
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">Scan QR codes or enter redemption codes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">Instant verification and confirmation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">Track all redemptions in real-time</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center">
                <span className="text-2xl mr-3">♻️</span>
                Surplus Management
              </h3>
              <ul className="space-y-2 ml-11">
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">List available surplus food packs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">Set pickup times and quantities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">Confirm pickups with unique codes</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center">
                <span className="text-2xl mr-3">📊</span>
                Impact Analytics
              </h3>
              <ul className="space-y-2 ml-11">
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">See total meals served</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">Track people helped over time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">View detailed impact reports</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center">
                <span className="text-2xl mr-3">⚙️</span>
                Easy Management
              </h3>
              <ul className="space-y-2 ml-11">
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">Manage staff access and permissions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">Update business hours and details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">✓</span>
                  <span className="text-[var(--muted-foreground)]">View redemption history</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-2xl">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Join Our Partner Network?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Start making a difference today. Apply now and help us reduce hunger in your community.
              </p>
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary">
                  Apply to Become a Partner
                </Button>
              </Link>
              <p className="mt-4 text-sm opacity-75">
                Questions? <a href="#" className="underline">Contact our partner team</a>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
