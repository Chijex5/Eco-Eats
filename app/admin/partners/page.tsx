import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const partnerUpdates = [
  {
    name: 'Campus Kitchen',
    status: 'Active',
    detail: '6 redemptions this week',
  },
  {
    name: 'Sunrise Bites',
    status: 'Onboarding',
    detail: 'Awaiting contract signature',
  },
  {
    name: 'Green Bowl',
    status: 'Active',
    detail: '2 surplus listings live',
  },
];

const onboardingSteps = [
  'Confirm partner profile details and menu range.',
  'Assign staff users for redemption access.',
  'Schedule pickup or redemption training session.',
];

export default function AdminPartnersPage() {
  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)] font-semibold">
                Admin partners
              </p>
              <h1 className="text-4xl sm:text-5xl text-[var(--foreground)] font-semibold">
                Manage food partners.
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                Track partner onboarding, redemption readiness, and surplus programs from one place.
              </p>
            </div>
            <Link href="/partners/join">
              <Button variant="outline" size="lg">Share partner signup</Button>
            </Link>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Partner status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {partnerUpdates.map((partner) => (
                  <div
                    key={partner.name}
                    className="flex flex-col gap-2 rounded-2xl border border-[var(--border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{partner.name}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{partner.detail}</p>
                    </div>
                    <span className="inline-flex rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                      {partner.status}
                    </span>
                  </div>
                ))}
                <p className="text-xs text-[var(--muted-foreground)]">
                  Partner reporting API will populate this list automatically once enabled.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Onboarding checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                {onboardingSteps.map((step) => (
                  <p key={step}>• {step}</p>
                ))}
                <Link href="/admin/requests" className="pt-2 block">
                  <Button variant="outline" size="sm" className="w-full">
                    Review partner-linked requests
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
