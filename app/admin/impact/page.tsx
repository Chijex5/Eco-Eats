'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type ImpactSummary = {
  requests: {
    total: number;
    approved: number;
    declined: number;
    pending: number;
    fulfilled: number;
  };
  vouchers: {
    issued: number;
    redeemed: number;
    active: number;
    expired: number;
    revoked: number;
  };
  meals: {
    funded: number;
    served: number;
  };
  surplus: {
    claimed: number;
    pickedUp: number;
  };
  partners: {
    joined: number;
  };
};

export default function AdminImpactPage() {
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadImpact = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/admin/impact');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load impact summary.');
        }
        const data = (await response.json()) as { summary: ImpactSummary };
        setSummary(data.summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load impact summary.');
      } finally {
        setIsLoading(false);
      }
    };

    loadImpact();
  }, []);

  const metrics = useMemo(
    () => [
      {
        label: 'Total requests',
        value: summary?.requests.total ?? 0,
        detail: `${summary?.requests.pending ?? 0} pending review`,
      },
      {
        label: 'Vouchers issued',
        value: summary?.vouchers.issued ?? 0,
        detail: `${summary?.vouchers.redeemed ?? 0} redeemed`,
      },
      {
        label: 'Meals served',
        value: summary?.meals.served ?? 0,
        detail: 'Redemptions confirmed',
      },
      {
        label: 'Active vouchers',
        value: summary?.vouchers.active ?? 0,
        detail: `${summary?.vouchers.expired ?? 0} expired`,
      },
    ],
    [summary]
  );

  const insights = useMemo(() => {
    if (!summary) return [];
    const redemptionRate = summary.vouchers.issued
      ? Math.round((summary.vouchers.redeemed / summary.vouchers.issued) * 100)
      : 0;

    return [
      `Pending reviews: ${summary.requests.pending} request${summary.requests.pending === 1 ? '' : 's'}.`,
      summary.vouchers.issued > 0
        ? `Voucher redemption rate is ${redemptionRate}% (${summary.vouchers.redeemed}/${summary.vouchers.issued}).`
        : 'Voucher redemption rate will appear once vouchers are issued.',
      `Surplus packs picked up: ${summary.surplus.pickedUp}.`,
    ];
  }, [summary]);

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)] font-semibold">
                Admin impact
              </p>
              <h1 className="text-4xl sm:text-5xl text-[var(--foreground)] font-semibold">
                Measure meals served.
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                Track request approvals, voucher issuance, and redemptions across the EcoEats network.
              </p>
            </div>
            <Link href="/admin/requests">
              <Button variant="outline" size="lg">Review requests</Button>
            </Link>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.label} className="shadow-[var(--shadow)]">
                <CardContent className="pt-6 pb-6 space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)] font-semibold">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-semibold text-[var(--foreground)]">{metric.value}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{metric.detail}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Impact insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                {isLoading ? (
                  <p>Loading insights...</p>
                ) : error ? (
                  <p className="text-rose-600">{error}</p>
                ) : (
                  insights.map((note) => <p key={note}>• {note}</p>)
                )}
                <p className="text-xs text-[var(--muted-foreground)]">
                  Impact analytics refresh as approvals, redemptions, and surplus pickups are logged.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Operational focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)]">
                <p>Increase redemption reminders for vouchers expiring in 7 days.</p>
                <p>Share weekly impact highlights with donors and partners.</p>
                <p>Monitor partners with low redemption activity for support.</p>
                <Link href="/admin/partners">
                  <Button variant="outline" size="sm" className="w-full">
                    Review partner performance
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
