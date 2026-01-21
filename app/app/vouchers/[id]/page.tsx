'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockVouchers, formatCurrency, formatDate, formatDeadline } from '@/lib/mockData';

export default function VoucherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const voucher = mockVouchers.find(v => v.id === resolvedParams.id);
  const now = Date.now();

  if (!voucher) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="py-16">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                Voucher Not Found
              </h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                The voucher you're looking for doesn&apos;t exist or has been removed.
              </p>
              <Button onClick={() => router.push('/app/vouchers')}>
                Back to Vouchers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

  const isActive = voucher.status === 'ACTIVE';
  const isExpiringSoon = new Date(voucher.expiresAt).getTime() - now < 2 * 24 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/app/vouchers')}
          className="mb-6"
        >
          ← Back to Vouchers
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Ticket className="w-4 h-4" />
            <span>Voucher Details</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
            {formatCurrency(voucher.valueKobo)}
          </h1>
          {getStatusBadge(voucher.status)}
        </div>

        {/* Warning Banner */}
        {isActive && isExpiringSoon && (
          <Card className="mb-8 bg-gradient-to-br from-[var(--secondary)]/10 to-white border-2 border-[var(--secondary)]">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">
                    Expiring Soon!
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    This voucher expires in {formatDeadline(voucher.expiresAt)}. 
                    Please use it before it expires.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code Card */}
        {isActive && (
          <Card className="mb-8 bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]">
            <CardHeader className="text-center">
              <CardTitle>Show This QR Code to Redeem</CardTitle>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Present this code to staff at any partner location
              </p>
            </CardHeader>
            <CardContent>
              {/* QR Code Display */}
              <div className="bg-white rounded-2xl p-8 mb-6 shadow-inner border-2 border-[var(--border)]">
                <div className="aspect-square max-w-sm mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  {/* Simulated QR Code - In Phase B, this will be a real QR code */}
                  <div className="text-center">
                    <div className="text-8xl mb-4">📱</div>
                    <p className="text-sm text-gray-600 font-mono">
                      {voucher.qrToken}
                    </p>
                  </div>
                </div>
              </div>

              {/* Backup Code */}
              <div className="bg-[var(--muted)] rounded-xl p-6 border border-[var(--border)]">
                <p className="text-sm text-[var(--muted-foreground)] mb-3 text-center">
                  <span className="font-semibold">Backup Code:</span> Use this if QR scan doesn&apos;t work
                </p>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold font-mono tracking-wider text-[var(--primary)]">
                    {voucher.code}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voucher Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Voucher Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Value</span>
                <span className="font-semibold text-lg text-[var(--foreground)]">
                  {formatCurrency(voucher.valueKobo)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Status</span>
                {getStatusBadge(voucher.status)}
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Voucher Code</span>
                <span className="font-mono font-semibold text-[var(--foreground)]">
                  {voucher.code}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Issued Date</span>
                <span className="font-medium text-[var(--foreground)]">
                  {formatDate(voucher.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Expiry Date</span>
                <span className={`font-medium ${
                  isExpiringSoon ? 'text-[var(--destructive)]' : 'text-[var(--foreground)]'
                }`}>
                  {formatDeadline(voucher.expiresAt)}
                </span>
              </div>
              {voucher.redeemedAt && (
                <>
                  <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                    <span className="text-[var(--muted-foreground)]">Redeemed Date</span>
                    <span className="font-medium text-[var(--foreground)]">
                      {formatDate(voucher.redeemedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-[var(--muted-foreground)]">Redeemed At</span>
                    <span className="font-medium text-[var(--foreground)]">
                      {voucher.partnerName}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* How to Redeem */}
        {isActive && (
          <Card className="bg-gradient-to-br from-[var(--accent)]/5 to-white border-[var(--accent)]/20">
            <CardHeader>
              <CardTitle>How to Redeem This Voucher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)] mb-1">
                      Visit a Partner Location
                    </h4>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Go to any of our partner restaurants, cafeterias, or food providers. 
                      You can find a list of partners on our website.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)] mb-1">
                      Show Your QR Code
                    </h4>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Present this page to the staff and they will scan the QR code. 
                      If scanning doesn&apos;t work, they can manually enter the backup code.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)] mb-1">
                      Enjoy Your Meal
                    </h4>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Once the voucher is confirmed, you can select your meal up to the voucher value. 
                      The voucher will be marked as redeemed after use.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => router.push('/app/vouchers')}
          >
            Back to All Vouchers
          </Button>
          {isActive && (
            <Button
              size="lg"
              className="flex-1"
              onClick={() => window.print()}
            >
              🖨️ Print Voucher
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
