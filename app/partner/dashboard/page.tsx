'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type PartnerProfile = {
  id: string;
  name: string;
  description?: string | null;
  location_text?: string | null;
  status: string;
};

type PartnerStats = {
  activeSurplus: number;
  pendingPickups: number;
  redeemedVouchers: number;
  staffCount: number;
};

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
  pickup_deadline?: string;
  beneficiary_name?: string | null;
  beneficiary_email?: string | null;
};

const formatDate = (value?: string) => {
  if (!value) {
    return 'Recently';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (value: number) => `₦${(value / 100).toFixed(2)}`;

export default function PartnerDashboard() {
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPartner = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/partners');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load partner profile.');
        }
        const data = await response.json();
        setPartner(data.partner);
        setStats(data.stats);
        setRedemptions(data.recentRedemptions || []);
        setPickups(data.recentPickups || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load partner profile.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPartner();
  }, []);

  const statCards = useMemo(() => {
    const safe = stats || { activeSurplus: 0, pendingPickups: 0, redeemedVouchers: 0, staffCount: 0 };
    return [
      { label: 'Active surplus listings', value: safe.activeSurplus, detail: 'Ready for pickup' },
      { label: 'Pending pickups', value: safe.pendingPickups, detail: 'Awaiting confirmation' },
      { label: 'Vouchers redeemed', value: safe.redeemedVouchers, detail: 'Meals served to date' },
      { label: 'Team members', value: safe.staffCount, detail: 'Staff with access' },
    ];
  }, [stats]);

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Partner dashboard</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--foreground)]">
                {partner?.name ?? 'Welcome partner'}
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                {partner?.description ||
                  'Track redemptions, manage surplus packs, and keep the counter moving smoothly.'}
              </p>
              {partner?.location_text ? (
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                  {partner.location_text}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/partner/surplus">
                <Button size="lg">Post surplus</Button>
              </Link>
              <Link href="/partner/redeem">
                <Button variant="outline" size="lg">
                  Redeem now
                </Button>
              </Link>
            </div>
          </section>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {isLoading ? <p className="text-sm text-[var(--muted-foreground)]">Loading partner data...</p> : null}

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.label} className="shadow-[var(--shadow)]">
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">{stat.label}</p>
                  <p className="text-3xl font-semibold text-[var(--foreground)] mt-2">{stat.value}</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{stat.detail}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle className="text-2xl">Recent redemptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {redemptions.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No redemptions yet.</p>
                ) : (
                  redemptions.map((redemption) => (
                    <div key={redemption.id} className="border-b border-dashed border-[var(--border)] pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">
                            Voucher {redemption.voucher_code ?? 'Redeemed'}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {redemption.meal_description || 'Meal redeemed at counter'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            {formatCurrency(redemption.value_kobo)}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">{formatDate(redemption.redeemed_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle className="text-2xl">Pending pickups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pickups.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No pickup claims yet.</p>
                ) : (
                  pickups.map((pickup) => (
                    <div key={pickup.id} className="border-b border-dashed border-[var(--border)] pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{pickup.title}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">Pickup code: {pickup.pickup_code}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            Beneficiary: {pickup.beneficiary_name || 'Unknown'}{pickup.beneficiary_email ? ` (${pickup.beneficiary_email})` : ''}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            Pickup due: {formatDate(pickup.pickup_deadline)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">{pickup.status}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{formatDate(pickup.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">Redeem vouchers</p>
                <p className="text-xs text-[var(--muted-foreground)]">Confirm QR or codes at the counter.</p>
                <Link href="/partner/redeem">
                  <Button variant="outline" size="sm">Open</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">Manage surplus</p>
                <p className="text-xs text-[var(--muted-foreground)]">Post new packs and monitor pickups.</p>
                <Link href="/partner/surplus">
                  <Button variant="outline" size="sm">Open</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="pt-6 space-y-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">Update settings</p>
                <p className="text-xs text-[var(--muted-foreground)]">Keep partner details and staff access current.</p>
                <Link href="/partner/settings">
                  <Button variant="outline" size="sm">Open</Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
