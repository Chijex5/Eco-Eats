'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type HistoryItem = {
  id: string;
  title: string;
  detail: string;
  occurred_at: string;
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

export default function BeneficiaryHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/history');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load history.');
        }
        const data = (await response.json()) as { items: HistoryItem[] };
        setItems(data.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load history.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">History</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Your support timeline.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Review the actions you have taken and the meals you have received. This history keeps your support plan
              transparent and easy to share with case managers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/app/request-help">
                <Button size="lg">New request</Button>
              </Link>
              <Link href="/app/vouchers">
                <Button variant="outline" size="lg">Open vouchers</Button>
              </Link>
            </div>
          </section>

          <section>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-[var(--muted-foreground)]">Loading history...</p>
                ) : error ? (
                  <p className="text-sm text-rose-600">{error}</p>
                ) : items.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No activity yet.</p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-dashed border-[var(--border)] pb-4 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                        <p className="text-sm text-[var(--muted-foreground)]">{item.detail}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                        {formatDate(item.occurred_at)}
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
