import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type VoucherStatus = 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'REVOKED';

type VoucherCardProps = {
  code: string;
  valueLabel: string;
  status: VoucherStatus;
  location?: string;
  expiryLabel?: string;
  className?: string;
  onSelect?: () => void;
};

const STATUS_STYLES: Record<VoucherStatus, string> = {
  ACTIVE: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  REDEEMED: 'bg-emerald-100 text-emerald-700',
  EXPIRED: 'bg-amber-100 text-amber-700',
  REVOKED: 'bg-rose-100 text-rose-700',
};

export const VoucherCard = ({
  code,
  valueLabel,
  status,
  location,
  expiryLabel,
  className = '',
  onSelect,
}: VoucherCardProps) => {
  return (
    <Card hover={Boolean(onSelect)} className={className} onClick={onSelect}>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{code}</CardTitle>
            {location ? (
              <p className="text-sm text-[var(--muted-foreground)]">{location}</p>
            ) : null}
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[status]}`}
          >
            {status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Value</p>
          <p className="text-base font-semibold text-[var(--foreground)]">{valueLabel}</p>
        </div>
        {expiryLabel ? (
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Expires</p>
            <p className="text-base font-semibold text-[var(--foreground)]">{expiryLabel}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
