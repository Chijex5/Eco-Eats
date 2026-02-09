'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type Redemption = {
  id: string;
  redeemed_at: string;
  meal_description?: string | null;
  value_kobo: number;
  voucher_code: string;
  beneficiary_name?: string | null;
};

type Summary = {
  totalMeals: number;
  totalValueKobo: number;
};

const formatCurrency = (valueKobo: number) => {
  const value = valueKobo / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const anonymizeName = (name?: string | null) => {
  if (!name) return 'Anonymous';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'Anonymous';
  const first = parts[0];
  const last = parts.length > 1 ? ` ${parts[parts.length - 1][0].toUpperCase()}.` : '';
  return `${first}${last}`;
};

export default function PartnerHistoryPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalMeals: 0, totalValueKobo: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRedemptions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/partner/redemptions');
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to load redemptions.');
      }
      const data = (await response.json()) as { redemptions: Redemption[]; summary: Summary };
      setRedemptions(data.redemptions || []);
      setSummary(data.summary || { totalMeals: 0, totalValueKobo: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load redemptions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRedemptions();
  }, []);

  const totalMealsLabel = useMemo(
    () => (summary.totalMeals === 1 ? 'Meal served' : 'Meals served'),
    [summary.totalMeals]
  );

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Partner history</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Your redemption history.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Track every voucher redeemed at your location and monitor the meals you have served.
            </p>
            <Button variant="outline" size="sm" onClick={loadRedemptions} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh history'}
            </Button>
          </section>

          {error ? (
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="py-6 text-sm text-rose-600">{error}</CardContent>
            </Card>
          ) : null}

          <section className="grid gap-4 sm:grid-cols-2">
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="py-6 space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Meals served</p>
                <p className="text-3xl font-semibold text-[var(--foreground)]">{summary.totalMeals}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{totalMealsLabel} through EcoEats.</p>
              </CardContent>
            </Card>
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="py-6 space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Total value</p>
                <p className="text-3xl font-semibold text-[var(--foreground)]">
                  {formatCurrency(summary.totalValueKobo)}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">Voucher value redeemed so far.</p>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Recent redemptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Loading redemption history...</p>
                ) : redemptions.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    No redemptions recorded yet. Redeem a voucher to see it here.
                  </p>
                ) : (
                  redemptions.map((redemption) => (
                    <div
                      key={redemption.id}
                      className="grid gap-2 rounded-2xl border border-[var(--border)] px-4 py-4 sm:grid-cols-4 sm:items-center"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Voucher</p>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{redemption.voucher_code}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Value</p>
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {formatCurrency(redemption.value_kobo)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Beneficiary</p>
                        <p className="text-sm text-[var(--foreground)]">{anonymizeName(redemption.beneficiary_name)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Redeemed</p>
                        <p className="text-sm text-[var(--foreground)]">{formatDate(redemption.redeemed_at)}</p>
                      </div>
                      {redemption.meal_description ? (
                        <div className="sm:col-span-4 text-sm text-[var(--muted-foreground)]">
                          Meal notes: {redemption.meal_description}
                        </div>
                      ) : null}
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
