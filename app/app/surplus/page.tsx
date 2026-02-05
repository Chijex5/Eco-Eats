import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const surplusPacks = [
  {
    location: 'Green Cafe',
    items: 'Vegetable wraps + juice',
    window: 'Today, 5:00 - 6:00 PM',
    spots: '4 slots remaining',
  },
  {
    location: 'Campus Kitchen',
    items: 'Rice bowl + fruit',
    window: 'Tomorrow, 12:00 - 1:00 PM',
    spots: '2 slots remaining',
  },
  {
    location: 'Community Hub',
    items: 'Soup + bread pack',
    window: 'Tomorrow, 6:00 - 7:00 PM',
    spots: '5 slots remaining',
  },
];

const tips = [
  'Claiming a pack reserves a pickup code for you.',
  'Cancel within the app if you cannot make it.',
  'Surplus packs update every few hours as partners post new meals.',
];

export default function SurplusPacksPage() {
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

          <section className="grid gap-4">
            {surplusPacks.map((pack) => (
              <Card key={pack.location} className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle>{pack.location}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
                  <p>{pack.items}</p>
                  <p>{pack.window}</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">{pack.spots}</span>
                    <Button variant="outline" size="sm">Claim pack</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
