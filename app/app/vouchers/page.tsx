'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { VoucherCard, type VoucherStatus } from '@/components/VoucherCard';

type Voucher = {
  id: string;
  code: string;
  qr_token: string;
  value_kobo: number;
  status: VoucherStatus;
  expires_at?: string;
  created_at: string;
};

const reminders = [
  'Show the QR code at the partner counter.',
  'Arrive during the listed pickup window.',
  'Let us know if a voucher is about to expire.',
];

const formatCurrency = (valueKobo: number) => {
  const value = valueKobo / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value?: string) => {
  if (!value) return 'No expiry date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No expiry date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function VoucherWalletPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVouchers = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/vouchers/me');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load vouchers.');
        }
        const data = (await response.json()) as { vouchers: Voucher[] };
        setVouchers(data.vouchers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load vouchers.');
      } finally {
        setIsLoading(false);
      }
    };

    loadVouchers();
  }, []);

  const activeCount = useMemo(
    () => vouchers.filter((voucher) => voucher.status === 'ACTIVE').length,
    [vouchers]
  );

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Voucher wallet</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Your vouchers in one place.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Keep track of every voucher, redemption code, and pickup location. Tap a voucher to view the QR code when
              you are ready to redeem.
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
              Active vouchers: {activeCount}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/beneficiaries/use-voucher">
                <Button size="lg">How to redeem</Button>
              </Link>
              <Link href="/app/request-help">
                <Button variant="outline" size="lg">Request more support</Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-4">
            {isLoading ? (
              <Card className="shadow-[var(--shadow)]">
                <CardContent className="py-8 text-sm text-[var(--muted-foreground)]">
                  Loading your vouchers...
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="shadow-[var(--shadow)]">
                <CardContent className="py-8 text-sm text-rose-600">{error}</CardContent>
              </Card>
            ) : vouchers.length === 0 ? (
              <Card className="shadow-[var(--shadow)]">
                <CardContent className="py-8 text-sm text-[var(--muted-foreground)] space-y-3">
                  <p>You don&apos;t have any vouchers yet. Submit a support request to get started.</p>
                  <Link href="/app/request-help">
                    <Button size="sm">Request support</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              vouchers.map((voucher) => (
                <div key={voucher.id} className="flex flex-col gap-3">
                  <VoucherCard
                    code={voucher.code}
                    status={voucher.status}
                    valueLabel={formatCurrency(voucher.value_kobo)}
                    expiryLabel={formatDate(voucher.expires_at)}
                  />
                  <div className="flex justify-end">
                    <Link href={`/app/vouchers/${voucher.id}`}>
                      <Button variant="outline" size="sm">View QR code</Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </section>

          <section>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Reminder checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
                {reminders.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
                <Link href="/contact">
                  <Button variant="outline" size="sm">Get help</Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
