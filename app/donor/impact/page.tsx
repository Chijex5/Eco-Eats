'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function DonorImpactPage() {
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadImpact = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await fetch('/api/impact/summary');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load impact summary.');
        }
        const data = (await response.json()) as { summary: ImpactSummary };
        setSummary(data.summary ?? null);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load impact summary.');
      } finally {
        setIsLoading(false);
      }
    };

    loadImpact();
  }, []);

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Impact</p>
              <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] font-semibold">
                See the meals you helped deliver.
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                Impact is reported in aggregate to protect beneficiary dignity while keeping every meal accountable.
              </p>
            </div>
            <Link href="/donor/donate">
              <Button size="lg">Fund more meals</Button>
            </Link>
          </section>

          {isLoading ? (
            <p className="text-sm text-[var(--muted-foreground)]">Loading impact summary...</p>
          ) : errorMessage ? (
            <p className="text-sm text-rose-600">{errorMessage}</p>
          ) : summary ? (
            <>
              <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-[var(--shadow)]">
                  <CardContent className="pt-6 pb-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Meals funded</p>
                    <p className="text-4xl font-bold text-[var(--foreground)] mt-2">{summary.meals.funded}</p>
                  </CardContent>
                </Card>
                <Card className="shadow-[var(--shadow)]">
                  <CardContent className="pt-6 pb-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Meals served</p>
                    <p className="text-4xl font-bold text-[var(--foreground)] mt-2">{summary.meals.served}</p>
                  </CardContent>
                </Card>
                <Card className="shadow-[var(--shadow)]">
                  <CardContent className="pt-6 pb-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Active vouchers</p>
                    <p className="text-4xl font-bold text-[var(--foreground)] mt-2">{summary.vouchers.active}</p>
                  </CardContent>
                </Card>
                <Card className="shadow-[var(--shadow)]">
                  <CardContent className="pt-6 pb-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Partners joined</p>
                    <p className="text-4xl font-bold text-[var(--foreground)] mt-2">{summary.partners.joined}</p>
                  </CardContent>
                </Card>
              </section>

              <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <Card className="shadow-[var(--shadow)]">
                  <CardHeader>
                    <CardTitle>Program performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)]">
                    <div className="flex items-center justify-between">
                      <span>Vouchers issued</span>
                      <span className="font-semibold text-[var(--foreground)]">{summary.vouchers.issued}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Vouchers redeemed</span>
                      <span className="font-semibold text-[var(--foreground)]">{summary.vouchers.redeemed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Surplus packs claimed</span>
                      <span className="font-semibold text-[var(--foreground)]">{summary.surplus.claimed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Surplus packs picked up</span>
                      <span className="font-semibold text-[var(--foreground)]">{summary.surplus.pickedUp}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-[var(--shadow)] bg-[var(--primary-dark)] text-white">
                  <CardHeader>
                    <CardTitle>Donor impact note</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>Impact updates are anonymized and aggregated every day at midnight.</p>
                    <p>Need a bespoke impact report? Email our donor relations team.</p>
                    <p className="font-semibold">donors@ecoeats.org</p>
                  </CardContent>
                </Card>
              </section>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
