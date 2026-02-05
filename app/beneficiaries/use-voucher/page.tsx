import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const steps = [
  {
    title: 'Open your voucher wallet',
    description: 'Log in to the EcoEats app and open your voucher wallet to see active vouchers.',
  },
  {
    title: 'Choose a partner location',
    description: 'Pick the partner listed on your voucher or search for nearby partners.',
  },
  {
    title: 'Show your QR code',
    description: 'Present the voucher QR code at the partner counter for scanning.',
  },
  {
    title: 'Confirm pickup',
    description: 'Tap “Confirm” once your meal is received so your history stays accurate.',
  },
];

const tips = [
  { label: 'Bring ID', detail: 'Some partners may ask for ID to confirm the voucher is yours.' },
  { label: 'Arrive on time', detail: 'Voucher windows ensure meals are reserved for you.' },
  { label: 'Need to reschedule?', detail: 'Update your pickup time in the app to avoid expiration.' },
  { label: 'Missing voucher', detail: 'Contact support and we will reissue or extend it if needed.' },
];

export default function BeneficiaryUseVoucherPage() {
  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Use a voucher</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Redeem your meal vouchers with confidence.</h1>
            <p className="text-base text-[var(--muted-foreground)] max-w-2xl">
              Every voucher includes a partner location, expiry window, and QR code. Follow these steps to make sure
              your meal is ready when you arrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/app/vouchers">
                <Button size="lg">View voucher wallet</Button>
              </Link>
              <Link href="/beneficiaries/apply">
                <Button variant="outline" size="lg">Apply for support</Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {steps.map((step) => (
              <Card key={step.title} className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--muted-foreground)]">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-alt)] p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl text-[var(--foreground)]">Quick tips</h2>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">
                  These reminders help you avoid voucher delays.
                </p>
              </div>
              <Link href="/contact">
                <Button variant="outline">Get voucher help</Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 mt-6">
              {tips.map((tip) => (
                <div key={tip.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="font-semibold text-[var(--foreground)]">{tip.label}</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">{tip.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
