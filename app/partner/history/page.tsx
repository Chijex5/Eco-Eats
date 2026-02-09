'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type Redemption = {
  id: string;
  redeemed_at: string;
  meal_description?: string | null;
  value_kobo: number;
  voucher_code?: string | null;
};

type Pickup = {
  id: string;
  pickup_code: string;
  status: string;
  created_at: string;
  title: string;
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return 'Recently';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatCurrency = (value: number) => `₦${(value / 100).toFixed(2)}`;

export default function PartnerHistoryPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/partners');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load partner history.');
        }
        const data = await response.json();
        setRedemptions(data.recentRedemptions || []);
        setPickups(data.recentPickups || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load partner history.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">History</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Partner activity log.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Review recent voucher redemptions and surplus pickups confirmed at your location.
            </p>
          </section>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {isLoading ? <p className="text-sm text-[var(--muted-foreground)]">Loading activity...</p> : null}

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Voucher redemptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {redemptions.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No voucher redemptions yet.</p>
                ) : (
                  redemptions.map((item) => (
                    <div key={item.id} className="border-b border-dashed border-[var(--border)] pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">
                            Voucher {item.voucher_code ?? 'Redeemed'}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">{item.meal_description || 'Meal served'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[var(--foreground)]">{formatCurrency(item.value_kobo)}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{formatDateTime(item.redeemed_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Surplus pickups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pickups.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No pickup confirmations yet.</p>
                ) : (
                  pickups.map((item) => (
                    <div key={item.id} className="border-b border-dashed border-[var(--border)] pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">Pickup code: {item.pickup_code}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">{item.status}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{formatDateTime(item.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
