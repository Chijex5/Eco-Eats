'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type SupportRequest = {
  id: string;
  request_type: 'VOUCHER' | 'FOOD_PACK';
  urgency: 'LOW' | 'MED' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'FULFILLED';
  message?: string;
  created_at: string;
};

type Voucher = {
  id: string;
  code: string;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'REVOKED';
  created_at: string;
};

const quickActions = [
  {
    title: 'Request food support',
    description: 'Submit a new request for vouchers or surplus packs.',
    href: '/app/request-help',
  },
  {
    title: 'View voucher wallet',
    description: 'Check your active vouchers and redemption codes.',
    href: '/app/vouchers',
  },
  {
    title: 'Browse surplus packs',
    description: 'See nearby surplus packs and claim available slots.',
    href: '/app/surplus',
  },
];

const nextSteps = [
  {
    title: 'Complete verification',
    description: 'Upload a quick ID or student card to speed up approval.',
  },
  {
    title: 'Choose pickup preferences',
    description: 'Set preferred pickup windows to reduce missed visits.',
  },
  {
    title: 'Share feedback',
    description: 'Tell us how the last meal pickup went to improve matching.',
  },
];

const STATUS_STYLES: Record<SupportRequest['status'], string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  DECLINED: 'bg-rose-100 text-rose-700',
  FULFILLED: 'bg-[var(--primary)]/10 text-[var(--primary)]',
};

const STATUS_LABELS: Record<SupportRequest['status'], string> = {
  PENDING: 'Pending review',
  APPROVED: 'Approved',
  DECLINED: 'Declined',
  FULFILLED: 'Fulfilled',
};

const REQUEST_TYPE_LABELS: Record<SupportRequest['request_type'], string> = {
  VOUCHER: 'Voucher request',
  FOOD_PACK: 'Food pack request',
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export default function BeneficiaryDashboard() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [requestResponse, voucherResponse] = await Promise.all([
          fetch('/api/requests/me'),
          fetch('/api/vouchers/me'),
        ]);

        if (!requestResponse.ok) {
          const payload = await requestResponse.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to fetch requests.');
        }

        if (!voucherResponse.ok) {
          const payload = await voucherResponse.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to fetch vouchers.');
        }

        const requestData = (await requestResponse.json()) as { requests: SupportRequest[] };
        const voucherData = (await voucherResponse.json()) as { vouchers: Voucher[] };
        setRequests(requestData.requests || []);
        setVouchers(voucherData.vouchers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to fetch dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const summaryStats = useMemo(() => {
    const pending = requests.filter((request) => request.status === 'PENDING').length;
    const approved = requests.filter((request) => request.status === 'APPROVED').length;
    const declined = requests.filter((request) => request.status === 'DECLINED').length;
    const activeVouchers = vouchers.filter((voucher) => voucher.status === 'ACTIVE').length;

    return [
      { label: 'Pending requests', value: pending, detail: 'Awaiting admin review' },
      { label: 'Approved requests', value: approved, detail: 'Waiting voucher issuance' },
      { label: 'Declined requests', value: declined, detail: 'Review feedback in messages' },
      { label: 'Active vouchers', value: activeVouchers, detail: 'Ready for redemption' },
    ];
  }, [requests, vouchers]);

  const latestRequest = requests[0];
  const pendingRequests = requests.filter((request) => request.status === 'PENDING');
  const latestActiveVoucher = vouchers.find((voucher) => voucher.status === 'ACTIVE');

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Beneficiary dashboard</p>
              <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">Welcome back</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Here&apos;s your support overview and next steps for the week.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/app/request-help">
                <Button size="lg">New request</Button>
              </Link>
              <Link href="/app/profile">
                <Button variant="outline" size="lg">Edit profile</Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryStats.map((stat) => (
              <Card key={stat.label} className="shadow-[var(--shadow)]">
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-semibold text-[var(--foreground)] mt-2">{stat.value}</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{stat.detail}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <div className="space-y-6">
              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-2xl">Quick actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickActions.map((action) => (
                    <div key={action.href} className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] p-4">
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{action.title}</p>
                        <p className="text-sm text-[var(--muted-foreground)]">{action.description}</p>
                      </div>
                      <Link href={action.href}>
                        <Button variant="outline" size="sm">Open</Button>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-2xl">Request status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <p className="text-sm text-[var(--muted-foreground)]">Loading your requests...</p>
                  ) : error ? (
                    <p className="text-sm text-rose-600">{error}</p>
                  ) : requests.length === 0 ? (
                    <div className="space-y-3 text-sm text-[var(--muted-foreground)]">
                      <p>You have no requests yet.</p>
                      <Link href="/app/request-help">
                        <Button size="sm">Request support</Button>
                      </Link>
                    </div>
                  ) : (
                    requests.slice(0, 4).map((request) => (
                      <div
                        key={request.id}
                        className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] px-4 py-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[var(--foreground)]">
                              {REQUEST_TYPE_LABELS[request.request_type]}
                            </p>
                            <p className="text-sm text-[var(--muted-foreground)]">Submitted {formatDate(request.created_at)}</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[request.status]}`}
                          >
                            {STATUS_LABELS[request.status]}
                          </span>
                        </div>
                        {request.request_type === 'VOUCHER' && (request.status === 'APPROVED' || request.status === 'FULFILLED') ? (
                          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2">
                            <p className="text-xs text-[var(--muted-foreground)]">
                              Your voucher is approved. Open wallet to view voucher code/QR.
                            </p>
                            <Link href="/app/vouchers">
                              <Button size="sm" variant="outline">Open wallet</Button>
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                  {!isLoading && !error && pendingRequests.length === 0 && requests.length > 0 ? (
                    <Link href="/app/request-help">
                      <Button variant="outline" size="sm">Start a new request</Button>
                    </Link>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-[var(--shadow)] bg-[var(--primary-dark)] text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Current request status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-sm text-white/70">Loading status...</p>
                  ) : error ? (
                    <p className="text-sm text-white/70">Unable to load status.</p>
                  ) : latestRequest ? (
                    <>
                      <p className="text-sm text-white/80">{REQUEST_TYPE_LABELS[latestRequest.request_type]}</p>
                      <p className="text-2xl font-semibold mt-2">{STATUS_LABELS[latestRequest.status]}</p>
                      <p className="text-sm text-white/70 mt-2">Submitted {formatDate(latestRequest.created_at)}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href="/app/request-help">
                          <Button variant="outline" size="sm" className="text-white border-white/40 hover:border-white">
                            View request
                          </Button>
                        </Link>
                        {(latestRequest.status === 'APPROVED' || latestRequest.status === 'FULFILLED') && latestRequest.request_type === 'VOUCHER' ? (
                          <Link href="/app/vouchers">
                            <Button variant="outline" size="sm" className="text-white border-white/40 hover:border-white">
                              Open vouchers
                            </Button>
                          </Link>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-white/80">No requests yet</p>
                      <p className="text-2xl font-semibold mt-2">Start a request</p>
                      <p className="text-sm text-white/70 mt-2">Submit a request to receive support updates.</p>
                      <Link href="/app/request-help">
                        <Button variant="outline" size="sm" className="mt-4 text-white border-white/40 hover:border-white">
                          New request
                        </Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-xl">Voucher quick access</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[var(--muted-foreground)] space-y-3">
                  {isLoading ? (
                    <p>Checking vouchers...</p>
                  ) : latestActiveVoucher ? (
                    <>
                      <p className="text-[var(--foreground)] font-semibold">Active voucher code</p>
                      <p className="text-xl tracking-[0.2em] text-[var(--foreground)]">{latestActiveVoucher.code}</p>
                      <Link href="/app/vouchers">
                        <Button variant="outline" size="sm">View all vouchers</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <p>No active voucher yet.</p>
                      <Link href="/app/vouchers">
                        <Button variant="outline" size="sm">Go to voucher wallet</Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-xl">Next steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)]">
                  {nextSteps.map((step) => (
                    <div key={step.title} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary)]" />
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{step.title}</p>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-xl">Support contacts</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[var(--muted-foreground)] space-y-3">
                  <p>EcoEats Help Desk</p>
                  <p className="font-semibold text-[var(--foreground)]">support@ecoeats.org</p>
                  <p>Mon - Fri, 9:00 AM - 5:00 PM</p>
                  <Link href="/contact">
                    <Button variant="outline" size="sm">Get in touch</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
