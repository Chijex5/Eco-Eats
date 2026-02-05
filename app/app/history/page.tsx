import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const historyItems = [
  {
    title: 'Voucher redeemed at Campus Kitchen',
    detail: 'EAT-4669 • 1 meal credit',
    date: 'Oct 01, 2024',
  },
  {
    title: 'Surplus pack claimed at Green Cafe',
    detail: 'Pickup code: EAT-0421',
    date: 'Sep 26, 2024',
  },
  {
    title: 'Meal voucher approved',
    detail: 'Request ID: REQ-2201',
    date: 'Sep 24, 2024',
  },
  {
    title: 'Support request submitted',
    detail: 'Emergency meal support',
    date: 'Sep 23, 2024',
  },
];

export default function BeneficiaryHistoryPage() {
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
                {historyItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-dashed border-[var(--border)] pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{item.detail}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">{item.date}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
