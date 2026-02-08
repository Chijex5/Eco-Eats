import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { VoucherCard } from '@/components/VoucherCard';
import { VoucherStatus } from '@/components/VoucherCard';

const vouchers: Array<{
  code: string;
  location: string;
  status: VoucherStatus;
  expiryLabel: string;
  valueLabel: string;
}> = [
  {
    code: 'EAT-4821',
    location: 'Campus Kitchen',
    status: 'ACTIVE',
    expiryLabel: 'Valid until Oct 14, 2024',
    valueLabel: '₦2,500 meal credit',
  },
  {
    code: 'EAT-4903',
    location: 'Green Cafe',
    status: 'ACTIVE',
    expiryLabel: 'Valid until Oct 18, 2024',
    valueLabel: '₦1,500 meal credit',
  },
  {
    code: 'EAT-4669',
    location: 'Community Hub',
    status: 'REDEEMED',
    expiryLabel: 'Redeemed Oct 01, 2024',
    valueLabel: '₦2,000 meal credit',
  },
];

const reminders = [
  'Show the QR code at the partner counter.',
  'Arrive during the listed pickup window.',
  'Let us know if a voucher is about to expire.',
];

export default function VoucherWalletPage() {
  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Voucher wallet</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Your vouchers in one place.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Keep track of every voucher, redemption code, and pickup location. Tap a voucher to view the QR code when
              you are ready to redeem.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/beneficiaries/use-voucher">
                <Button size="lg">How to redeem</Button>
              </Link>
              <Link href="/app/request-help">
                <Button variant="outline" size="lg">Request more support</Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-4">
            {vouchers.map((voucher) => (
              <div key={voucher.code} className="flex flex-col gap-3">
                <VoucherCard
                  code={voucher.code}
                  location={voucher.location}
                  status={voucher.status}
                  valueLabel={voucher.valueLabel}
                  expiryLabel={voucher.expiryLabel}
                />
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">View QR code</Button>
                </div>
              </div>
            ))}
          </section>

          <section>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Reminder checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
                {reminders.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
                <Link href="/contact">
                  <Button variant="outline" size="sm">Get help</Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
