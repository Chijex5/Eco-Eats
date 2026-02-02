'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useState } from 'react';
import { formatCurrency } from '@/lib/mockData';

export default function Donate() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const donationTiers = [
    {
      id: 'tier1',
      name: 'One Meal',
      amountKobo: 150000, // ₦1,500
      meals: 1,
      description: 'Provide one nutritious meal',
      icon: '🍱',
    },
    {
      id: 'tier2',
      name: 'Daily Support',
      amountKobo: 500000, // ₦5,000
      meals: 3,
      description: 'Support someone for a day',
      icon: '🌅',
      popular: true,
    },
    {
      id: 'tier3',
      name: 'Weekly Care',
      amountKobo: 1500000, // ₦15,000
      meals: 10,
      description: 'Provide meals for a week',
      icon: '📅',
    },
    {
      id: 'tier4',
      name: 'Monthly Impact',
      amountKobo: 5000000, // ₦50,000
      meals: 33,
      description: 'Transform lives for a month',
      icon: '⭐',
    },
  ];

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomSelect = () => {
    setSelectedTier(null);
    setIsCustom(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In Phase B, this would integrate with payment gateway
    setSubmitted(true);
  };

  const getSelectedAmount = () => {
    if (isCustom && customAmount) {
      return parseInt(customAmount) * 100; // Convert to kobo
    }
    if (selectedTier) {
      const tier = donationTiers.find((t) => t.id === selectedTier);
      return tier?.amountKobo || 0;
    }
    return 0;
  };

  const selectedAmount = getSelectedAmount();

  if (submitted) {
    return (
      <div className="page-shell">
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-[var(--shadow)] text-center">
              <CardContent className="py-12">
                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-[var(--primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl text-[var(--foreground)] mb-4">
                  Thank You for Your Donation!
                </h2>
                <p className="text-[var(--muted-foreground)] mb-2">
                  Your generous contribution of {formatCurrency(selectedAmount)} will help provide meals to those in need.
                </p>
                <p className="text-sm text-[var(--muted-foreground)] mb-8">
                  You'll receive a confirmation email shortly with your receipt.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/donor/dashboard">
                    <Button size="lg" variant="primary">
                      View Dashboard
                    </Button>
                  </Link>
                  <Link href="/donor/impact">
                    <Button size="lg" variant="outline">
                      See Your Impact
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link
              href="/donor/dashboard"
              className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] mb-6"
            >
              <span className="mr-2">←</span>
              Back to Dashboard
            </Link>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] mb-3">
                Make a Donation
              </h1>
              <p className="text-[var(--muted-foreground)] text-lg">
                Every contribution helps fight hunger and nourish communities. Choose your impact level below.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {donationTiers.map((tier) => (
              <Card
                key={tier.id}
                hover
                className={`cursor-pointer transition-all relative ${
                  selectedTier === tier.id
                    ? 'border-2 border-[var(--primary)] bg-[var(--primary)]/5 shadow-[var(--shadow)]'
                    : ''
                }`}
                onClick={() => handleTierSelect(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block px-3 py-1 rounded-full bg-[var(--secondary)] text-white text-xs font-semibold uppercase tracking-[0.1em]">
                      Popular
                    </span>
                  </div>
                )}
                <CardContent className="py-6 text-center">
                  <div className="text-4xl mb-3">{tier.icon}</div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                    {tier.name}
                  </h3>
                  <div className="text-2xl font-bold text-[var(--primary)] mb-2">
                    {formatCurrency(tier.amountKobo)}
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3">
                    {tier.description}
                  </p>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {tier.meals} meal{tier.meals > 1 ? 's' : ''}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <Card
              hover
              className={`cursor-pointer transition-all mb-8 ${
                isCustom ? 'border-2 border-[var(--primary)] bg-[var(--primary)]/5' : ''
              }`}
              onClick={handleCustomSelect}
            >
              <CardContent className="py-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-3xl">
                      💝
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                      Custom Amount
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Choose your own donation amount
                    </p>
                  </div>
                  {isCustom && (
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--foreground)] font-semibold">₦</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-32 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
                        placeholder="5000"
                        min="100"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {(selectedTier || (isCustom && customAmount)) && (
              <Card className="shadow-[var(--shadow)] mb-8">
                <CardHeader>
                  <CardTitle className="text-xl">Donation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Donation Amount</span>
                      <span className="font-semibold text-[var(--foreground)]">
                        {formatCurrency(selectedAmount)}
                      </span>
                    </div>
                    {!isCustom && selectedTier && (
                      <div className="flex justify-between py-3 border-b border-[var(--border)]">
                        <span className="text-[var(--muted-foreground)]">Meals Sponsored</span>
                        <span className="font-semibold text-[var(--foreground)]">
                          {donationTiers.find((t) => t.id === selectedTier)?.meals}
                        </span>
                      </div>
                    )}
                    {isCustom && customAmount && (
                      <div className="flex justify-between py-3 border-b border-[var(--border)]">
                        <span className="text-[var(--muted-foreground)]">Estimated Meals</span>
                        <span className="font-semibold text-[var(--foreground)]">
                          ~{Math.floor(parseInt(customAmount) / 1500)}
                        </span>
                      </div>
                    )}
                    <div className="rounded-2xl bg-[var(--primary)]/5 border border-[var(--primary)]/20 p-4">
                      <p className="text-sm text-[var(--foreground)]">
                        <strong>100% of your donation</strong> goes directly to providing meals. We cover all processing fees.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                      <h4 className="font-semibold text-[var(--foreground)] mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Payment Information
                      </h4>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Payment gateway integration will be available in Phase B. For now, this is a demonstration of the donation flow.
                      </p>
                    </div>

                    <label className="flex items-start gap-3 text-sm text-[var(--muted-foreground)]">
                      <input
                        type="checkbox"
                        required
                        className="mt-1 h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span>
                        I agree to the{' '}
                        <a href="#" className="text-[var(--primary)] hover:text-[var(--primary-dark)]">
                          Terms of Service
                        </a>{' '}
                        and understand that my donation is final and non-refundable.
                      </span>
                    </label>

                    <Button type="submit" size="lg" variant="primary" className="w-full">
                      Complete Donation
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card className="bg-[var(--surface-alt)] border-[var(--border)]">
              <CardContent className="py-6">
                <h3 className="font-semibold text-[var(--foreground)] mb-3">Why donate to EcoEats?</h3>
                <ul className="text-sm text-[var(--muted-foreground)] space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    <span>100% of donations go directly to providing meals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    <span>Track your impact with transparent reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    <span>Support verified beneficiaries with dignity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    <span>Contribute to UN SDG 2: Zero Hunger</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
