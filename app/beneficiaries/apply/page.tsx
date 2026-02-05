import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const eligibility = [
  'Residents facing temporary or ongoing food insecurity.',
  'Students or workers with limited access to regular meals.',
  'Households referred by community partners or shelters.',
];

const requiredItems = [
  { title: 'Basic ID', detail: 'National ID, student card, or community referral letter.' },
  { title: 'Contact details', detail: 'Phone number and preferred contact channel.' },
  { title: 'Pickup availability', detail: 'Two preferred days or time windows for meal pickup.' },
  { title: 'Household size', detail: 'Helps us allocate the right voucher value.' },
];

const applicationSteps = [
  { step: '1', title: 'Create an account', detail: 'Sign up with a secure email and phone number.' },
  { step: '2', title: 'Complete your profile', detail: 'Tell us about your location and household size.' },
  { step: '3', title: 'Submit your request', detail: 'Share the type of support you need most.' },
  { step: '4', title: 'Track your status', detail: 'Watch for updates and respond quickly if we need more info.' },
];

export default function BeneficiaryApplyPage() {
  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <section className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Apply for support</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Start your beneficiary application with clarity.</h1>
            <p className="text-base text-[var(--muted-foreground)] max-w-2xl">
              EcoEats applications are designed to be fast, respectful, and transparent. This guide walks you through
              eligibility, required information, and what happens after you submit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/signup">
                <Button size="lg">Start application</Button>
              </Link>
              <Link href="/beneficiaries/use-voucher">
                <Button variant="outline" size="lg">Voucher instructions</Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Eligibility highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
                {eligibility.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>What you will need</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {requiredItems.map((item) => (
                  <div key={item.title}>
                    <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                    <p className="text-[var(--muted-foreground)]">{item.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-alt)] p-8">
            <h2 className="text-2xl text-[var(--foreground)]">Application flow</h2>
            <div className="grid gap-4 sm:grid-cols-2 mt-6">
              {applicationSteps.map((step) => (
                <div key={step.step} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Step {step.step}</p>
                  <p className="text-lg font-semibold text-[var(--foreground)] mt-2">{step.title}</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">{step.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Expected timeline</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[var(--muted-foreground)] space-y-3">
                <p>• Confirmation message within 1 hour of submission.</p>
                <p>• Eligibility review within 24 hours on weekdays.</p>
                <p>• Voucher delivery within 2 business days after approval.</p>
                <p>• Ongoing check-ins to make sure support stays relevant.</p>
              </CardContent>
            </Card>
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Need help applying?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[var(--muted-foreground)] space-y-3">
                <p>We can help you fill out the form or add documentation.</p>
                <p className="font-semibold text-[var(--foreground)]">support@ecoeats.org</p>
                <Link href="/contact">
                  <Button size="sm">Talk to support</Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
