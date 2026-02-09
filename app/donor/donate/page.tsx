'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const DONATION_TYPES = [
  {
    value: 'VOUCHER',
    title: 'Fund meal vouchers',
    description: 'Sponsor vouchers that can be redeemed immediately.',
  },
  {
    value: 'FOOD_PACK',
    title: 'Support food packs',
    description: 'Cover ready-to-go food packs for verified beneficiaries.',
  },
  {
    value: 'SURPLUS',
    title: 'Back surplus rescue',
    description: 'Fund pickups and distribution of rescued meals.',
  },
];

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000];
const MEAL_VALUE_NGN = 1000;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

export default function DonorDonatePage() {
  const [amountNgn, setAmountNgn] = useState(10000);
  const [donationType, setDonationType] = useState('VOUCHER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const estimatedMeals = useMemo(() => {
    return Math.max(1, Math.round(amountNgn / MEAL_VALUE_NGN));
  }, [amountNgn]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountNgn,
          donationType,
          mealCount: estimatedMeals,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to submit donation.');
      }

      setSuccessMessage('Thanks for funding meals! We have recorded your donation.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit donation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Donate</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] font-semibold">
              Fund the next meal in minutes.
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Your donation funds verified meal support requests and keeps every voucher traceable.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Donation details</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-[var(--foreground)]">Choose a focus</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {DONATION_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setDonationType(type.value)}
                          className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                            donationType === type.value
                              ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                              : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40'
                          }`}
                        >
                          <p className="text-sm font-semibold text-[var(--foreground)]">{type.title}</p>
                          <p className="text-xs text-[var(--muted-foreground)] mt-1">{type.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-[var(--foreground)]">Select an amount</p>
                    <div className="flex flex-wrap gap-3">
                      {PRESET_AMOUNTS.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setAmountNgn(amount)}
                          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                            amountNgn === amount
                              ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/10'
                              : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/40'
                          }`}
                        >
                          {formatCurrency(amount)}
                        </button>
                      ))}
                    </div>
                    <label className="text-sm text-[var(--muted-foreground)]">
                      Custom amount (NGN)
                      <input
                        type="number"
                        min={1000}
                        step={500}
                        value={amountNgn}
                        onChange={(event) => setAmountNgn(Number(event.target.value))}
                        className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      />
                    </label>
                  </div>

                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/30 px-4 py-4">
                    <p className="text-sm text-[var(--muted-foreground)]">Estimated meals funded</p>
                    <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
                      {estimatedMeals} meals
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Based on an average of {formatCurrency(MEAL_VALUE_NGN)} per meal.
                    </p>
                  </div>

                  {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
                  {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Processing...' : 'Confirm donation'}
                    </Button>
                    <Link href="/donor/history">
                      <Button variant="outline" size="lg" type="button">
                        View history
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle>What happens next</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                  <p>1. EcoEats allocates your funding to verified requests.</p>
                  <p>2. Beneficiaries receive vouchers or food packs.</p>
                  <p>3. Partners confirm redemptions and we log impact.</p>
                  <Link href="/donor/impact">
                    <Button variant="outline" size="sm">Track impact</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow)] bg-[var(--primary-dark)] text-white">
                <CardHeader>
                  <CardTitle>Need a receipt?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>All donations are recorded instantly. Receipts are available in your history page.</p>
                  <p className="font-semibold">donors@ecoeats.org</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
