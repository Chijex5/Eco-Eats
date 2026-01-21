import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function Home() {
  const stats = [
    { number: '10K+', label: 'Meals Served', icon: '🍽️' },
    { number: '250+', label: 'Active Partners', icon: '🤝' },
    { number: '5K+', label: 'People Helped', icon: '❤️' },
    { number: '50+', label: 'Communities', icon: '🏘️' },
  ];

  const features = [
    {
      icon: '👥',
      title: 'For Beneficiaries',
      description: 'Request food support discreetly, receive vouchers, and access meals with dignity.',
      link: '/auth/signup',
    },
    {
      icon: '🍽️',
      title: 'For Food Partners',
      description: 'List surplus meals, accept vouchers, and make a real impact in your community.',
      link: '/partners/join',
    },
    {
      icon: '💝',
      title: 'For Donors',
      description: 'Fund meal vouchers, track your impact, and help end hunger transparently.',
      link: '/donate',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-[var(--muted)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <span>🎯</span>
              <span>Supporting SDG 2: Zero Hunger</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-6 leading-tight">
              Reducing Hunger Through
              <span className="block text-[var(--primary)] mt-2">
                Technology & Community
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-[var(--muted-foreground)] mb-10 max-w-2xl mx-auto">
              EcoEats connects people who need food, food providers, and donors through a transparent, 
              accountable platform. Every meal matters, every person counts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-slate-900 py-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-1">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-[var(--muted-foreground)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              How You Can Make a Difference
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Whether you need help, can provide food, or want to donate, EcoEats makes it simple and transparent.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <CardHeader>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--muted-foreground)] mb-6">
                    {feature.description}
                  </p>
                  <Link href={feature.link}>
                    <Button variant="outline" size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white dark:bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              Simple, Transparent Process
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              From donation to redemption, every step is tracked and verified.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Request Help', desc: 'Beneficiaries submit support requests' },
              { step: '2', title: 'Donors Fund', desc: 'Donors fund meal vouchers' },
              { step: '3', title: 'Vouchers Issued', desc: 'Approved requests receive vouchers' },
              { step: '4', title: 'Meals Served', desc: 'Partners redeem vouchers for meals' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-2xl">
            <CardContent className="py-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Join the Fight Against Hunger
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Together, we can ensure no one goes hungry. Start making a difference today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/donate">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white border-white hover:bg-white hover:text-[var(--primary)]">
                    Donate Today
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
