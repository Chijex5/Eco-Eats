import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const vouchers = [
  {
    code: 'EAT-4821',
    location: 'Campus Kitchen',
    status: 'Active',
    expiry: 'Valid until Oct 14, 2024',
    value: '₦2,500 meal credit',
  },
  {
    code: 'EAT-4903',
    location: 'Green Cafe',
    status: 'Active',
    expiry: 'Valid until Oct 18, 2024',
    value: '₦1,500 meal credit',
  },
  {
    code: 'EAT-4669',
    location: 'Community Hub',
    status: 'Redeemed',
    expiry: 'Redeemed Oct 01, 2024',
    value: '₦2,000 meal credit',
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
              <Card key={voucher.code} className="shadow-[var(--shadow)]">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle>{voucher.code}</CardTitle>
                    <p className="text-sm text-[var(--muted-foreground)]">{voucher.location}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">{voucher.status}</span>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-[var(--muted-foreground)] space-y-1">
                    <p>{voucher.value}</p>
                    <p>{voucher.expiry}</p>
                  </div>
                  <Button variant="outline" size="sm">View QR code</Button>
                </CardContent>
              </Card>
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
