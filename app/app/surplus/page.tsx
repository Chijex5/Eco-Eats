'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type SurplusListing = {
  id: string;
  title: string;
  description?: string | null;
  pickup_deadline: string;
  quantity_available: number;
  claimed_count: number;
  partner_name?: string | null;
};

const formatPickupWindow = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Pickup window to be confirmed';
  return `Pickup by ${date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })}`;
};

const tips = [
  'Claiming a pack reserves a pickup code for you.',
  'Cancel within the app if you cannot make it.',
  'Surplus packs update every few hours as partners post new meals.',
];

export default function SurplusPacksPage() {
  const [packs, setPacks] = useState<SurplusListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPacks = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/surplus/available');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load surplus packs.');
        }
        const data = (await response.json()) as { listings: SurplusListing[] };
        setPacks(data.listings ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load surplus packs.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPacks();
  }, []);

  const formattedPacks = useMemo(
    () =>
      packs.map((pack) => {
        const remaining = Math.max(pack.quantity_available - pack.claimed_count, 0);
        return {
          ...pack,
          remaining,
        };
      }),
    [packs]
  );

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Surplus packs</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Browse surplus meals near you.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Partners share surplus meals daily. Claim a pack to receive a pickup code and a time window.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/app/request-help">
                <Button size="lg">Request full support</Button>
              </Link>
              <Link href="/app/history">
                <Button variant="outline" size="lg">View history</Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-4">
            {isLoading ? (
              <Card className="shadow-[var(--shadow)]">
                <CardContent className="py-8 text-sm text-[var(--muted-foreground)]">
                  Loading surplus packs...
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="shadow-[var(--shadow)]">
                <CardContent className="py-8 text-sm text-rose-600">{error}</CardContent>
              </Card>
            ) : formattedPacks.length === 0 ? (
              <Card className="shadow-[var(--shadow)]">
                <CardContent className="py-8 text-sm text-[var(--muted-foreground)]">
                  No surplus packs are available right now. Check back soon.
                </CardContent>
              </Card>
            ) : (
              formattedPacks.map((pack) => (
                <Card key={pack.id} className="shadow-[var(--shadow)]">
                  <CardHeader>
                    <CardTitle>{pack.partner_name ?? 'Partner location'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    <p className="text-[var(--foreground)] font-semibold">{pack.title}</p>
                    {pack.description ? <p>{pack.description}</p> : null}
                    <p>{formatPickupWindow(pack.pickup_deadline)}</p>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">
                        {pack.remaining} slots remaining
                      </span>
                      <Button variant="outline" size="sm" disabled={pack.remaining === 0}>
                        {pack.remaining === 0 ? 'Sold out' : 'Claim pack'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </section>

          <section>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Before you claim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
                {tips.map((tip) => (
                  <p key={tip}>• {tip}</p>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
