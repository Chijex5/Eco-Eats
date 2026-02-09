'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const STATUS_STYLES: Record<SupportRequest['status'], string> = {
  PENDING: 'bg-[var(--secondary)]/15 text-[var(--secondary)]',
  APPROVED: 'bg-[var(--primary)]/15 text-[var(--primary)]',
  DECLINED: 'bg-[var(--destructive)]/15 text-[var(--destructive)]',
  FULFILLED: 'bg-[var(--accent)]/15 text-[var(--accent)]',
};

const metaBadgeStyles = 'rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-1 text-[var(--foreground)]';

const REQUEST_TYPE_LABELS: Record<SupportRequest['request_type'], string> = {
  VOUCHER: 'Voucher',
  FOOD_PACK: 'Food pack',
};

const URGENCY_LABELS: Record<SupportRequest['urgency'], string> = {
  LOW: 'Low',
  MED: 'Medium',
  HIGH: 'High',
};

type SupportRequest = {
  id: string;
  request_type: 'VOUCHER' | 'FOOD_PACK';
  urgency: 'LOW' | 'MED' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'FULFILLED';
  message?: string;
  created_at: string;
  full_name: string;
  email: string;
};

type VoucherFormState = {
  valueNaira: string;
  expiresInDays: string;
  isSubmitting: boolean;
  error?: string;
  success?: string;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatCurrency = (valueKobo: number) => {
  const value = valueKobo / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [voucherForms, setVoucherForms] = useState<Record<string, VoucherFormState>>({});

  const loadRequests = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/requests');
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to load requests.');
      }
      const data = (await response.json()) as { requests: SupportRequest[] };
      setRequests(data.requests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === 'PENDING'),
    [requests]
  );

  const approvedRequests = useMemo(
    () => requests.filter((request) => request.status === 'APPROVED'),
    [requests]
  );

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'DECLINED') => {
    try {
      const response = await fetch(`/api/admin/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to update request.');
      }
      const data = (await response.json()) as { request: SupportRequest };
      setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, ...data.request } : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update request.');
    }
  };

  const updateVoucherForm = (id: string, updates: Partial<VoucherFormState>) => {
    setVoucherForms((prev) => ({
      ...prev,
      [id]: {
        valueNaira: prev[id]?.valueNaira ?? '2500',
        expiresInDays: prev[id]?.expiresInDays ?? '30',
        isSubmitting: prev[id]?.isSubmitting ?? false,
        ...updates,
      },
    }));
  };

  const handleIssueVoucher = async (request: SupportRequest) => {
    const form = voucherForms[request.id] || { valueNaira: '2500', expiresInDays: '30', isSubmitting: false };
    const valueNumber = Number(form.valueNaira);
    const expiresNumber = Number(form.expiresInDays);

    if (!Number.isFinite(valueNumber) || valueNumber <= 0) {
      updateVoucherForm(request.id, { error: 'Enter a valid voucher value.' });
      return;
    }

    if (!Number.isFinite(expiresNumber) || expiresNumber <= 0) {
      updateVoucherForm(request.id, { error: 'Enter a valid expiry (days).' });
      return;
    }

    updateVoucherForm(request.id, { isSubmitting: true, error: undefined, success: undefined });

    try {
      const response = await fetch('/api/admin/vouchers/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          valueKobo: Math.round(valueNumber * 100),
          expiresInDays: Math.round(expiresNumber),
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to issue voucher.');
      }
      updateVoucherForm(request.id, {
        isSubmitting: false,
        success: 'Voucher issued and request marked as fulfilled.',
      });
      await loadRequests();
    } catch (err) {
      updateVoucherForm(request.id, {
        isSubmitting: false,
        error: err instanceof Error ? err.message : 'Unable to issue voucher.',
      });
    }
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Admin requests</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Review beneficiary requests.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Approve or decline requests, then issue vouchers for approved beneficiaries.
            </p>
          </section>

          {error ? (
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="py-6 text-sm text-rose-600">{error}</CardContent>
            </Card>
          ) : null}

          <section className="space-y-4">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Pending requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Loading pending requests...</p>
                ) : pendingRequests.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No pending requests right now.</p>
                ) : (
                  pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] px-4 py-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{request.full_name}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{request.email}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={metaBadgeStyles}>
                            {REQUEST_TYPE_LABELS[request.request_type]}
                          </span>
                          <span className={metaBadgeStyles}>
                            Urgency: {URGENCY_LABELS[request.urgency]}
                          </span>
                          <span className={metaBadgeStyles}>
                            {formatDate(request.created_at)}
                          </span>
                        </div>
                      </div>
                      {request.message ? (
                        <p className="text-sm text-[var(--muted-foreground)]">{request.message}</p>
                      ) : null}
                      <div className="flex flex-wrap gap-3">
                        <Button size="sm" onClick={() => handleStatusUpdate(request.id, 'APPROVED')}>
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(request.id, 'DECLINED')}>
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Approved requests ready for vouchers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Loading approved requests...</p>
                ) : approvedRequests.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No approved requests ready yet.</p>
                ) : (
                  approvedRequests.map((request) => {
                    const form = voucherForms[request.id] || {
                      valueNaira: '2500',
                      expiresInDays: '30',
                      isSubmitting: false,
                    };

                    return (
                      <div
                        key={request.id}
                        className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] px-4 py-4"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-semibold text-[var(--foreground)]">{request.full_name}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{request.email}</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[request.status]}`}
                          >
                            {request.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={metaBadgeStyles}>
                            {REQUEST_TYPE_LABELS[request.request_type]}
                          </span>
                          <span className={metaBadgeStyles}>
                            Urgency: {URGENCY_LABELS[request.urgency]}
                          </span>
                          <span className={metaBadgeStyles}>
                            {formatDate(request.created_at)}
                          </span>
                        </div>

                        {request.request_type !== 'VOUCHER' ? (
                          <p className="text-sm text-[var(--muted-foreground)]">
                            This request is for a food pack and doesn&apos;t require voucher issuance.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <label className="text-sm text-[var(--muted-foreground)]">
                                Voucher value (₦)
                                <input
                                  type="number"
                                  min={1}
                                  className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                                  value={form.valueNaira}
                                  onChange={(event) =>
                                    updateVoucherForm(request.id, { valueNaira: event.target.value })
                                  }
                                />
                              </label>
                              <label className="text-sm text-[var(--muted-foreground)]">
                                Expiry (days)
                                <input
                                  type="number"
                                  min={1}
                                  className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                                  value={form.expiresInDays}
                                  onChange={(event) =>
                                    updateVoucherForm(request.id, { expiresInDays: event.target.value })
                                  }
                                />
                              </label>
                            </div>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              Estimated voucher value: {formatCurrency(Math.round(Number(form.valueNaira || 0) * 100))}
                            </p>
                            {form.error ? <p className="text-sm text-rose-600">{form.error}</p> : null}
                            {form.success ? <p className="text-sm text-emerald-600">{form.success}</p> : null}
                            <Button
                              size="sm"
                              onClick={() => handleIssueVoucher(request)}
                              disabled={form.isSubmitting}
                            >
                              {form.isSubmitting ? 'Issuing...' : 'Issue voucher'}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
