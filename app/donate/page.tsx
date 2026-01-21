'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function Donate() {
  const [donationType, setDonationType] = useState<'amount' | 'meals'>('meals');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');

  const mealPackages = [
    { meals: 5, amount: 2500, popular: false },
    { meals: 10, amount: 5000, popular: true },
    { meals: 25, amount: 12000, popular: false },
    { meals: 50, amount: 23000, popular: false },
  ];

  const quickAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

  const impact = [
    { stat: '10,234', label: 'Meals funded' },
    { stat: '5,127', label: 'People helped' },
    { stat: '248', label: 'Active donors' },
  ];

  const trustPoints = [
    {
      title: 'Transparent reporting',
      description: 'Track where every voucher is issued and redeemed.',
    },
    {
      title: 'Secure processing',
      description: 'Payments are handled by vetted providers and partners are verified.',
    },
    {
      title: 'Fast distribution',
      description: 'Funds convert to vouchers quickly so meals reach people sooner.',
    },
    {
      title: 'Clear impact',
      description: 'Receive summaries of meals funded and communities reached.',
    },
  ];

  const selectedDisplay = selectedAmount || parseInt(customAmount) || 0;

  return (
    <div className="page-shell">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Donate</p>
          <h1 className="text-4xl sm:text-5xl text-[var(--foreground)]">Help end hunger today.</h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Every contribution funds meal vouchers for people who need immediate support.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            <span className="rounded-full border border-[var(--border)] px-3 py-1">Verified partners</span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1">Real-time updates</span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1">Direct impact</span>
          </div>
        </div>
      </section>

      <section className="section-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {impact.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-6"
              >
                <div className="text-3xl font-semibold text-[var(--foreground)]">{item.stat}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <Card className="shadow-[var(--shadow)]">
            <CardHeader>
              <CardTitle className="text-2xl">Choose your donation</CardTitle>
              <p className="text-sm text-[var(--muted-foreground)]">
                Pick a meal package or donate a specific amount.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={() => setDonationType('meals')}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all border ${
                    donationType === 'meals'
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
                      : 'bg-[var(--surface)] text-[var(--muted-foreground)] border-[var(--border)]'
                  }`}
                >
                  Sponsor meals
                </button>
                <button
                  onClick={() => setDonationType('amount')}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all border ${
                    donationType === 'amount'
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm'
                      : 'bg-[var(--surface)] text-[var(--muted-foreground)] border-[var(--border)]'
                  }`}
                >
                  Donate amount
                </button>
              </div>

              {donationType === 'meals' && (
                <div className="space-y-4">
                  {mealPackages.map((pkg) => (
                    <button
                      key={pkg.amount}
                      onClick={() => {
                        setSelectedAmount(pkg.amount);
                        setCustomAmount('');
                      }}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        selectedAmount === pkg.amount
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold text-[var(--foreground)]">
                            {pkg.meals} Meals
                          </div>
                          <div className="text-sm text-[var(--muted-foreground)]">
                            ₦{pkg.amount.toLocaleString()} (₦{(pkg.amount / pkg.meals).toFixed(0)}/meal)
                          </div>
                        </div>
                        <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                          Select
                        </div>
                      </div>
                      {pkg.popular && (
                        <div className="mt-3 inline-flex items-center rounded-full bg-[var(--secondary)]/20 px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                          Popular choice
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {donationType === 'amount' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition-all ${
                          selectedAmount === amount
                            ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                            : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50'
                        }`}
                      >
                        ₦{(amount / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2">
                      Or enter a custom amount
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      placeholder="Enter amount in Naira"
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 space-y-3">
                <Button size="lg" className="w-full" disabled={!selectedAmount && !customAmount}>
                  {selectedAmount || customAmount
                    ? `Donate ₦${selectedDisplay.toLocaleString()}`
                    : 'Select an amount to continue'}
                </Button>
                <p className="text-center text-xs text-[var(--muted-foreground)]">
                  Secure payment powered by trusted providers.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Your impact, visible</CardTitle>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Clear reporting so you can see the meals you funded.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)]">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <span>Donation example</span>
                  <span className="font-semibold text-[var(--foreground)]">₦5,000</span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <span>Meals provided</span>
                  <span className="font-semibold text-[var(--foreground)]">10 meals</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Community partners</span>
                  <span className="font-semibold text-[var(--foreground)]">Verified vendors</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-alt)] border-none">
              <CardHeader>
                <CardTitle className="text-lg">Why donate through EcoEats?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trustPoints.map((reason, index) => (
                  <div key={reason.title} className="flex gap-4">
                    <div className="text-sm font-semibold text-[var(--primary)]">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{reason.title}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
