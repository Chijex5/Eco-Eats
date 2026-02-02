'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockVouchers, formatCurrency, formatDateTime, getExpiryStatus } from '@/lib/mockData';
import { QRCodeSVG } from 'qrcode.react';
import { useState, use } from 'react';

export default function VoucherDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const voucher = mockVouchers.find((v) => v.id === id);
  const [copied, setCopied] = useState(false);

  if (!voucher) {
    return (
      <div className="page-shell">
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="py-12">
                <h2 className="text-2xl text-[var(--foreground)] mb-4">Voucher Not Found</h2>
                <p className="text-[var(--muted-foreground)] mb-6">
                  The voucher you're looking for doesn't exist.
                </p>
                <Link href="/app/vouchers">
                  <Button size="lg" variant="primary">
                    Back to Wallet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const expiryStatus = getExpiryStatus(voucher.expiresAt);
  const isActive = voucher.status === 'ACTIVE';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link
              href="/app/vouchers"
              className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] mb-6"
            >
              <span className="mr-2">←</span>
              Back to Wallet
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">
                Meal Voucher
              </h1>
              <StatusBadge status={voucher.status} />
            </div>
          </div>

          {isActive ? (
            <>
              <Card className="shadow-[var(--shadow)] mb-6">
                <CardContent className="py-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-6 bg-white rounded-3xl shadow-sm mb-6">
                      <QRCodeSVG
                        value={voucher.qrToken}
                        size={200}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
                      {formatCurrency(voucher.valueKobo)}
                    </h2>
                    <p className="text-[var(--muted-foreground)]">
                      Show this QR code to partner staff
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Backup Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3">
                    If the QR code can't be scanned, share this code:
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-xl border-2 border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3">
                      <code className="text-xl font-mono font-bold text-[var(--foreground)]">
                        {voucher.code}
                      </code>
                    </div>
                    <Button
                      onClick={handleCopyCode}
                      variant="outline"
                      size="md"
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--surface-alt)] border-[var(--border)] mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">📍 How to redeem</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="text-sm text-[var(--muted-foreground)] space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-semibold">
                        1
                      </span>
                      <span>Visit any EcoEats partner location</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-semibold">
                        2
                      </span>
                      <span>Show this screen to the staff member</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-semibold">
                        3
                      </span>
                      <span>They'll scan the QR code or enter the backup code</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-semibold">
                        4
                      </span>
                      <span>Receive your meal - it's that simple!</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="mb-6">
              <CardContent className="py-8 text-center">
                <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mx-auto mb-4">
                  {voucher.status === 'REDEEMED' ? (
                    <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  {voucher.status === 'REDEEMED' ? 'Voucher Already Redeemed' : 'Voucher Not Available'}
                </h3>
                <p className="text-[var(--muted-foreground)] mb-4">
                  {voucher.status === 'REDEEMED'
                    ? `This voucher was redeemed at ${voucher.partnerName || 'a partner location'} on ${formatDateTime(voucher.redeemedAt || '')}`
                    : 'This voucher is no longer available for use'}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Voucher Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <dt className="text-sm font-medium text-[var(--muted-foreground)]">Value</dt>
                  <dd className="text-sm font-semibold text-[var(--foreground)]">
                    {formatCurrency(voucher.valueKobo)}
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <dt className="text-sm font-medium text-[var(--muted-foreground)]">Status</dt>
                  <dd>
                    <StatusBadge status={voucher.status} />
                  </dd>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <dt className="text-sm font-medium text-[var(--muted-foreground)]">Issued</dt>
                  <dd className="text-sm text-[var(--foreground)]">
                    {formatDateTime(voucher.createdAt)}
                  </dd>
                </div>
                {isActive && (
                  <div className="flex justify-between py-2 border-b border-[var(--border)]">
                    <dt className="text-sm font-medium text-[var(--muted-foreground)]">Expires</dt>
                    <dd className={`text-sm font-semibold ${expiryStatus.className}`}>
                      {formatDateTime(voucher.expiresAt)}
                    </dd>
                  </div>
                )}
                {voucher.status === 'REDEEMED' && voucher.redeemedAt && (
                  <>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <dt className="text-sm font-medium text-[var(--muted-foreground)]">Redeemed</dt>
                      <dd className="text-sm text-[var(--foreground)]">
                        {formatDateTime(voucher.redeemedAt)}
                      </dd>
                    </div>
                    {voucher.partnerName && (
                      <div className="flex justify-between py-2">
                        <dt className="text-sm font-medium text-[var(--muted-foreground)]">Location</dt>
                        <dd className="text-sm text-[var(--foreground)]">
                          {voucher.partnerName}
                        </dd>
                      </div>
                    )}
                  </>
                )}
              </dl>
            </CardContent>
          </Card>

          <div className="mt-8 flex gap-4">
            <Link href="/app/vouchers" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Back to Wallet
              </Button>
            </Link>
            <Link href="/app/surplus" className="flex-1">
              <Button variant="primary" size="lg" className="w-full">
                Browse Food
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
