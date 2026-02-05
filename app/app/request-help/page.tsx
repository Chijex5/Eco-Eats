import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const requestQueue = [
  {
    title: 'Meal voucher request',
    status: 'Pending review',
    time: 'Submitted today, 09:12',
  },
  {
    title: 'Surplus pack request',
    status: 'Approved',
    time: 'Approved yesterday, 16:30',
  },
  {
    title: 'Emergency meal support',
    status: 'More info needed',
    time: 'Updated Monday, 11:10',
  },
];

const helpfulTips = [
  'Provide a preferred pickup window so partners can prepare meals for you.',
  'Upload any supporting documents to shorten review time.',
  'Share a backup phone number in case your primary contact is unreachable.',
];

export default function RequestHelpPage() {
  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Request help</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Submit a new support request.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Tell us the type of support you need and when you are available for pickup. We keep you updated at every
              step.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>New request form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label htmlFor="request-type" className="text-sm text-[var(--muted-foreground)]">
                    Request type
                    <select id="request-type" className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
                      <option>Meal voucher</option>
                      <option>Surplus pack</option>
                      <option>Emergency meal</option>
                    </select>
                  </label>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    Household size
                    <input
                      type="number"
                      min={1}
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      placeholder="e.g. 4"
                    />
                  </label>
                </div>
                <label className="text-sm text-[var(--muted-foreground)]">
                  Preferred pickup window
                  <input
                    type="text"
                    className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                    placeholder="e.g. Mon - Wed, 3-5 PM"
                  />
                </label>
                <label className="text-sm text-[var(--muted-foreground)]">
                  Short message
                  <textarea
                    rows={4}
                    className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                    placeholder="Share any details that help us support you."
                  />
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg">Submit request</Button>
                  <Link href="/beneficiaries/apply">
                    <Button variant="outline" size="lg">Eligibility guide</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Helpful tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                {helpfulTips.map((tip) => (
                  <p key={tip}>• {tip}</p>
                ))}
                <Link href="/contact">
                  <Button variant="outline" size="sm">Chat with support</Button>
                </Link>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Your request queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {requestQueue.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[var(--border)] px-4 py-4">
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{item.time}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-[var(--primary)]">{item.status}</span>
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
