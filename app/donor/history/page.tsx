'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type Donation = {
  id: string;
  amount_kobo: number;
  donation_type: string;
  status: string;
  payment_ref: string;
  created_at: string;
};

type DonationSummary = {
  totalAmountKobo: number;
  donationCount: number;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }
  return date.toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function DonorHistoryPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [summary, setSummary] = useState<DonationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadDonations = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await fetch('/api/donations');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load donations.');
        }
        const data = (await response.json()) as { donations: Donation[]; summary: DonationSummary };
        setDonations(data.donations ?? []);
        setSummary(data.summary ?? null);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load donations.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDonations();
  }, []);

  const totalAmount = useMemo(() => summary?.totalAmountKobo ?? 0, [summary]);
  const donationCount = useMemo(() => summary?.donationCount ?? 0, [summary]);

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">History</p>
              <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] font-semibold">
                Donation receipts & activity
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                Review every contribution, export receipts, and track what has been funded.
              </p>
            </div>
            <Link href="/donor/donate">
              <Button size="lg">Make a new donation</Button>
            </Link>
          </section>

          <section className="grid gap-5 sm:grid-cols-2">
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="pt-6 pb-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Total contributed</p>
                <p className="text-3xl font-bold text-[var(--foreground)] mt-2">
                  {formatCurrency(totalAmount / 100)}
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="pt-6 pb-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Donations recorded</p>
                <p className="text-3xl font-bold text-[var(--foreground)] mt-2">
                  {donationCount}
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Donation history</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Loading donations...</p>
                ) : errorMessage ? (
                  <p className="text-sm text-rose-600">{errorMessage}</p>
                ) : donations.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    No donations yet. Start funding meals to see them here.
                  </p>
                ) : (
                  donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-[var(--foreground)] text-base">
                          {donation.donation_type.replace('_', ' ').toLowerCase()} donation
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {formatCurrency(donation.amount_kobo / 100)} · {formatDate(donation.created_at)}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">Ref: {donation.payment_ref}</p>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">
                        {donation.status}
                      </span>
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
