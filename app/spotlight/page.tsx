import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { currentSpotlight, pastSpotlights } from '@/data/spotlightData';

export default function Spotlight() {
  const howToBeSpotlighted = [
    {
      title: 'Make Consistent Impact',
      description: 'Regularly contribute through donations, food sharing, or volunteering.',
      icon: '⭐',
    },
    {
      title: 'Document Your Journey',
      description: 'Share your story and the positive changes you are creating in your community.',
      icon: '📸',
    },
    {
      title: 'Inspire Others',
      description: 'Show how others can replicate your success and join the movement.',
      icon: '💡',
    },
    {
      title: 'Nominate Someone',
      description: 'Know a hero in your community? Let us know through our contact form.',
      icon: '🏆',
    },
  ];

  return (
    <div className="page-shell">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Community Spotlight</p>
          <h1 className="text-4xl sm:text-5xl text-[var(--foreground)]">
            Celebrating the heroes making food security a reality.
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Every week, we shine a light on individuals and organizations making extraordinary contributions 
            to end hunger and reduce food waste in their communities.
          </p>
        </div>
      </section>

      {/* Current Spotlight */}
      <section className="section-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)] bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)]">
              ✨ Spotlight of the Week
            </div>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">{currentSpotlight.week}</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
            <Card className="h-fit">
              <CardContent className="pt-8 text-center">
                <div className="text-8xl mb-6">{currentSpotlight.image}</div>
                <h2 className="text-3xl font-semibold text-[var(--foreground)] mb-2">{currentSpotlight.name}</h2>
                <p className="text-[var(--primary)] font-medium mb-1">{currentSpotlight.role}</p>
                <p className="text-sm text-[var(--muted-foreground)] mb-6">📍 {currentSpotlight.location}</p>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2">Achievement</p>
                  <p className="text-lg font-semibold text-[var(--foreground)]">{currentSpotlight.achievement}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Impact This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {currentSpotlight.impact.map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                        <div className="text-2xl font-semibold text-[var(--primary)]">{stat.metric}</div>
                        <div className="text-xs text-[var(--muted-foreground)] mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Their Story</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[var(--muted-foreground)] whitespace-pre-line leading-relaxed">
                    {currentSpotlight.story}
                  </p>
                  <div className="rounded-lg border-l-4 border-[var(--primary)] bg-[var(--surface-alt)] p-4 italic">
                    <p className="text-[var(--foreground)]">"{currentSpotlight.quote}"</p>
                    <p className="text-sm text-[var(--muted-foreground)] mt-2">— {currentSpotlight.name}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How They Did It</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm text-[var(--muted-foreground)]">
                    <li className="flex gap-3">
                      <span className="text-[var(--primary)] font-semibold">01</span>
                      <span>Registered as a food partner on the EcoEats platform</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[var(--primary)] font-semibold">02</span>
                      <span>Set up daily routines to track and list surplus meals</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[var(--primary)] font-semibold">03</span>
                      <span>Coordinated with volunteers for efficient pickup and distribution</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[var(--primary)] font-semibold">04</span>
                      <span>Encouraged other local restaurants to join the movement</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Past Spotlights */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)]">Past heroes</h2>
            <p className="text-[var(--muted-foreground)] mt-3">
              More amazing people who have made a difference in their communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastSpotlights.map((person) => (
              <Card key={person.name} hover>
                <CardContent className="pt-6 text-center">
                  <div className="text-5xl mb-4">{person.image}</div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">{person.name}</h3>
                  <p className="text-sm text-[var(--primary)] mb-2">{person.role}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mb-4">{person.week}</p>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] p-3 mb-4">
                    <p className="text-xs font-semibold text-[var(--foreground)]">{person.achievement}</p>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mb-4 line-clamp-3">{person.preview}</p>
                  <div className="flex gap-2 justify-center text-xs text-[var(--muted-foreground)]">
                    {Object.entries(person.impact).map(([key, value]) => (
                      <div key={key} className="rounded bg-[var(--surface-alt)] px-2 py-1">
                        <span className="font-semibold text-[var(--foreground)]">{value}</span> {key}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Be Featured */}
      <section className="section-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)]">Want to be featured?</h2>
            <p className="text-[var(--muted-foreground)] mt-3">
              We're always looking for inspiring stories from our community. Here's how you can be spotlighted.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howToBeSpotlighted.map((item) => (
              <Card key={item.title}>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-[var(--primary)] text-white border-none shadow-[var(--shadow)]">
            <CardContent className="py-12">
              <h2 className="text-3xl sm:text-4xl mb-4">Be the next spotlight hero</h2>
              <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto mb-8">
                Every act of kindness matters. Join EcoEats today and start making a measurable impact in your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-[var(--primary)] border-white hover:bg-white/90">
                    Nominate Someone
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
