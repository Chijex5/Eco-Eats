'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockSurplusListings, formatDateTime } from '@/lib/mockData';
import { useState, use } from 'react';

export default function SurplusDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = mockSurplusListings.find((l) => l.id === id);
  const [claimed, setClaimed] = useState(false);
  const [pickupCode, setPickupCode] = useState('');

  if (!listing) {
    return (
      <div className="page-shell">
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="py-12">
                <h2 className="text-2xl text-[var(--foreground)] mb-4">Listing Not Found</h2>
                <p className="text-[var(--muted-foreground)] mb-6">
                  The surplus listing you're looking for doesn't exist or is no longer available.
                </p>
                <Link href="/app/surplus">
                  <Button size="lg" variant="primary">
                    Browse Listings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const remaining = listing.quantityAvailable - listing.quantityClaimed;
  const isAvailable = listing.status === 'ACTIVE' && remaining > 0;

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);

    if (diffMs < 0) return { text: 'Expired', className: 'text-[var(--destructive)]', urgent: false };
    if (diffHours < 2) return { text: `${diffHours}h ${diffMins}m remaining`, className: 'text-[var(--secondary)]', urgent: true };
    if (diffHours < 24) return { text: `${diffHours} hours remaining`, className: 'text-[var(--muted-foreground)]', urgent: false };
    return { text: formatDateTime(deadline), className: 'text-[var(--muted-foreground)]', urgent: false };
  };

  const timeRemaining = getTimeRemaining(listing.pickupDeadline);

  const handleClaim = () => {
    // In Phase B, this would call the API
    const generatedCode = `PKP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setPickupCode(generatedCode);
    setClaimed(true);
  };

  if (claimed) {
    return (
      <div className="page-shell">
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-[var(--shadow)] text-center mb-6">
              <CardContent className="py-12">
                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-[var(--primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl text-[var(--foreground)] mb-4">
                  Successfully Claimed!
                </h2>
                <p className="text-[var(--muted-foreground)] mb-2">
                  Your food pack has been reserved. Use the pickup code below.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)] mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Your Pickup Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border-2 border-[var(--primary)] bg-[var(--primary)]/5 p-6 text-center mb-6">
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">Show this code at pickup</p>
                  <code className="text-3xl font-mono font-bold text-[var(--foreground)]">
                    {pickupCode}
                  </code>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">Pickup Location</p>
                      <p className="text-[var(--muted-foreground)]">{listing.partnerName}</p>
                      <p className="text-[var(--muted-foreground)]">{listing.partnerLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${timeRemaining.className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">Pickup Deadline</p>
                      <p className={timeRemaining.className}>{formatDateTime(listing.pickupDeadline)}</p>
                      <p className={`font-semibold ${timeRemaining.className}`}>{timeRemaining.text}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">What You're Getting</p>
                      <p className="text-[var(--muted-foreground)]">{listing.title}</p>
                      <p className="text-[var(--muted-foreground)]">{listing.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-alt)] border-[var(--border)] mb-6">
              <CardContent className="py-6">
                <h3 className="font-semibold text-[var(--foreground)] mb-3">📍 Pickup Instructions</h3>
                <ol className="text-sm text-[var(--muted-foreground)] space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-semibold">
                      1
                    </span>
                    <span>Go to the pickup location before the deadline</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-semibold">
                      2
                    </span>
                    <span>Show your pickup code to the staff</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-semibold">
                      3
                    </span>
                    <span>Staff will verify and hand you the food pack</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-semibold">
                      4
                    </span>
                    <span>Enjoy your meal!</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/app/surplus" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  Browse More Food
                </Button>
              </Link>
              <Link href="/app/history" className="flex-1">
                <Button variant="primary" size="lg" className="w-full">
                  View History
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              href="/app/surplus"
              className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] mb-6"
            >
              <span className="mr-2">←</span>
              Back to Listings
            </Link>
          </div>

          <Card className="shadow-[var(--shadow)] mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl sm:text-3xl text-[var(--foreground)]">
                  {listing.title}
                </h1>
                {timeRemaining.urgent && (
                  <Badge variant="warning">Urgent</Badge>
                )}
              </div>

              <p className="text-[var(--muted-foreground)] mb-6">
                {listing.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                        Available
                      </p>
                      <p className="text-lg font-semibold text-[var(--foreground)]">
                        {remaining} pack{remaining !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      timeRemaining.urgent ? 'bg-[var(--secondary)]/10' : 'bg-[var(--primary)]/10'
                    }`}>
                      <svg className={`w-5 h-5 ${timeRemaining.urgent ? 'text-[var(--secondary)]' : 'text-[var(--primary)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                        Time Left
                      </p>
                      <p className={`text-lg font-semibold ${timeRemaining.className}`}>
                        {timeRemaining.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Partner</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{listing.partnerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Pickup Location</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{listing.partnerLocation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Pickup Deadline</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{formatDateTime(listing.pickupDeadline)}</p>
                  </div>
                </div>
              </div>

              {isAvailable ? (
                <Button
                  onClick={handleClaim}
                  size="lg"
                  variant="primary"
                  className="w-full"
                >
                  Claim This Food Pack
                </Button>
              ) : (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4 text-center">
                  <p className="text-[var(--muted-foreground)] font-semibold">
                    {listing.status === 'CLAIMED' ? 'All packs have been claimed' : 'This listing is no longer available'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-alt)] border-[var(--border)]">
            <CardContent className="py-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-3">Important Information</h3>
              <ul className="text-sm text-[var(--muted-foreground)] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary)] mt-1">•</span>
                  <span>You can claim up to {listing.claimLimitPerUser} pack{listing.claimLimitPerUser > 1 ? 's' : ''} per person</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary)] mt-1">•</span>
                  <span>Must be picked up before the deadline - food cannot be held</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary)] mt-1">•</span>
                  <span>Bring your pickup code for verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary)] mt-1">•</span>
                  <span>Food is fresh and safe - provided by verified partners</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
