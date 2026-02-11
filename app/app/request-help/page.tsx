'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const helpfulTips = [
  "Share when you're usually available so partners can prepare meals for you.",
  'Share any supporting details that help the team verify your request quickly.',
  'Keep your phone on in case the support team needs clarification.',
];

type SupportRequest = {
  id: string;
  request_type: 'VOUCHER' | 'FOOD_PACK';
  urgency: 'LOW' | 'MED' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'FULFILLED';
  message?: string;
  created_at: string;
};

const STATUS_LABELS: Record<SupportRequest['status'], string> = {
  PENDING: 'Pending review',
  APPROVED: 'Approved',
  DECLINED: 'Declined',
  FULFILLED: 'Fulfilled',
};

const REQUEST_TYPE_LABELS: Record<SupportRequest['request_type'], string> = {
  VOUCHER: 'Meal voucher',
  FOOD_PACK: 'Food pack',
};

const URGENCY_LABELS: Record<SupportRequest['urgency'], string> = {
  LOW: 'Low urgency',
  MED: 'Medium urgency',
  HIGH: 'High urgency',
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function RequestHelpPage() {
  const router = useRouter();
  const [requestType, setRequestType] = useState<'VOUCHER' | 'FOOD_PACK'>('VOUCHER');
  const [urgency, setUrgency] = useState<'LOW' | 'MED' | 'HIGH'>('MED');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [requestsError, setRequestsError] = useState('');
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoadingRequests(true);
      setRequestsError('');
      try {
        const response = await fetch('/api/requests/me');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load requests.');
        }
        const data = (await response.json()) as { requests: SupportRequest[] };
        setRequests(data.requests || []);
      } catch (error) {
        setRequestsError(error instanceof Error ? error.message : 'Unable to load requests.');
      } finally {
        setIsLoadingRequests(false);
      }
    };

    loadRequests();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType,
          message,
          urgency,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Something went wrong.');
      }

      setSubmitSuccess(true);
      setMessage('');
      setTimeout(() => {
        router.push('/app');
      }, 1200);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const recentRequests = requests.slice(0, 3);

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Request help</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Submit a new support request.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Tell us what support you need and how urgent it is. We&apos;ll keep you updated after you submit the
              request.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>New request form</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label htmlFor="request-type" className="text-sm text-[var(--muted-foreground)]">
                      Request type
                      <select
                        id="request-type"
                        className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                        value={requestType}
                        onChange={(event) => setRequestType(event.target.value as 'VOUCHER' | 'FOOD_PACK')}
                      >
                        <option value="VOUCHER">Meal voucher</option>
                        <option value="FOOD_PACK">Food pack</option>
                      </select>
                    </label>
                    <label htmlFor="urgency" className="text-sm text-[var(--muted-foreground)]">
                      Urgency
                      <select
                        id="urgency"
                        className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                        value={urgency}
                        onChange={(event) => setUrgency(event.target.value as 'LOW' | 'MED' | 'HIGH')}
                      >
                        <option value="LOW">Low</option>
                        <option value="MED">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </label>
                  </div>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    Short message
                    <textarea
                      rows={4}
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      placeholder="Share any details that help us support you."
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                    />
                  </label>
                  {submitError ? (
                    <p className="text-sm text-rose-600">{submitError}</p>
                  ) : null}
                  {submitSuccess ? (
                    <p className="text-sm text-emerald-600">Request submitted! Redirecting to your dashboard...</p>
                  ) : null}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit request'}
                    </Button>
                    <Link href="/beneficiaries/apply">
                      <Button variant="outline" size="lg" type="button">Eligibility guide</Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Helpful tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                {helpfulTips.map((tip) => (
                  <p key={tip}>• {tip}</p>
                ))}
                <Link href="/contact">
                  <Button variant="outline" size="sm">Chat with support</Button>
                </Link>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Your recent requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingRequests ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Loading requests...</p>
                ) : requestsError ? (
                  <p className="text-sm text-rose-600">{requestsError}</p>
                ) : recentRequests.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No requests yet. Submit one above!</p>
                ) : (
                  recentRequests.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] px-4 py-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">
                            {REQUEST_TYPE_LABELS[item.request_type]} · {URGENCY_LABELS[item.urgency]}
                          </p>
                          <p className="text-sm text-[var(--muted-foreground)]">Submitted {formatDate(item.created_at)}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">
                          {STATUS_LABELS[item.status]}
                        </span>
                      </div>
                      {item.request_type === 'VOUCHER' && (item.status === 'APPROVED' || item.status === 'FULFILLED') ? (
                        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2">
                          <p className="text-xs text-[var(--muted-foreground)]">
                            Voucher approved. Open wallet to view voucher code and QR.
                          </p>
                          <Link href="/app/vouchers">
                            <Button size="sm" variant="outline">Open wallet</Button>
                          </Link>
                        </div>
                      ) : null}
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
