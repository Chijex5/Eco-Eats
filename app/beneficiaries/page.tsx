import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const navigation = [
  { label: 'Overview', href: '/beneficiaries' },
  { label: 'Apply for support', href: '/beneficiaries/apply' },
  { label: 'Use a voucher', href: '/beneficiaries/use-voucher' },
  { label: 'Beneficiary app', href: '/beneficiaries/app' },
];

const highlights = [
  {
    title: 'Private, respectful support',
    description: 'Request food assistance discreetly with a clear approval timeline and trusted partner locations.',
  },
  {
    title: 'Digital vouchers',
    description: 'Receive QR-enabled vouchers you can redeem at nearby partners when it suits your schedule.',
  },
  {
    title: 'Transparent updates',
    description: 'Track every step of your request so you always know what happens next.',
  },
];

const steps = [
  {
    step: '1',
    title: 'Submit your request',
    description: 'Tell us what support you need and when you can pick up a meal.',
  },
  {
    step: '2',
    title: 'Get verified',
    description: 'Our team confirms eligibility quickly with a lightweight check.',
  },
  {
    step: '3',
    title: 'Receive vouchers',
    description: 'Approved requests receive digital vouchers in the EcoEats app.',
  },
  {
    step: '4',
    title: 'Redeem with partners',
    description: 'Show your voucher QR code at a partner location to receive a meal.',
  },
];

const supportResources = [
  {
    title: 'Eligibility guide',
    description: 'See who qualifies, required documents, and typical response times.',
    href: '/beneficiaries/apply',
  },
  {
    title: 'Voucher support',
    description: 'Learn how to redeem, what to do if a voucher expires, and how to request help.',
    href: '/beneficiaries/use-voucher',
  },
  {
    title: 'Download the app',
    description: 'Access your dashboard, voucher wallet, and pickup instructions in one place.',
    href: '/beneficiaries/app',
  },
];

export default function BeneficiariesPage() {
  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <section className="space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">For beneficiaries</p>
                <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">Support that meets you with dignity.</h1>
                <p className="text-base text-[var(--muted-foreground)] mt-3 max-w-2xl">
                  EcoEats helps you request food assistance, track your approval status, and redeem vouchers at nearby
                  partners. Everything is built to keep you informed and in control.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/auth/signup">
                  <Button size="lg">Apply for support</Button>
                </Link>
                <Link href="/beneficiaries/apply">
                  <Button variant="outline" size="lg">See eligibility</Button>
                </Link>
              </div>
            </div>

            <nav className="flex flex-wrap gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <Card key={item.title} className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--muted-foreground)]">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-alt)] p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">How it works</p>
                <h2 className="text-2xl sm:text-3xl text-[var(--foreground)] mt-3">A clear four-step journey.</h2>
                <p className="text-sm text-[var(--muted-foreground)] mt-3 max-w-2xl">
                  From your first request to meal pickup, you will always see what is happening next and who is
                  supporting you.
                </p>
              </div>
              <Link href="/how-it-works">
                <Button variant="outline">Explore the full flow</Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
              {steps.map((step) => (
                <div key={step.step} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Step {step.step}</p>
                  <p className="text-lg font-semibold text-[var(--foreground)] mt-2">{step.title}</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl text-[var(--foreground)]">Resources built for beneficiaries</h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                Use these guides to prepare your application, understand your voucher wallet, and get help when you
                need it.
              </p>
              <div className="grid gap-4">
                {supportResources.map((resource) => (
                  <Card key={resource.title} className="shadow-[var(--shadow)]">
                    <CardHeader>
                      <CardTitle>{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[var(--muted-foreground)] mb-4">{resource.description}</p>
                      <Link href={resource.href}>
                        <Button variant="outline" size="sm">View guide</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle className="text-xl">Need help right now?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)]">
                <div>
                  <p className="font-semibold text-[var(--foreground)]">EcoEats Support Desk</p>
                  <p>support@ecoeats.org</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">WhatsApp support</p>
                  <p>+234 800 123 4567 (Mon - Fri)</p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Crisis support</p>
                  <p>Call our partner hotline for emergency meals.</p>
                </div>
                <Link href="/contact">
                  <Button size="sm">Contact support</Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
