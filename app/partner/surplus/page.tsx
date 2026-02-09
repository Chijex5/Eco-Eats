'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type PartnerProfile = {
  id: string;
  name: string;
};

type SurplusListing = {
  id: string;
  title: string;
  description?: string | null;
  quantity_available: number;
  claim_limit_per_user: number;
  pickup_deadline: string;
  status: string;
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return 'Unknown';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function PartnerSurplusPage() {
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [listings, setListings] = useState<SurplusListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [claimLimit, setClaimLimit] = useState(1);
  const [pickupDeadline, setPickupDeadline] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  const loadListings = async (partnerId: string) => {
    const response = await fetch(`/api/partners/${partnerId}/surplus`);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'Unable to load surplus listings.');
    }
    const data = await response.json();
    setListings(data.listings || []);
  };

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
        await loadListings(data.partner.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load partner profile.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPartner();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!partner) {
      return;
    }
    setSubmitState('saving');
    setSubmitError('');
    try {
      const response = await fetch(`/api/partners/${partner.id}/surplus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          quantityAvailable: quantity,
          claimLimitPerUser: claimLimit,
          pickupDeadline,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to create listing.');
      }

      setSubmitState('success');
      setTitle('');
      setDescription('');
      setQuantity(10);
      setClaimLimit(1);
      setPickupDeadline('');
      await loadListings(partner.id);
    } catch (err) {
      setSubmitState('error');
      setSubmitError(err instanceof Error ? err.message : 'Unable to create listing.');
    }
  };

  const activeListings = useMemo(() => listings.filter((listing) => listing.status === 'ACTIVE'), [listings]);

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Surplus listings</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Post today&apos;s surplus packs.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Keep your surplus inventory updated so beneficiaries can claim pickups quickly.
            </p>
          </section>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {isLoading ? <p className="text-sm text-[var(--muted-foreground)]">Loading listings...</p> : null}

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Create a new listing</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    Title
                    <input
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="e.g. 12 rice bowls"
                      required
                    />
                  </label>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    Description
                    <textarea
                      rows={3}
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Include dietary notes or pickup instructions."
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm text-[var(--muted-foreground)]">
                      Quantity available
                      <input
                        type="number"
                        min={1}
                        className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                        value={quantity}
                        onChange={(event) => setQuantity(Number(event.target.value))}
                        required
                      />
                    </label>
                    <label className="text-sm text-[var(--muted-foreground)]">
                      Claim limit per person
                      <input
                        type="number"
                        min={1}
                        className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                        value={claimLimit}
                        onChange={(event) => setClaimLimit(Number(event.target.value))}
                      />
                    </label>
                  </div>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    Pickup deadline
                    <input
                      type="datetime-local"
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      value={pickupDeadline}
                      onChange={(event) => setPickupDeadline(event.target.value)}
                      required
                    />
                  </label>

                  {submitState === 'error' ? (
                    <p className="text-sm text-rose-600">{submitError}</p>
                  ) : null}
                  {submitState === 'success' ? (
                    <p className="text-sm text-emerald-600">Listing posted successfully.</p>
                  ) : null}

                  <Button type="submit" size="lg" disabled={submitState === 'saving'}>
                    {submitState === 'saving' ? 'Posting...' : 'Post listing'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Active listings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeListings.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No active listings yet.</p>
                ) : (
                  activeListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="border-b border-dashed border-[var(--border)] pb-4 last:border-0 last:pb-0"
                    >
                      <p className="font-semibold text-[var(--foreground)]">{listing.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{listing.description || 'No details'}</p>
                      <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">
                          {listing.quantity_available} packs
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          Pickup by {formatDateTime(listing.pickup_deadline)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Listing tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <p>• Keep pickup windows tight so beneficiaries can plan.</p>
                <p>• List dietary details to reduce waste and no-shows.</p>
                <p>• Confirm pickups in the Redeem tab to close the loop.</p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
