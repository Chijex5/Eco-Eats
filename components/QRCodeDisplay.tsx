'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';

type QRCodeDisplayProps = {
  value: string;
  label?: string;
  helperText?: string;
  size?: number;
  className?: string;
};

export const QRCodeDisplay = ({
  value,
  label = 'Voucher QR',
  helperText = 'Present this QR code at a partner counter.',
  size = 180,
  className = '',
}: QRCodeDisplayProps) => {
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [imageError, setImageError] = useState(false);

  const qrUrl = useMemo(() => {
    const params = new URLSearchParams({
      size: `${size}x${size}`,
      data: value,
    });
    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
  }, [size, value]);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('idle');
    }
  };

  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-soft)] ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
          <p className="text-lg font-semibold text-[var(--foreground)]">{value || 'No code assigned'}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!value}>
          {copyState === 'copied' ? 'Copied' : 'Copy code'}
        </Button>
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        <div
          className="flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
          style={{ width: size + 32, height: size + 32 }}
        >
          {value && !imageError ? (
            <img
              src={qrUrl}
              alt={`QR code for voucher ${value}`}
              width={size}
              height={size}
              className="rounded-xl"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-center text-sm text-[var(--muted-foreground)]">
              QR preview unavailable
            </div>
          )}
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">{helperText}</p>
      </div>
    </div>
  );
};
