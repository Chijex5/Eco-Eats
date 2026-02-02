'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockDonations, formatCurrency, formatDate, formatDateTime } from '@/lib/mockData';
import { useState } from 'react';

export default function DonationHistory() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredDonations = mockDonations.filter((donation) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return donation.status === 'COMPLETED';
    if (filter === 'pending') return donation.status === 'PENDING';
    return true;
  });

  const totalDonated = mockDonations
    .filter((d) => d.status === 'COMPLETED')
    .reduce((sum, d) => sum + d.amountKobo, 0);
  const totalMeals = mockDonations
    .filter((d) => d.status === 'COMPLETED')
    .reduce((sum, d) => sum + d.mealsSponsored, 0);

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/donor/dashboard"
              className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] mb-6"
            >
              <span className="mr-2">←</span>
              Back to Dashboard
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] mb-2">
                  Donation History
                </h1>
                <p className="text-[var(--muted-foreground)]">
                  View all your past donations and receipts
                </p>
              </div>
              <Link href="/donor/donate">
                <Button size="md" variant="primary">
                  Make a Donation
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Card className="bg-[var(--primary)]/5 border-[var(--primary)]/20">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {formatCurrency(totalDonated)}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Total Donated
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--surface)]">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {mockDonations.length}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Donations Made
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--surface)] sm:col-span-1 col-span-2">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {totalMeals}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Meals Sponsored
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === 'all'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] border border-[var(--border)]'
                }`}
              >
                All ({mockDonations.length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === 'completed'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] border border-[var(--border)]'
                }`}
              >
                Completed ({mockDonations.filter((d) => d.status === 'COMPLETED').length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === 'pending'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] border border-[var(--border)]'
                }`}
              >
                Pending ({mockDonations.filter((d) => d.status === 'PENDING').length})
              </button>
            </div>
          </div>

          {filteredDonations.length === 0 ? (
            <Card className="text-center">
              <CardContent className="py-12">
                <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[var(--muted-foreground)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  No donations found
                </h3>
                <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
                  {filter === 'all'
                    ? "You haven't made any donations yet. Start making a difference today!"
                    : `You don't have any ${filter} donations.`}
                </p>
                {filter === 'all' && (
                  <Link href="/donor/donate">
                    <Button size="lg" variant="primary">
                      Make Your First Donation
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <Card key={donation.id} hover className="transition-all">
                  <CardContent className="py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                          <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                              {formatCurrency(donation.amountKobo)}
                            </h3>
                            <p className="text-sm text-[var(--muted-foreground)]">
                              {donation.donationType.replace('_', ' ').toLowerCase()}
                            </p>
                          </div>
                          <StatusBadge status={donation.status} />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatDate(donation.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            {donation.mealsSponsored} meal{donation.mealsSponsored > 1 ? 's' : ''} sponsored
                          </span>
                        </div>
                      </div>

                      {donation.status === 'COMPLETED' && (
                        <div className="flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => alert('Receipt download will be available in Phase B')}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                              />
                            </svg>
                            Receipt
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <Card hover>
              <CardHeader>
                <CardTitle className="text-lg">Make Another Donation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                  Continue making a difference by funding more meals for those in need.
                </p>
                <Link href="/donor/donate">
                  <Button variant="primary" size="sm" className="w-full">
                    Donate Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader>
                <CardTitle className="text-lg">View Your Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                  See detailed statistics about the impact your donations have made.
                </p>
                <Link href="/donor/impact">
                  <Button variant="outline" size="sm" className="w-full">
                    Impact Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
