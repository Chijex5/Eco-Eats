import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Learn() {
  const problems = [
    {
      title: 'The Global Crisis',
      stats: [
        { value: '1.3B tons', label: 'Food wasted globally per year' },
        { value: '828M', label: 'People facing hunger worldwide' },
        { value: '⅓', label: 'Of all food produced goes to waste' },
      ],
      description: 'While nearly a billion people go hungry, we waste enough food to feed them multiple times over. This paradox drives our mission.',
    },
    {
      title: 'Environmental Impact',
      stats: [
        { value: '8-10%', label: 'Of global greenhouse gas emissions' },
        { value: '250 km³', label: 'Of water wasted annually' },
        { value: '1.4B hectares', label: 'Of land used for wasted food' },
      ],
      description: 'Food waste is not just about hunger—it\'s a major contributor to climate change, water scarcity, and environmental degradation.',
    },
    {
      title: 'Economic Loss',
      stats: [
        { value: '$1 trillion', label: 'Annual global economic loss' },
        { value: '30-40%', label: 'Of food supply wasted in US alone' },
        { value: '$1,500', label: 'Average family waste per year' },
      ],
      description: 'Food waste represents massive economic inefficiency, affecting households, businesses, and entire economies.',
    },
  ];

  const solutions = [
    {
      category: 'At Home',
      icon: '🏠',
      tips: [
        'Plan meals and make shopping lists to buy only what you need',
        'Store food properly to extend its shelf life',
        'Understand expiration dates (sell-by vs. use-by)',
        'Repurpose leftovers into new meals',
        'Compost unavoidable food scraps',
        'Freeze items before they spoil',
      ],
    },
    {
      category: 'In Business',
      icon: '🏢',
      tips: [
        'Join EcoEats to donate surplus food to those in need',
        'Implement inventory management systems',
        'Offer smaller portion options to reduce plate waste',
        'Train staff on proper food handling and storage',
        'Track waste to identify problem areas',
        'Partner with food rescue organizations',
      ],
    },
    {
      category: 'In Community',
      icon: '🤝',
      tips: [
        'Volunteer with food rescue and distribution programs',
        'Advocate for food waste reduction policies',
        'Educate others about the problem and solutions',
        'Support businesses that minimize waste',
        'Organize community food sharing events',
        'Donate to programs that fight hunger',
      ],
    },
  ];

  const successStories = [
    {
      location: 'France',
      achievement: 'First country to ban supermarket food waste',
      impact: 'Supermarkets must donate unsold food to charities',
      result: 'Millions of meals redistributed annually',
    },
    {
      location: 'South Korea',
      achievement: 'Pay-as-you-throw food waste system',
      impact: 'Residents pay for food waste by weight',
      result: '30% reduction in food waste since implementation',
    },
    {
      location: 'Denmark',
      achievement: 'National food waste reduction campaign',
      impact: 'Public awareness and education initiative',
      result: '25% reduction in food waste in 5 years',
    },
  ];

  const heroDelay = { '--delay': '120ms' } as CSSProperties;
  const sectionDelay = { '--delay': '160ms' } as CSSProperties;
  const cardDelay = { '--delay': '220ms' } as CSSProperties;

  return (
    <div className="page-shell">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 soft-divider">
        <div className="max-w-3xl space-y-6 reveal" style={heroDelay}>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Education Hub</p>
          <h1 className="text-4xl sm:text-5xl text-[var(--foreground)]">
            Understanding food waste: The problem we can solve together.
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Food waste is one of the most pressing challenges of our time, connected to hunger, climate change, and resource depletion. 
            But every one of us has the power to make a difference.
          </p>
        </div>
      </section>

      <section className="section-muted soft-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12 reveal" style={sectionDelay}>
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)]">The scale of the problem</h2>
            <p className="text-[var(--muted-foreground)] mt-3">
              Understanding the magnitude helps us appreciate the urgency of action.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <Card key={problem.title} className="reveal" style={cardDelay}>
                <CardHeader>
                  <CardTitle className="text-xl">{problem.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {problem.stats.map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-3">
                        <div className="text-xl font-semibold text-[var(--primary)]">{stat.value}</div>
                        <div className="text-xs text-[var(--muted-foreground)] mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{problem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 soft-divider">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl reveal" style={sectionDelay}>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Take Action</p>
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">
              How you can help reduce food waste
            </h2>
            <p className="text-[var(--muted-foreground)] mt-3">
              Everyone has a role to play. Choose your path and start making an impact today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <Card key={solution.category} hover className="reveal" style={cardDelay}>
                <CardHeader>
                  <div className="text-4xl mb-3">{solution.icon}</div>
                  <CardTitle className="text-xl">{solution.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
                    {solution.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[var(--primary)] font-bold mt-0.5">•</span>
                        <span>{tip}</span>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12 reveal" style={sectionDelay}>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Inspiration</p>
            <h2 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">
              Success stories from around the world
            </h2>
            <p className="text-[var(--muted-foreground)] mt-3">
              See how communities and countries are tackling food waste with innovative solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story) => (
              <Card key={story.location} className="reveal" style={cardDelay}>
                <CardHeader>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-1 text-xs font-medium text-[var(--primary)] mb-3">
                    📍 {story.location}
                  </div>
                  <CardTitle className="text-lg">{story.achievement}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-1">Impact</p>
                    <p className="text-sm text-[var(--foreground)]">{story.impact}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-1">Result</p>
                    <p className="text-sm font-semibold text-[var(--primary)]">{story.result}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-[var(--primary)] text-white border-none shadow-[var(--shadow)] reveal" style={sectionDelay}>
            <CardContent className="py-12">
              <h2 className="text-3xl sm:text-4xl mb-4">Ready to make a difference?</h2>
              <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto mb-8">
                Join EcoEats today and be part of the solution. Whether you need support, want to donate, 
                or can provide food, there's a place for you in our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Get Involved
                  </Button>
                </Link>
                <Link href="/spotlight">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-[var(--surface)] text-[var(--primary)] border-[var(--surface)] hover:bg-[var(--surface)]/90"
                  >
                    See Our Heroes
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
