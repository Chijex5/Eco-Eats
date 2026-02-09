'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type DashboardSummary = {
  pendingRequests: number;
  vouchersIssued: number;
  mealsServed: number;
  activePartners: number;
};

type ImpactActivity = {
  id: string;
  event_type: string;
  related_id?: string | null;
  count: number;
  created_at: string;
};

const formatRelativeTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  const diffSeconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};

const activityLabel = (eventType: string, count: number) => {
  switch (eventType) {
    case 'MEAL_FUNDED':
      return `${count} voucher${count === 1 ? '' : 's'} funded`;
    case 'MEAL_SERVED':
      return `${count} meal${count === 1 ? '' : 's'} served`;
    case 'PACK_CLAIMED':
      return `${count} surplus pack${count === 1 ? '' : 's'} claimed`;
    case 'PACK_PICKED_UP':
      return `${count} surplus pack${count === 1 ? '' : 's'} picked up`;
    case 'REQUEST_APPROVED':
      return `${count} request${count === 1 ? '' : 's'} approved`;
    case 'PARTNER_JOINED':
      return `${count} partner${count === 1 ? '' : 's'} joined`;
    default:
      return 'New activity logged';
  }
};

const quickActions = [
  {
    title: 'Review beneficiary requests',
    description: 'Approve or decline new requests and issue vouchers.',
    href: '/admin/requests',
    action: 'Open requests',
  },
  {
    title: 'Track redemption history',
    description: 'Monitor voucher redemptions and meals served.',
    href: '/admin/impact',
    action: 'View impact',
  },
  {
    title: 'Manage partner network',
    description: 'Check partner status and onboarding progress.',
    href: '/admin/partners',
    action: 'View partners',
  },
];

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [activity, setActivity] = useState<ImpactActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load dashboard.');
        }
        const data = (await response.json()) as { summary: DashboardSummary; activity: ImpactActivity[] };
        setSummary(data.summary);
        setActivity(data.activity ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const highlights = useMemo(
    () => [
      {
        label: 'Pending requests',
        value: summary?.pendingRequests ?? 0,
        detail: 'Awaiting review',
      },
      {
        label: 'Vouchers issued',
        value: summary?.vouchersIssued ?? 0,
        detail: 'Total issued',
      },
      {
        label: 'Meals served',
        value: summary?.mealsServed ?? 0,
        detail: 'Confirmed redemptions',
      },
      {
        label: 'Partners active',
        value: summary?.activePartners ?? 0,
        detail: 'Approved partners',
      },
    ],
    [summary]
  );

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)] font-semibold">
                Admin dashboard
              </p>
              <h1 className="text-4xl sm:text-5xl text-[var(--foreground)] font-semibold">
                Operations overview.
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                Review requests, issue vouchers, and keep tabs on partner activity across EcoEats.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/admin/requests">
                <Button size="lg">Review requests</Button>
              </Link>
              <Link href="/admin/impact">
                <Button variant="outline" size="lg">View impact</Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <Card key={item.label} className="shadow-[var(--shadow)]">
                <CardContent className="pt-6 pb-6 space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)] font-semibold">
                    {item.label}
                  </p>
                  <p className="text-3xl font-semibold text-[var(--foreground)]">{item.value}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action) => (
                  <div
                    key={action.title}
                    className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-[var(--foreground)]">{action.title}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{action.description}</p>
                    </div>
                    <Link href={action.href}>
                      <Button variant="outline" size="sm">{action.action}</Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Latest activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {isLoading ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Loading activity...</p>
                ) : error ? (
                  <p className="text-sm text-rose-600">{error}</p>
                ) : activity.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No recent activity logged yet.</p>
                ) : (
                  activity.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-1 border-b border-dashed border-[var(--border)] pb-3 last:border-b-0 last:pb-0"
                    >
                      <p className="font-semibold text-[var(--foreground)]">
                        {activityLabel(item.event_type, Number(item.count ?? 0))}
                      </p>
                      <p className="text-[var(--muted-foreground)]">{formatRelativeTime(item.created_at)}</p>
                    </div>
                  ))
                )}
                <Link href="/admin/requests" className="block pt-2">
                  <Button size="sm" className="w-full">Review pending requests</Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
