'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { mockActivityHistory, formatRelativeTime, formatDateTime } from '@/lib/mockData';

export default function History() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'voucher_received':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
        );
      case 'voucher_redeemed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'surplus_claimed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      case 'request_submitted':
      case 'request_approved':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[var(--primary)] text-white';
      case 'active':
        return 'bg-[var(--accent)] text-white';
      case 'pending':
        return 'bg-[var(--secondary)] text-white';
      default:
        return 'bg-[var(--muted)] text-[var(--foreground)]';
    }
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
                  Activity History
                </h1>
                <p className="text-[var(--muted-foreground)]">
                  Track your requests, vouchers, and food claims
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-[var(--primary)]/5 border-[var(--primary)]/20">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {mockActivityHistory.filter(a => a.status === 'completed').length}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Completed
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--surface)]">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {mockActivityHistory.filter(a => a.status === 'active').length}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Active
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--surface)]">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {mockActivityHistory.length}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Total
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            {mockActivityHistory.length === 0 ? (
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                    No activity yet
                  </h3>
                  <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
                    Your activity history will appear here once you start using EcoEats.
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
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  Recent Activity
                </h2>
                
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[var(--border)]" />
                  
                  <div className="space-y-6">
                    {mockActivityHistory.map((activity, index) => (
                      <div key={activity.id} className="relative flex gap-4">
                        <div className={`flex-shrink-0 w-16 h-16 rounded-full ${getStatusColor(activity.status)} flex items-center justify-center z-10 shadow-sm`}>
                          {getActivityIcon(activity.type)}
                        </div>

                        <Card hover className="flex-1 transition-all">
                          <CardContent className="py-4">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-[var(--foreground)] mb-1">
                                  {activity.title}
                                </h3>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                  {activity.description}
                                </p>
                              </div>
                              {activity.status && (
                                <span className="flex-shrink-0 text-xs uppercase tracking-[0.1em] font-semibold text-[var(--muted-foreground)]">
                                  {activity.status}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>{formatRelativeTime(activity.timestamp)}</span>
                              <span className="text-[var(--border)]">•</span>
                              <span>{formatDateTime(activity.timestamp)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Link href="/app/vouchers">
              <Card hover className="h-full">
                <CardContent className="py-5 text-center">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">Vouchers</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">View your wallet</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/surplus">
              <Card hover className="h-full">
                <CardContent className="py-5 text-center">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">Surplus Food</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Browse listings</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/request-help">
              <Card hover className="h-full">
                <CardContent className="py-5 text-center">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">Request Help</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Get support</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
