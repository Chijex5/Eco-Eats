'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockVouchers, formatCurrency, formatDate, formatDeadline } from '@/lib/mockData';

export default function VouchersPage() {
  const activeVouchers = mockVouchers.filter(v => v.status === 'ACTIVE');
  const redeemedVouchers = mockVouchers.filter(v => v.status === 'REDEEMED');
  const totalValue = activeVouchers.reduce((sum, v) => sum + v.valueKobo, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Active</Badge>;
      case 'REDEEMED':
        return <Badge variant="default">Redeemed</Badge>;
      case 'EXPIRED':
        return <Badge variant="error">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                <span>💳</span>
                <span>My Vouchers</span>
              </div>
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                Your Meal Vouchers
              </h1>
            </div>
            <Link href="/app/request-help">
              <Button size="lg">
                <span className="mr-2">➕</span>
                Request Support
              </Button>
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-lg">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Total Available</p>
                    <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
                  </div>
                  <div className="text-5xl opacity-80">💰</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/80 text-white border-none shadow-lg">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Active Vouchers</p>
                    <p className="text-3xl font-bold">{activeVouchers.length}</p>
                  </div>
                  <div className="text-5xl opacity-80">🎫</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/80 text-white border-none shadow-lg">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Used This Month</p>
                    <p className="text-3xl font-bold">{redeemedVouchers.length}</p>
                  </div>
                  <div className="text-5xl opacity-80">✓</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Vouchers */}
        {activeVouchers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
              Active Vouchers
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {activeVouchers.map((voucher) => (
                <Link key={voucher.id} href={`/app/vouchers/${voucher.id}`}>
                  <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-[var(--primary)]">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-2xl">
                              {formatCurrency(voucher.valueKobo)}
                            </CardTitle>
                            {getStatusBadge(voucher.status)}
                          </div>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            Code: <span className="font-mono font-semibold text-[var(--foreground)]">{voucher.code}</span>
                          </p>
                        </div>
                        <div className="text-5xl">🎫</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--muted-foreground)]">Expires:</span>
                          <span className={`font-semibold ${
                            new Date(voucher.expiresAt).getTime() - Date.now() < 2 * 24 * 60 * 60 * 1000
                              ? 'text-[var(--destructive)]'
                              : 'text-[var(--foreground)]'
                          }`}>
                            {formatDeadline(voucher.expiresAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[var(--muted-foreground)]">Issued:</span>
                          <span className="text-[var(--foreground)] font-medium">
                            {formatDate(voucher.createdAt)}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-[var(--border)]">
                          <Button variant="primary" size="sm" className="w-full">
                            View QR Code →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeVouchers.length === 0 && (
          <Card className="text-center bg-gradient-to-br from-[var(--muted)] to-white border-2 border-dashed border-[var(--border)]">
            <CardContent className="py-16">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                No Active Vouchers
              </h3>
              <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
                You don't have any active vouchers at the moment. Request support to receive meal vouchers.
              </p>
              <Link href="/app/request-help">
                <Button size="lg">
                  Request Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Redeemed Vouchers */}
        {redeemedVouchers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
              Recently Redeemed
            </h2>
            <div className="space-y-4">
              {redeemedVouchers.map((voucher) => (
                <Card key={voucher.id} className="bg-[var(--muted)]/50">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                          ✓
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">
                            {formatCurrency(voucher.valueKobo)} - {voucher.code}
                          </p>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            Redeemed at {voucher.partnerName} • {formatDate(voucher.redeemedAt!)}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(voucher.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* How to Use */}
        <Card className="bg-gradient-to-br from-[var(--accent)]/5 to-white border-[var(--accent)]/20">
          <CardHeader>
            <CardTitle>How to Use Your Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)] mb-1">Visit Partner</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Go to any of our partner restaurants or cafeterias
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)] mb-1">Show QR Code</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Present your voucher QR code or backup code to staff
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)] mb-1">Enjoy Your Meal</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Staff will redeem the voucher and you can enjoy your meal
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
