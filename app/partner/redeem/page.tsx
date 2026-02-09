'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type Voucher = {
  id: string;
  code: string;
  qr_token: string;
  value_kobo: number;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'REVOKED';
  expires_at?: string;
};

type Redemption = {
  id: string;
  redeemed_at: string;
  meal_description?: string | null;
  value_kobo: number;
};

type RedemptionResult = {
  voucher: Voucher;
  redemption: Redemption;
};

const formatCurrency = (valueKobo: number) => {
  const value = valueKobo / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function PartnerRedeemPage() {
  const [mode, setMode] = useState<'code' | 'qr'>('code');
  const [code, setCode] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [mealDescription, setMealDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<RedemptionResult | null>(null);

  const handleRedeem = async () => {
    setError('');
    setResult(null);

    const payload =
      mode === 'code'
        ? { code: code.trim(), mealDescription: mealDescription.trim() || undefined }
        : { qrToken: qrToken.trim(), mealDescription: mealDescription.trim() || undefined };

    if (mode === 'code' && !payload.code) {
      setError('Enter a voucher code to continue.');
      return;
    }

    if (mode === 'qr' && !payload.qrToken) {
      setError('Enter a QR token to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/redeem/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as RedemptionResult & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || 'Unable to redeem voucher.');
      }

      setResult({ voucher: data.voucher, redemption: data.redemption });
      setCode('');
      setQrToken('');
      setMealDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to redeem voucher.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Partner redemption</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Redeem vouchers on the spot.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Enter the voucher code or QR token provided by a beneficiary. Confirm redemption after verifying their ID.
            </p>
          </section>

          <Card className="shadow-[var(--shadow)]">
            <CardHeader>
              <CardTitle>Redeem a voucher</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={mode === 'code' ? 'default' : 'outline'}
                  onClick={() => setMode('code')}
                >
                  Enter code
                </Button>
                <Button
                  size="sm"
                  variant={mode === 'qr' ? 'default' : 'outline'}
                  onClick={() => setMode('qr')}
                >
                  Scan QR / token
                </Button>
              </div>

              {mode === 'code' ? (
                <label className="text-sm text-[var(--muted-foreground)]">
                  Voucher code
                  <input
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="Enter voucher code"
                    className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                  />
                </label>
              ) : (
                <label className="text-sm text-[var(--muted-foreground)]">
                  QR token
                  <input
                    value={qrToken}
                    onChange={(event) => setQrToken(event.target.value)}
                    placeholder="Paste QR token"
                    className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                  />
                </label>
              )}

              <label className="text-sm text-[var(--muted-foreground)]">
                Meal description (optional)
                <input
                  value={mealDescription}
                  onChange={(event) => setMealDescription(event.target.value)}
                  placeholder="E.g. Hot meal + drink"
                  className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                />
              </label>

              {error ? <p className="text-sm text-rose-600">{error}</p> : null}

              <Button size="sm" onClick={handleRedeem} disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : 'Confirm redemption'}
              </Button>
              <p className="text-xs text-[var(--muted-foreground)]">
                QR camera scanning will be available in a future update. For now, enter the code or token manually.
              </p>
            </CardContent>
          </Card>

          {result ? (
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Redemption confirmed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-[var(--muted-foreground)]">
                  Voucher <span className="font-semibold text-[var(--foreground)]">{result.voucher.code}</span> redeemed
                  successfully.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-[var(--border)] px-3 py-3">
                    <p className="text-xs text-[var(--muted-foreground)]">Meal value</p>
                    <p className="text-base font-semibold text-[var(--foreground)]">
                      {formatCurrency(result.voucher.value_kobo)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] px-3 py-3">
                    <p className="text-xs text-[var(--muted-foreground)]">Redeemed at</p>
                    <p className="text-base font-semibold text-[var(--foreground)]">
                      {formatDateTime(result.redemption.redeemed_at)}
                    </p>
                  </div>
                </div>
                {result.redemption.meal_description ? (
                  <p className="text-[var(--muted-foreground)]">
                    Meal description: {result.redemption.meal_description}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
