'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type PartnerOverview = {
  id: string;
  name: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  redemptions_last_7_days: number;
  surplus_listings_last_7_days: number;
};

type PartnerSummary = {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  rejected: number;
};

const onboardingSteps = [
  'Confirm partner profile details and menu range.',
  'Assign staff users for redemption access.',
  'Schedule pickup or redemption training session.',
];

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerOverview[]>([]);
  const [summary, setSummary] = useState<PartnerSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPartners = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/admin/partners');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load partners.');
        }
        const data = (await response.json()) as { partners: PartnerOverview[]; summary: PartnerSummary };
        setPartners(data.partners ?? []);
        setSummary(data.summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load partners.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPartners();
  }, []);

  const partnerStatusLabel = (status: PartnerOverview['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'Active';
      case 'PENDING':
        return 'Onboarding';
      case 'SUSPENDED':
        return 'Suspended';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  const partnerDetail = (partner: PartnerOverview) => {
    if (partner.status !== 'APPROVED') {
      return partner.status === 'PENDING' ? 'Awaiting approval' : 'Needs admin follow-up';
    }
    const details = [];
    if (partner.redemptions_last_7_days > 0) {
      details.push(`${partner.redemptions_last_7_days} redemptions this week`);
    }
    if (partner.surplus_listings_last_7_days > 0) {
      details.push(`${partner.surplus_listings_last_7_days} surplus listings this week`);
    }
    if (details.length === 0) {
      details.push('No redemptions this week');
    }
    return details.join(' · ');
  };

  const overviewStats = useMemo(
    () => [
      { label: 'Total partners', value: summary?.total ?? 0 },
      { label: 'Active', value: summary?.active ?? 0 },
      { label: 'Onboarding', value: summary?.pending ?? 0 },
    ],
    [summary]
  );

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)] font-semibold">
                Admin partners
              </p>
              <h1 className="text-4xl sm:text-5xl text-[var(--foreground)] font-semibold">
                Manage food partners.
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                Track partner onboarding, redemption readiness, and surplus programs from one place.
              </p>
            </div>
            <Link href="/partners/join">
              <Button variant="outline" size="lg">Share partner signup</Button>
            </Link>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Partner status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Loading partner updates...</p>
                ) : error ? (
                  <p className="text-sm text-rose-600">{error}</p>
                ) : partners.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No partner updates yet.</p>
                ) : (
                  partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{partner.name}</p>
                        <p className="text-sm text-[var(--muted-foreground)]">{partnerDetail(partner)}</p>
                      </div>
                      <span className="inline-flex rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                        {partnerStatusLabel(partner.status)}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Onboarding checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                <div className="grid gap-2">
                  {overviewStats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between text-xs">
                      <span className="uppercase tracking-[0.3em]">{stat.label}</span>
                      <span className="font-semibold text-[var(--foreground)]">{stat.value}</span>
                    </div>
                  ))}
                </div>
                {onboardingSteps.map((step) => (
                  <p key={step}>• {step}</p>
                ))}
                <Link href="/admin/requests" className="pt-2 block">
                  <Button variant="outline" size="sm" className="w-full">
                    Review partner-linked requests
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
