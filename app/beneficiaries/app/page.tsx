import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const features = [
  {
    title: 'Request help fast',
    description: 'Submit support requests in minutes and see your approval timeline instantly.',
  },
  {
    title: 'Voucher wallet',
    description: 'Store every voucher, expiry date, and redemption code in one secure place.',
  },
  {
    title: 'Pickup guidance',
    description: 'Get clear pickup windows, partner addresses, and directions before you travel.',
  },
  {
    title: 'Support history',
    description: 'Review past requests and learn from feedback to improve future approvals.',
  },
];

const quickLinks = [
  { label: 'Beneficiary dashboard', href: '/app' },
  { label: 'Apply for support', href: '/beneficiaries/apply' },
  { label: 'Voucher instructions', href: '/beneficiaries/use-voucher' },
];

export default function BeneficiaryAppPage() {
  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Beneficiary app</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Everything you need, right in the EcoEats app.</h1>
            <p className="text-base text-[var(--muted-foreground)] max-w-2xl">
              Manage your requests, vouchers, and partner pickups from a single dashboard built for clarity.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/signup">
                <Button size="lg">Create an account</Button>
              </Link>
              <Link href="/app">
                <Button variant="outline" size="lg">Open the app</Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--muted-foreground)]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-alt)] p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl text-[var(--foreground)]">Need a quick start?</h2>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">
                  Jump straight to the sections beneficiaries use most.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Button variant="outline" size="sm">{link.label}</Button>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
