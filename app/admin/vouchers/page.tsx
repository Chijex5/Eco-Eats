'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type VoucherSummary = {
  issued: number;
  active: number;
  redeemed: number;
  expiringSoon: number;
};

export default function AdminVouchersPage() {
  const [summary, setSummary] = useState<VoucherSummary | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/admin/vouchers/summary');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load voucher summary.');
        }
        const data = (await response.json()) as { summary: VoucherSummary; tips: string[] };
        setSummary(data.summary);
        setTips(data.tips ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load voucher summary.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, []);

  const voucherStats = useMemo(
    () => [
      { label: 'Active vouchers', value: summary?.active ?? 0, detail: 'Redeemable today' },
      { label: 'Redeemed vouchers', value: summary?.redeemed ?? 0, detail: 'Meals served' },
      { label: 'Expiring soon', value: summary?.expiringSoon ?? 0, detail: 'Next 7 days' },
    ],
    [summary]
  );

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)] font-semibold">
                Admin vouchers
              </p>
              <h1 className="text-4xl sm:text-5xl text-[var(--foreground)] font-semibold">
                Issue and monitor vouchers.
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                Manage voucher issuance from approved requests and track redemption status.
              </p>
            </div>
            <Link href="/admin/requests">
              <Button size="lg">Issue vouchers</Button>
            </Link>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {voucherStats.map((stat) => (
              <Card key={stat.label} className="shadow-[var(--shadow)]">
                <CardContent className="pt-6 pb-6 space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)] font-semibold">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-semibold text-[var(--foreground)]">{stat.value}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{stat.detail}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Voucher workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)]">
                <p>1. Review approved requests on the Requests page.</p>
                <p>2. Issue voucher value and expiry tailored to the beneficiary need.</p>
                <p>3. Notify partners and beneficiaries to coordinate redemption.</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Automated voucher analytics will populate once the impact API is enabled.
                </p>
                <Link href="/admin/requests">
                  <Button variant="outline" size="sm">Go to request review</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Operational tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                {isLoading ? (
                  <p>Loading tips...</p>
                ) : error ? (
                  <p className="text-rose-600">{error}</p>
                ) : (
                  tips.map((tip) => <p key={tip}>• {tip}</p>)
                )}
                <Link href="/admin/impact" className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Review redemption impact
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
