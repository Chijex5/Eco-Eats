'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type SurplusListing = {
  id: string;
  title: string;
  description?: string | null;
  pickup_deadline: string;
  quantity_available: number;
  claimed_count: number;
  partner_name?: string | null;
};

type SurplusClaim = {
  id: string;
  listing_id: string;
  pickup_code: string;
  status: 'PENDING' | 'PICKED_UP' | 'CANCELLED';
  title: string;
  partner_name?: string | null;
  pickup_deadline: string;
  created_at: string;
};

const formatPickupWindow = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Pickup window to be confirmed';
  return `Pickup by ${date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })}`;
};

const tips = [
  'Claiming a pack reserves a pickup code for you.',
  'Cancel within the app if you cannot make it.',
  'Surplus packs update every few hours as partners post new meals.',
];

export default function SurplusPacksPage() {
  const [packs, setPacks] = useState<SurplusListing[]>([]);
  const [claims, setClaims] = useState<SurplusClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimingId, setClaimingId] = useState('');
  const [claimMessage, setClaimMessage] = useState('');
  const [hasApprovedFoodPack, setHasApprovedFoodPack] = useState(false);
  const [canClaimSurplus, setCanClaimSurplus] = useState(false);

  const loadPacks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/surplus/available');
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to load surplus packs.');
      }
      const data = (await response.json()) as {
        listings: SurplusListing[];
        hasApprovedFoodPack?: boolean;
        canClaimSurplus?: boolean;
        claims?: SurplusClaim[];
      };
      setPacks(data.listings ?? []);
      setHasApprovedFoodPack(Boolean(data.hasApprovedFoodPack));
      setCanClaimSurplus(Boolean(data.canClaimSurplus));
      setClaims(data.claims ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load surplus packs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
  }, []);

  const handleClaim = async (listingId: string) => {
    setClaimingId(listingId);
    setClaimMessage('');
    try {
      const response = await fetch('/api/surplus/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error || 'Unable to claim this pack.');
      }
      setClaimMessage('Pack claimed successfully. Check your accepted offers below for pickup details.');
      await loadPacks();
    } catch (err) {
      setClaimMessage(err instanceof Error ? err.message : 'Unable to claim this pack.');
    } finally {
      setClaimingId('');
    }
  };

  const formattedPacks = useMemo(
    () =>
      packs.map((pack) => {
        const remaining = Math.max(pack.quantity_available - pack.claimed_count, 0);
        const claimedByMe = claims.some(
          (claim) => claim.listing_id === pack.id && (claim.status === 'PENDING' || claim.status === 'PICKED_UP')
        );
        return {
          ...pack,
          remaining,
          claimedByMe,
        };
      }),
    [packs, claims]
  );

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Surplus packs</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Browse surplus meals near you.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Partners share surplus meals daily. Claim a pack to receive a pickup code and a time window.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/app/request-help">
                <Button size="lg">Request full support</Button>
              </Link>
              <Link href="/app/history">
                <Button variant="outline" size="lg">View history</Button>
              </Link>
            </div>
          </section>

          {!isLoading && !hasApprovedFoodPack ? (
            <Card className="shadow-[var(--shadow)] border-amber-200 bg-amber-50/70">
              <CardContent className="py-5 text-sm text-amber-700">
                You do not have an approved food pack request yet. Submit a food pack request first before claiming surplus packs.
              </CardContent>
            </Card>
          ) : null}

          {!isLoading && hasApprovedFoodPack && !canClaimSurplus ? (
            <Card className="shadow-[var(--shadow)] border-amber-200 bg-amber-50/70">
              <CardContent className="py-5 text-sm text-amber-700">
                Your approved food pack request has already been used. Cancel your current surplus claim before claiming another.
              </CardContent>
            </Card>
          ) : null}

          {claimMessage ? (
            <Card className="shadow-[var(--shadow)]">
              <CardContent className="py-4 text-sm text-[var(--foreground)]">{claimMessage}</CardContent>
            </Card>
          ) : null}

          <section>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Accepted surplus offers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {claims.length === 0 ? (
                  <p className="text-[var(--muted-foreground)]">No accepted surplus offers yet.</p>
                ) : (
                  claims.map((claim) => (
                    <div key={claim.id} className="rounded-xl border border-[var(--border)] px-4 py-3">
                      <p className="font-semibold text-[var(--foreground)]">{claim.title}</p>
                      <p className="text-[var(--muted-foreground)]">{claim.partner_name ?? 'Partner location'}</p>
                      <p className="text-[var(--muted-foreground)]">Pickup code: <span className="font-semibold text-[var(--foreground)]">{claim.pickup_code}</span></p>
                      <p className="text-[var(--muted-foreground)]">{formatPickupWindow(claim.pickup_deadline)}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4">
            {isLoading ? (
              <Card className="shadow-[var(--shadow)]">
                <CardContent className="py-8 text-sm text-[var(--muted-foreground)]">
                  Loading surplus packs...
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="shadow-[var(--shadow)]">
                <CardContent className="py-8 text-sm text-rose-600">{error}</CardContent>
              </Card>
            ) : formattedPacks.length === 0 ? (
              <Card className="shadow-[var(--shadow)]">
                <CardContent className="py-8 text-sm text-[var(--muted-foreground)]">
                  No surplus packs are available right now. Check back soon.
                </CardContent>
              </Card>
            ) : (
              formattedPacks.map((pack) => (
                <Card key={pack.id} className="shadow-[var(--shadow)]">
                  <CardHeader>
                    <CardTitle>{pack.partner_name ?? 'Partner location'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    <p className="text-[var(--foreground)] font-semibold">{pack.title}</p>
                    {pack.description ? <p>{pack.description}</p> : null}
                    <p>{formatPickupWindow(pack.pickup_deadline)}</p>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">
                        {pack.remaining} slots remaining
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClaim(pack.id)}
                        disabled={!hasApprovedFoodPack || !canClaimSurplus || pack.remaining === 0 || pack.claimedByMe || claimingId === pack.id}
                      >
                        {!hasApprovedFoodPack
                          ? 'Approval required'
                          : !canClaimSurplus
                            ? 'Request used'
                            : pack.claimedByMe
                            ? 'Claimed'
                            : pack.remaining === 0
                              ? 'Sold out'
                              : claimingId === pack.id
                                ? 'Claiming...'
                                : 'Claim pack'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </section>

          <section>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Before you claim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
                {tips.map((tip) => (
                  <p key={tip}>• {tip}</p>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
