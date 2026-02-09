import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const impactMetrics = [
  { label: 'Total requests', value: '94', detail: '14 pending review' },
  { label: 'Vouchers issued', value: '68', detail: '₦170,000 total value' },
  { label: 'Meals served', value: '53', detail: 'Redemptions confirmed' },
  { label: 'Active vouchers', value: '15', detail: 'Ready to redeem' },
];

const insightNotes = [
  'Peak redemptions occur between 12 PM and 3 PM.',
  'Voucher redemption rate is 78% in the past 30 days.',
  'Top partner: Campus Kitchen (18 meals served).',
];

export default function AdminImpactPage() {
  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)] font-semibold">
                Admin impact
              </p>
              <h1 className="text-4xl sm:text-5xl text-[var(--foreground)] font-semibold">
                Measure meals served.
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                Track request approvals, voucher issuance, and redemptions across the EcoEats network.
              </p>
            </div>
            <Link href="/admin/requests">
              <Button variant="outline" size="lg">Review requests</Button>
            </Link>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {impactMetrics.map((metric) => (
              <Card key={metric.label} className="shadow-[var(--shadow)]">
                <CardContent className="pt-6 pb-6 space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)] font-semibold">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-semibold text-[var(--foreground)]">{metric.value}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{metric.detail}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Impact insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                {insightNotes.map((note) => (
                  <p key={note}>• {note}</p>
                ))}
                <p className="text-xs text-[var(--muted-foreground)]">
                  Impact analytics will update automatically once the impact API is connected.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Operational focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)]">
                <p>Increase redemption reminders for vouchers expiring in 7 days.</p>
                <p>Share weekly impact highlights with donors and partners.</p>
                <p>Monitor partners with low redemption activity for support.</p>
                <Link href="/admin/partners">
                  <Button variant="outline" size="sm" className="w-full">
                    Review partner performance
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
