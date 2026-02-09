'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function PartnerRedeemPage() {
  const [voucherCode, setVoucherCode] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [mealDescription, setMealDescription] = useState('');
  const [voucherStatus, setVoucherStatus] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState('');

  const [pickupCode, setPickupCode] = useState('');
  const [pickupStatus, setPickupStatus] = useState<string | null>(null);
  const [pickupError, setPickupError] = useState('');

  const handleVoucherRedeem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVoucherStatus(null);
    setVoucherError('');

    try {
      const response = await fetch('/api/redeem/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: voucherCode || undefined,
          qrToken: qrToken || undefined,
          mealDescription: mealDescription || undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to redeem voucher.');
      }

      const data = await response.json();
      setVoucherStatus(`Redeemed voucher ${data.voucher?.code ?? ''}`.trim());
      setVoucherCode('');
      setQrToken('');
      setMealDescription('');
    } catch (err) {
      setVoucherError(err instanceof Error ? err.message : 'Unable to redeem voucher.');
    }
  };

  const handlePickupRedeem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPickupStatus(null);
    setPickupError('');

    try {
      const response = await fetch('/api/redeem/surplus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickupCode }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to confirm pickup.');
      }

      const data = await response.json();
      setPickupStatus(`Pickup confirmed for code ${data.claim?.pickup_code ?? ''}`.trim());
      setPickupCode('');
    } catch (err) {
      setPickupError(err instanceof Error ? err.message : 'Unable to confirm pickup.');
    }
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Redeem</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Confirm vouchers and pickups.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Scan a QR or enter a code to record successful redemptions and surplus pickups.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Redeem a voucher</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleVoucherRedeem}>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    Voucher code
                    <input
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      value={voucherCode}
                      onChange={(event) => setVoucherCode(event.target.value)}
                      placeholder="e.g. ECO-1234"
                    />
                  </label>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    QR token (optional)
                    <input
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      value={qrToken}
                      onChange={(event) => setQrToken(event.target.value)}
                      placeholder="Scan to autofill"
                    />
                  </label>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    Meal description
                    <input
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      value={mealDescription}
                      onChange={(event) => setMealDescription(event.target.value)}
                      placeholder="Optional notes"
                    />
                  </label>

                  {voucherError ? <p className="text-sm text-rose-600">{voucherError}</p> : null}
                  {voucherStatus ? <p className="text-sm text-emerald-600">{voucherStatus}</p> : null}

                  <Button type="submit" size="lg">Confirm voucher</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Confirm surplus pickup</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handlePickupRedeem}>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    Pickup code
                    <input
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      value={pickupCode}
                      onChange={(event) => setPickupCode(event.target.value)}
                      placeholder="e.g. PACK-4492"
                      required
                    />
                  </label>

                  {pickupError ? <p className="text-sm text-rose-600">{pickupError}</p> : null}
                  {pickupStatus ? <p className="text-sm text-emerald-600">{pickupStatus}</p> : null}

                  <Button type="submit" size="lg">Confirm pickup</Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
