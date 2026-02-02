'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockSurplusListings, formatDateTime } from '@/lib/mockData';

export default function SurplusListings() {
  const activeListings = mockSurplusListings.filter((listing) => listing.status === 'ACTIVE');
  const claimedListings = mockSurplusListings.filter((listing) => listing.status === 'CLAIMED');

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    if (diffMs < 0) return { text: 'Expired', className: 'text-[var(--destructive)]', urgent: false };
    if (diffHours < 2) return { text: `${diffHours}h ${diffMins}m left`, className: 'text-[var(--secondary)]', urgent: true };
    if (diffHours < 24) return { text: `${diffHours} hours left`, className: 'text-[var(--muted-foreground)]', urgent: false };
    return { text: formatDateTime(deadline), className: 'text-[var(--muted-foreground)]', urgent: false };
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
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
                  Available Surplus Food
                </h1>
                <p className="text-[var(--muted-foreground)]">
                  Claim fresh food packs from partner locations
                </p>
              </div>
              <Link href="/app/vouchers">
                <Button size="md" variant="outline">
                  My Vouchers
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Card className="bg-[var(--primary)]/5 border-[var(--primary)]/20">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {activeListings.length}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Available Now
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--surface)]">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {mockSurplusListings.reduce((sum, l) => sum + (l.quantityAvailable - l.quantityClaimed), 0)}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Total Packs
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--surface)] sm:col-span-1 col-span-2">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {mockSurplusListings.length}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Locations
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {activeListings.length === 0 && claimedListings.length === 0 ? (
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  No surplus food available
                </h3>
                <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
                  Check back later or request a meal voucher for immediate support.
                </p>
                <Link href="/app/request-help">
                  <Button size="lg" variant="primary">
                    Request Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {activeListings.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                    Available for Pickup
                  </h2>
                  <div className="space-y-4">
                    {activeListings.map((listing) => {
                      const remaining = listing.quantityAvailable - listing.quantityClaimed;
                      const timeRemaining = getTimeRemaining(listing.pickupDeadline);
                      return (
                        <Card key={listing.id} hover className="transition-all">
                          <CardContent className="py-5">
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 flex items-center justify-center">
                                  <svg
                                    className="w-10 h-10 text-[var(--primary)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                  </svg>
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <div>
                                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                                      {listing.title}
                                    </h3>
                                    <p className="text-sm text-[var(--muted-foreground)] mb-2">
                                      {listing.description}
                                    </p>
                                  </div>
                                  {timeRemaining.urgent && (
                                    <Badge variant="warning" className="flex-shrink-0">
                                      Urgent
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)] mb-3">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    {listing.partnerLocation}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                      />
                                    </svg>
                                    {remaining} pack{remaining !== 1 ? 's' : ''} left
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                  <svg
                                    className={`w-4 h-4 ${timeRemaining.className}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className={`font-medium ${timeRemaining.className}`}>
                                    Pickup by: {timeRemaining.text}
                                  </span>
                                </div>
                              </div>

                              <div className="flex-shrink-0 flex items-start">
                                <Link href={`/app/surplus/${listing.id}`}>
                                  <Button size="sm" variant="primary">
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {claimedListings.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                    Recently Claimed
                  </h2>
                  <div className="space-y-4">
                    {claimedListings.map((listing) => (
                      <Card key={listing.id} className="opacity-60">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-[var(--foreground)] mb-1">
                                {listing.title}
                              </h3>
                              <p className="text-sm text-[var(--muted-foreground)]">
                                {listing.partnerLocation}
                              </p>
                            </div>
                            <Badge variant="default">All Claimed</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-8">
            <Card className="bg-[var(--surface-alt)] border-[var(--border)]">
              <CardContent className="py-6">
                <h3 className="font-semibold text-[var(--foreground)] mb-3">💡 About surplus food</h3>
                <ul className="text-sm text-[var(--muted-foreground)] space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    <span>Surplus food is fresh, safe, and ready for immediate pickup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    <span>First come, first served - claim quickly before packs run out</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    <span>You'll receive a pickup code after claiming - bring it to the location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    <span>Pickup before the deadline - food cannot be held after expiration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
