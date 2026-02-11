'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import type { VoucherStatus } from '@/components/VoucherCard';

type Voucher = {
  id: string;
  code: string;
  qr_token: string;
  value_kobo: number;
  status: VoucherStatus;
  expires_at?: string;
  created_at: string;
};

const STATUS_STYLES: Record<VoucherStatus, string> = {
  ACTIVE: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  REDEEMED: 'bg-emerald-100 text-emerald-700',
  EXPIRED: 'bg-amber-100 text-amber-700',
  REVOKED: 'bg-rose-100 text-rose-700',
};

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

export default function VoucherDetailPage() {
  const params = useParams();
  const voucherId = typeof params.id === 'string' ? params.id : '';

  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVoucher = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/vouchers/me');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load vouchers.');
        }
        const data = (await response.json()) as { vouchers: Voucher[] };
        const match = data.vouchers?.find((item) => item.id === voucherId);
        if (!match) {
          throw new Error('Voucher not found.');
        }
        setVoucher(match);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load voucher.');
      } finally {
        setIsLoading(false);
      }
    };

    if (voucherId) {
      loadVoucher();
    } else {
      setIsLoading(false);
      setError('Missing voucher id.');
    }
  }, [voucherId]);

  const detailRows = useMemo(() => {
    if (!voucher) return [];
    return [
      { label: 'Voucher code', value: voucher.code },
      { label: 'Value', value: formatCurrency(voucher.value_kobo) },
      { label: 'Expires', value: formatDate(voucher.expires_at) },
      { label: 'Issued on', value: formatDate(voucher.created_at) },
    ];
  }, [voucher]);

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Voucher detail</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Show this voucher at pickup.</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Voucher codes and QR tokens are only available while a voucher is active.
            </p>
          </section>

          {isLoading ? (
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="py-10 text-sm text-[var(--muted-foreground)]">Loading voucher...</CardContent>
            </Card>
          ) : error || !voucher ? (
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="py-10 space-y-4">
                <p className="text-sm text-rose-600">{error || 'Voucher not found.'}</p>
                <Link href="/app/vouchers">
                  <Button size="sm" variant="outline">Back to vouchers</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                {voucher.status === 'ACTIVE' ? (
                  <>
                    <QRCodeDisplay
                      value={voucher.qr_token}
                      label="Voucher QR token"
                      helperText="Scan this QR token at the partner counter."
                    />
                    <Card className="shadow-[var(--shadow)]">
                      <CardHeader>
                        <CardTitle>Backup code</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold text-[var(--foreground)] tracking-[0.2em]">
                          {voucher.code}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)] mt-2">
                          Share this code if the QR scanner is unavailable.
                        </p>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="shadow-[var(--shadow)]">
                    <CardHeader>
                      <CardTitle>Code unavailable</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-[var(--muted-foreground)]">
                      This voucher is currently {voucher.status.toLowerCase()}. QR and backup code are hidden for
                      non-active vouchers.
                    </CardContent>
                  </Card>
                )}
              </div>

              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle>Voucher details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[voucher.status]}`}
                  >
                    {voucher.status}
                  </span>
                  <div className="space-y-3 text-sm">
                    {detailRows.map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-4">
                        <span className="text-[var(--muted-foreground)]">{row.label}</span>
                        <span className="font-semibold text-[var(--foreground)]">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/app/vouchers">
                    <Button variant="outline" size="sm">Back to wallet</Button>
                  </Link>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
