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
    {
      icon: '🍽️',
      stat: '10,234',
      label: 'Meals Funded',
    },
    {
      icon: '❤️',
      stat: '5,127',
      label: 'People Helped',
    },
    {
      icon: '🤝',
      stat: '248',
      label: 'Active Donors',
    },
  ];

  const whyDonate = [
    {
      icon: '💯',
      title: '100% Transparent',
      description: 'Track exactly where your donation goes and see real-time impact.',
    },
    {
      icon: '🔒',
      title: 'Secure & Verified',
      description: 'All donations are processed securely and beneficiaries are verified.',
    },
    {
      icon: '📊',
      title: 'See Your Impact',
      description: 'Get detailed reports on how many meals your donation provided.',
    },
    {
      icon: '⚡',
      title: 'Immediate Help',
      description: 'Your donation is converted to vouchers and distributed quickly.',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-[var(--muted)] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span>💝</span>
            <span>Make a Difference</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-6">
            Help End Hunger Today
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto">
            Your donation provides meal vouchers to people in need. Every contribution matters.
          </p>
        </div>

        {/* Impact Stats */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {impact.map((item, index) => (
              <Card key={index} className="text-center bg-white">
                <CardContent className="py-8">
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <div className="text-4xl font-bold text-[var(--primary)] mb-2">
                    {item.stat}
                  </div>
                  <div className="text-[var(--muted-foreground)]">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Donation Form */}
        <section className="mb-16">
          <Card className="max-w-2xl mx-auto bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Choose Your Donation</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Donation Type Selector */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setDonationType('meals')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    donationType === 'meals'
                      ? 'bg-[var(--primary)] text-white shadow-md'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                  }`}
                >
                  🍽️ Sponsor Meals
                </button>
                <button
                  onClick={() => setDonationType('amount')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    donationType === 'amount'
                      ? 'bg-[var(--primary)] text-white shadow-md'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                  }`}
                >
                  💰 Donate Amount
                </button>
              </div>

              {/* Meal Packages */}
              {donationType === 'meals' && (
                <div className="space-y-4">
                  {mealPackages.map((pkg, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAmount(pkg.amount)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedAmount === pkg.amount
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                      } ${pkg.popular ? 'relative' : ''}`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 right-4 bg-[var(--secondary)] text-white text-xs px-3 py-1 rounded-full font-bold">
                          POPULAR
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-[var(--foreground)]">
                            {pkg.meals} Meals
                          </div>
                          <div className="text-sm text-[var(--muted-foreground)]">
                            ₦{pkg.amount.toLocaleString()} (₦{(pkg.amount / pkg.meals).toFixed(0)}/meal)
                          </div>
                        </div>
                        <div className="text-3xl">🍽️</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Amount Selection */}
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
                        className={`p-4 rounded-lg border-2 font-bold transition-all ${
                          selectedAmount === amount
                            ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                            : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                        }`}
                      >
                        ₦{(amount / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--foreground)]">
                      Or enter custom amount:
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      placeholder="Enter amount in Naira"
                      className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:border-[var(--primary)] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Donate Button */}
              <div className="mt-8">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!selectedAmount && !customAmount}
                >
                  {selectedAmount || customAmount
                    ? `Donate ₦${(selectedAmount || parseInt(customAmount) || 0).toLocaleString()}`
                    : 'Select an amount to continue'}
                </Button>
                <p className="text-center text-sm text-[var(--muted-foreground)] mt-3">
                  🔒 Secure payment powered by trusted payment providers
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Why Donate */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8 text-center">
            Why Donate Through EcoEats?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyDonate.map((reason, index) => (
              <Card key={index} hover>
                <CardHeader>
                  <div className="text-4xl mb-3">{reason.icon}</div>
                  <CardTitle className="text-lg mb-2">{reason.title}</CardTitle>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    {reason.description}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Donation Impact Example */}
        <section>
          <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-2xl">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Your Impact Breakdown
              </h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-5xl mb-3">₦5,000</div>
                  <div className="text-lg mb-2 font-semibold">Your Donation</div>
                  <div className="text-sm opacity-90">Provides 10 meals</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-3">→</div>
                  <div className="text-lg mb-2 font-semibold">Converted to</div>
                  <div className="text-sm opacity-90">Digital vouchers</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-3">🍽️</div>
                  <div className="text-lg mb-2 font-semibold">Feeds</div>
                  <div className="text-sm opacity-90">10 people in need</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
