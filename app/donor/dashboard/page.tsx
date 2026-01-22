'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockDonations, formatCurrency, formatDate, formatRelativeTime } from '@/lib/mockData';

export default function DonorDashboard() {
  const totalDonated = mockDonations.reduce((sum, d) => sum + d.amountKobo, 0);
  const totalMealsSponsored = mockDonations.reduce((sum, d) => sum + d.mealsSponsored, 0);
  const completedDonations = mockDonations.filter((d) => d.status === 'COMPLETED').length;

  const recentDonations = mockDonations.slice(0, 3);

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] mb-6"
            >
              <span className="mr-2">←</span>
              Back to Home
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] mb-2">
                  Donor Dashboard
                </h1>
                <p className="text-[var(--muted-foreground)]">
                  Track your donations and see the impact you're making
                </p>
              </div>
              <Link href="/donor/donate">
                <Button size="md" variant="primary">
                  Make a Donation
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-[var(--shadow)]">
              <CardContent className="py-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-semibold mb-1">
                  {formatCurrency(totalDonated)}
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/80">
                  Total Donated
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface)]">
              <CardContent className="py-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-semibold text-[var(--foreground)] mb-1">
                  {totalMealsSponsored}
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Meals Sponsored
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface)]">
              <CardContent className="py-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-semibold text-[var(--foreground)] mb-1">
                  {completedDonations}
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Donations Made
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface)]">
              <CardContent className="py-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-[var(--secondary)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-semibold text-[var(--foreground)] mb-1">
                  {Math.floor(totalMealsSponsored * 2.5)}
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  People Helped
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                {recentDonations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[var(--muted-foreground)]">No donations yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentDonations.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--foreground)]">
                              {formatCurrency(donation.amountKobo)}
                            </p>
                            <p className="text-sm text-[var(--muted-foreground)]">
                              {donation.mealsSponsored} meals • {formatRelativeTime(donation.createdAt)}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={donation.status} />
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6">
                  <Link href="/donor/history">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Donations
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] text-white border-none shadow-[var(--shadow)]">
                <CardContent className="py-6">
                  <h3 className="text-lg font-semibold mb-3">Your Impact</h3>
                  <p className="text-sm text-white/90 mb-4">
                    You've helped provide {totalMealsSponsored} meals to people in need. Thank you for making a difference!
                  </p>
                  <Link href="/donor/impact">
                    <Button variant="secondary" size="sm" className="w-full">
                      View Impact Report
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card hover>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/donor/donate">
                    <Button variant="primary" size="sm" className="w-full">
                      Make a Donation
                    </Button>
                  </Link>
                  <Link href="/donor/history">
                    <Button variant="outline" size="sm" className="w-full">
                      Donation History
                    </Button>
                  </Link>
                  <Link href="/donor/impact">
                    <Button variant="outline" size="sm" className="w-full">
                      Impact Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-[var(--surface-alt)] border-[var(--border)]">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">🎯 SDG 2: Zero Hunger</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Your donations directly contribute to the UN Sustainable Development Goal of ending hunger and ensuring food security.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
