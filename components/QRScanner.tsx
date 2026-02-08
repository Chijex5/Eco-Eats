'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type RedeemResponse = {
  success: boolean;
  voucher?: {
    code: string;
    value_kobo: number;
    status: string;
  };
};

type QRScannerProps = {
  title?: string;
  description?: string;
  onRedeemSuccess?: (data: RedeemResponse) => void;
};

export const QRScanner = ({
  title = 'Redeem voucher',
  description = 'Enter the voucher code manually or scan the QR when available.',
  onRedeemSuccess,
}: QRScannerProps) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleRedeem = async () => {
    if (!code.trim()) {
      setStatus('error');
      setMessage('Enter a voucher code to continue.');
      return;
    }

    setStatus('loading');
    setMessage(null);

    try {
      const response = await fetch('/api/redeem/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = (await response.json()) as RedeemResponse & { error?: string };

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Unable to redeem voucher.');
        return;
      }

      setStatus('success');
      setMessage('Voucher redeemed successfully.');
      onRedeemSuccess?.(data);
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm text-[var(--foreground)]">
          Voucher code
          <input
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base text-[var(--foreground)] shadow-[var(--shadow-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/30"
            placeholder="EAT-XXXXXX"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleRedeem} disabled={status === 'loading'}>
            {status === 'loading' ? 'Redeeming...' : 'Redeem voucher'}
          </Button>
          <Button variant="outline" disabled>
            Scan QR (coming soon)
          </Button>
        </div>

        {message ? (
          <p
            className={`text-sm font-medium ${
              status === 'success' ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
};
