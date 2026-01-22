'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockDonations, formatCurrency, formatDate } from '@/lib/mockData';

export default function DonorImpact() {
  const totalDonated = mockDonations
    .filter((d) => d.status === 'COMPLETED')
    .reduce((sum, d) => sum + d.amountKobo, 0);
  const totalMeals = mockDonations
    .filter((d) => d.status === 'COMPLETED')
    .reduce((sum, d) => sum + d.mealsSponsored, 0);
  const peopleHelped = Math.floor(totalMeals * 2.5);
  const firstDonation = mockDonations[mockDonations.length - 1];

  const impactStats = [
    {
      value: totalMeals,
      label: 'Meals Provided',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: 'from-[var(--primary)] to-[var(--primary-dark)]',
    },
    {
      value: peopleHelped,
      label: 'People Supported',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: 'from-[var(--accent)] to-[var(--primary)]',
    },
    {
      value: mockDonations.filter((d) => d.status === 'COMPLETED').length,
      label: 'Donations Made',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'from-[var(--secondary)] to-[var(--accent)]',
    },
    {
      value: `${Math.floor((totalMeals / 90) * 100) / 10}%`,
      label: 'SDG 2 Progress',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      color: 'from-[var(--primary)] to-[var(--accent)]',
    },
  ];

  const milestones = [
    {
      meals: 10,
      title: 'First Steps',
      description: 'Provided meals for 10 people',
      achieved: totalMeals >= 10,
    },
    {
      meals: 25,
      title: 'Making Waves',
      description: 'Supported a whole community',
      achieved: totalMeals >= 25,
    },
    {
      meals: 50,
      title: 'Change Maker',
      description: 'Half a hundred lives touched',
      achieved: totalMeals >= 50,
    },
    {
      meals: 100,
      title: 'Impact Champion',
      description: 'Century of meals provided',
      achieved: totalMeals >= 100,
    },
  ];

  const stories = [
    {
      name: 'Sarah M.',
      story: 'Thanks to donors like you, I could focus on my studies without worrying about my next meal.',
      meals: 15,
      date: '2 weeks ago',
    },
    {
      name: 'James O.',
      story: 'The support I received helped me get back on my feet during a difficult time.',
      meals: 8,
      date: '1 month ago',
    },
    {
      name: 'Community Kitchen',
      story: 'Your donations enabled us to serve 50+ meals this month to families in need.',
      meals: 50,
      date: '3 weeks ago',
    },
  ];

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              href="/donor/dashboard"
              className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] mb-6"
            >
              <span className="mr-2">←</span>
              Back to Dashboard
            </Link>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] mb-3">
                Your Impact Dashboard
              </h1>
              <p className="text-[var(--muted-foreground)] text-lg">
                See the real difference your generosity is making in the fight against hunger
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {impactStats.map((stat, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className={`py-6 bg-gradient-to-br ${stat.color} text-white`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-semibold mb-1">{stat.value}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/90">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Achievement Milestones</CardTitle>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">
                  Celebrate your journey of making a difference
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                        milestone.achieved
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border)] bg-[var(--surface-alt)] opacity-60'
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          milestone.achieved
                            ? 'bg-[var(--primary)] text-white'
                            : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                        }`}
                      >
                        {milestone.achieved ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[var(--foreground)]">{milestone.title}</h3>
                          {milestone.achieved && (
                            <Badge variant="success" className="text-xs">
                              Achieved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] mb-1">{milestone.description}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{milestone.meals} meals milestone</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-[var(--shadow)]">
                <CardContent className="py-6">
                  <h3 className="text-lg font-semibold mb-3">Total Contribution</h3>
                  <div className="text-4xl font-bold mb-2">{formatCurrency(totalDonated)}</div>
                  <p className="text-sm text-white/90 mb-4">
                    Since {formatDate(firstDonation?.createdAt)}
                  </p>
                  <div className="rounded-xl bg-white/20 p-3">
                    <p className="text-xs text-white/90">
                      Your donations have provided <strong>{totalMeals} meals</strong> to people in need
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card hover>
                <CardHeader>
                  <CardTitle className="text-lg">Continue Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/donor/donate">
                    <Button variant="primary" size="sm" className="w-full">
                      Make a Donation
                    </Button>
                  </Link>
                  <Link href="/donor/history">
                    <Button variant="outline" size="sm" className="w-full">
                      View History
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Success Stories</CardTitle>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Real stories from people your donations have helped
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-lg font-semibold text-[var(--primary)]">
                        {story.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{story.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{story.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-3 italic">
                      "{story.story}"
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[var(--accent)] font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {story.meals} meals received
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-alt)] border-[var(--border)]">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">🌍 Contributing to SDG 2: Zero Hunger</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Your donations are helping achieve the United Nations Sustainable Development Goal 2: 
                    End hunger, achieve food security and improved nutrition, and promote sustainable agriculture.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-6 py-4 text-center">
                    <div className="text-2xl font-bold text-[var(--primary)] mb-1">
                      {Math.floor((totalMeals / 90) * 100) / 10}%
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">Progress Made</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
