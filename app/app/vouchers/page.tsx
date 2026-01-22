'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockVouchers, formatCurrency, formatDate, getExpiryStatus } from '@/lib/mockData';
import { useState } from 'react';

export default function Vouchers() {
  const [filter, setFilter] = useState<'all' | 'active' | 'redeemed'>('all');

  const filteredVouchers = mockVouchers.filter((voucher) => {
    if (filter === 'all') return true;
    if (filter === 'active') return voucher.status === 'ACTIVE';
    if (filter === 'redeemed') return voucher.status === 'REDEEMED';
    return true;
  });

  const activeCount = mockVouchers.filter((v) => v.status === 'ACTIVE').length;
  const redeemedCount = mockVouchers.filter((v) => v.status === 'REDEEMED').length;

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
                  My Voucher Wallet
                </h1>
                <p className="text-[var(--muted-foreground)]">
                  Manage and redeem your meal vouchers
                </p>
              </div>
              <Link href="/app/request-help">
                <Button size="md" variant="primary">
                  Request Support
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Card className="bg-[var(--primary)]/5 border-[var(--primary)]/20">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {activeCount}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Active Vouchers
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--surface)]">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {redeemedCount}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Redeemed
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--surface)] sm:col-span-1 col-span-2">
                <CardContent className="py-4">
                  <div className="text-2xl font-semibold text-[var(--foreground)]">
                    {formatCurrency(
                      mockVouchers
                        .filter((v) => v.status === 'ACTIVE')
                        .reduce((sum, v) => sum + v.valueKobo, 0)
                    )}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)] mt-1">
                    Total Value
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
                All ({mockVouchers.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === 'active'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] border border-[var(--border)]'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setFilter('redeemed')}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === 'redeemed'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] border border-[var(--border)]'
                }`}
              >
                Redeemed ({redeemedCount})
              </button>
            </div>
          </div>

          {filteredVouchers.length === 0 ? (
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  No vouchers found
                </h3>
                <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
                  {filter === 'all'
                    ? "You don't have any vouchers yet. Request support to get started."
                    : `You don't have any ${filter} vouchers.`}
                </p>
                {filter === 'all' && (
                  <Link href="/app/request-help">
                    <Button size="lg" variant="primary">
                      Request Support
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredVouchers.map((voucher) => {
                const expiryStatus = getExpiryStatus(voucher.expiresAt);
                return (
                  <Card key={voucher.id} hover className="transition-all">
                    <CardContent className="py-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
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
                                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                                  {formatCurrency(voucher.valueKobo)}
                                </h3>
                                <StatusBadge status={voucher.status} />
                              </div>
                              <p className="text-sm font-mono text-[var(--muted-foreground)]">
                                Code: {voucher.code}
                              </p>
                            </div>
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
                              Issued {formatDate(voucher.createdAt)}
                            </span>
                            {voucher.status === 'ACTIVE' && (
                              <span className={`flex items-center gap-1 ${expiryStatus.className}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {expiryStatus.label}
                              </span>
                            )}
                            {voucher.status === 'REDEEMED' && voucher.partnerName && (
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
                                {voucher.partnerName}
                              </span>
                            )}
                          </div>
                        </div>

                        {voucher.status === 'ACTIVE' && (
                          <div className="flex-shrink-0">
                            <Link href={`/app/vouchers/${voucher.id}`}>
                              <Button size="sm" variant="primary">
                                Use Voucher
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-8">
            <Card className="bg-[var(--surface-alt)] border-[var(--border)]">
              <CardContent className="py-6">
                <h3 className="font-semibold text-[var(--foreground)] mb-3">💡 Tips for using vouchers</h3>
                <ul className="text-sm text-[var(--muted-foreground)] space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    <span>Each voucher can only be used once at participating partner locations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    <span>Show the QR code or share the code with staff when redeeming</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    <span>Vouchers expire after the date shown - use them before they expire</span>
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
