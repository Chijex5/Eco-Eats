import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { currentSpotlight } from '@/data/spotlightData';

export default function Home() {
  const stats = [
    { number: '10K+', label: 'Meals served' },
    { number: '250+', label: 'Active partners' },
    { number: '5K+', label: 'People helped' },
    { number: '50+', label: 'Communities' },
  ];

  const features = [
    {
      title: 'For beneficiaries',
      description: 'Request food support discreetly, receive vouchers, and access meals with dignity.',
      link: '/auth/signup',
    },
    {
      title: 'For food partners',
      description: 'List surplus meals, accept vouchers, and make a real impact in your community.',
      link: '/partners/join',
    },
    {
      title: 'For donors',
      description: 'Fund meal vouchers, track your impact, and help end hunger transparently.',
      link: '/donate',
    },
  ];

  const steps = [
    { step: '1', title: 'Request help', desc: 'Beneficiaries submit a support request.' },
    { step: '2', title: 'Fund vouchers', desc: 'Donors sponsor meals directly.' },
    { step: '3', title: 'Issue access', desc: 'Approved requests receive vouchers.' },
    { step: '4', title: 'Redeem meals', desc: 'Partners serve meals and confirm redemption.' },
  ];

  return (
    <div className="page-shell">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/home-hero.webp"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/95 via-[var(--background)]/75 to-transparent" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 p-8 shadow-[var(--shadow-soft)] backdrop-blur">
              <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                SDG 2: Zero Hunger
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl text-[var(--foreground)]">
                Reducing hunger with calm, accountable technology.
              </h1>
              <p className="text-lg text-[var(--muted-foreground)] max-w-xl">
                EcoEats connects people who need food, food providers, and donors through a transparent platform. Every meal is traceable, every person is respected.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>

            <Card className="bg-[var(--surface)]/90 backdrop-blur" hover>
              <CardHeader className="mb-6">
                <CardTitle className="text-2xl">Impact snapshot</CardTitle>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Verified activity across the EcoEats network.
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-4">
                    <div className="text-2xl font-semibold text-[var(--foreground)]">{stat.number}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-2">{stat.label}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-muted">
        <div className="bg-[var(--muted-foreground)] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-semibold text-[var(--foreground)]">{stat.number}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="absolute inset-0">
          <img
            src="/images/donor-image.webp"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/95 via-[var(--background)]/75 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">How you can help</p>
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">Choose your path to impact.</h2>
            <p className="text-[var(--muted-foreground)] mt-4">
              EcoEats supports beneficiaries, partners, and donors with a clear, trackable flow that prioritizes dignity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {features.map((feature) => (
              <Card key={feature.title} hover>
                <CardHeader>
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

      <section className="section-muted bg-[var(--muted-foreground)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Simple flow</p>
              <h2 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">A transparent journey from donation to meal.</h2>
              <p className="text-[var(--muted)] mt-4">
                Every step is verified so supporters can trust their contributions and beneficiaries feel respected.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 w-full lg:max-w-xl">
              {steps.map((step) => (
                <div key={step.step} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Step {step.step}</div>
                  <div className="text-lg font-semibold text-[var(--foreground)] mt-2">{step.title}</div>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)] bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)] mb-4">
              ✨ Community Spotlight
            </div>
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)]">Meet this week&apos;s hero</h2>
            <p className="text-[var(--muted-foreground)] mt-3">
              Celebrating community members making extraordinary impact.
            </p>
          </div>

          <Card hover className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-[240px_1fr] gap-6">
              <div className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 flex items-center justify-center p-8 rounded-l-xl">
                <div className="text-center">
                  <div className="text-8xl mb-4">{currentSpotlight.image}</div>
                  <div className="text-sm font-medium text-[var(--foreground)]">This Week</div>
                </div>
              </div>
              <CardContent className="py-6 pr-6">
                <h3 className="text-2xl font-semibold text-[var(--foreground)] mb-2">{currentSpotlight.name}</h3>
                <p className="text-[var(--primary)] font-medium mb-1">{currentSpotlight.role}</p>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">📍 {currentSpotlight.location}</p>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] p-4 mb-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {currentSpotlight.achievement}
                  </p>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mb-6">
                  &quot;{currentSpotlight.quote}&quot;
                </p>
                <Link href="/spotlight">
                  <Button variant="outline" size="sm">
                    Read Full Story →
                  </Button>
                </Link>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      <section className="section-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Education & Awareness</p>
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">Learn about food waste and how you can help.</h2>
            <p className="text-[var(--muted-foreground)] mt-4">
              Understanding the problem is the first step toward solving it. Discover the impact of food waste 
              and practical ways you can make a difference in your community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <Card hover>
              <CardHeader>
                <div className="text-4xl mb-3">📚</div>
                <CardTitle>The Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)] mb-6">
                  Learn about global food waste statistics, environmental impact, and the connection to hunger.
                </p>
                <Link href="/learn">
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader>
                <div className="text-4xl mb-3">💡</div>
                <CardTitle>How You Can Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)] mb-6">
                  Practical tips and actions for reducing food waste at home, work, and in your community.
                </p>
                <Link href="/learn">
                  <Button variant="outline" size="sm" className="w-full">
                    Get Tips
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader>
                <div className="text-4xl mb-3">🤝</div>
                <CardTitle>Get Involved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)] mb-6">
                  Report food waste, volunteer, partner with us, or donate to support the mission.
                </p>
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-[var(--primary)] text-white border-none shadow-[var(--shadow)]">
            <CardContent className="py-12">
              <h2 className="text-3xl sm:text-4xl mb-4">Join the fight against hunger.</h2>
              <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto">
                Every donation, partnership, and request helps build stronger, more nourished communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/donate">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-[var(--primary)] border-white hover:bg-white/90">
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
