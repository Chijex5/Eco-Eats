'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const affiliationOptions = ['Student', 'Staff', 'Community Member'];
const needOptions = ['Low', 'Medium', 'High'];

export default function BeneficiaryProfileSetup() {
  const [formStatus, setFormStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [formError, setFormError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const formData = new FormData(event.currentTarget);
    const affiliation = String(formData.get('affiliation') || '');
    const location = String(formData.get('location') || '').trim();
    const needLevel = String(formData.get('need-level') || '');
    const phone = String(formData.get('phone') || '').trim();
    const household = String(formData.get('household') || '').trim();
    const notes = String(formData.get('notes') || '').trim();

    if (!affiliation || !location || !needLevel) {
      setFormError('Please complete all required fields.');
      return;
    }

    setFormStatus('saving');
    try {
      const response = await fetch('/api/beneficiary/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliation,
          location,
          needLevel,
          phone,
          household,
          notes,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setFormError(data?.error || 'Unable to save your profile.');
        setFormStatus('idle');
        return;
      }

      setFormStatus('saved');
      router.refresh();
      router.push('/app');
    } catch (error) {
      console.error(error);
      setFormError('Unable to save your profile.');
      setFormStatus('idle');
    }
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Beneficiary onboarding</p>
              <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">Complete your profile</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Tell us a little more so we can match you with the right support.
              </p>
            </div>
            <Card className="w-full lg:w-[320px] bg-[var(--primary-dark)] text-white shadow-[var(--shadow)]">
              <CardContent className="pt-6">
                <p className="text-sm uppercase tracking-[0.3em] text-white/70">Why we ask</p>
                <p className="text-sm mt-3 text-white/90">
                  These details are used only to assess support needs and keep requests fair.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle className="text-2xl">Profile details</CardTitle>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Fields marked * are required. You can edit this later in your profile settings.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="affiliation"
                        className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                      >
                        Affiliation *
                      </label>
                      <select
                        id="affiliation"
                        name="affiliation"
                        required
                        defaultValue=""
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {affiliationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="need-level"
                        className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                      >
                        Need level *
                      </label>
                      <select
                        id="need-level"
                        name="need-level"
                        required
                        defaultValue=""
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
                      >
                        <option value="" disabled>
                          Select one
                        </option>
                        {needOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                    >
                      Location *
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                      placeholder="e.g. Hostel A, Yaba"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                      >
                        Phone (optional)
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                        placeholder="+234 80 0000 0000"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="household"
                        className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                      >
                        Household size (optional)
                      </label>
                      <input
                        id="household"
                        name="household"
                        type="number"
                        min={1}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                        placeholder="e.g. 3"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                    >
                      Anything else? (optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                      placeholder="Let us know if you have time constraints, preferred pickup times, or special needs."
                    />
                  </div>

                  {formError && <p className="text-sm text-red-500">{formError}</p>}
                  {formStatus === 'saved' && (
                    <p className="text-sm text-emerald-600">Profile saved. Redirecting to your dashboard…</p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={formStatus === 'saving'}>
                      {formStatus === 'saving' ? 'Saving profile…' : 'Complete profile'}
                    </Button>
                    <Link href="/app" className="w-full sm:w-auto">
                      <Button type="button" variant="outline" size="lg" className="w-full">
                        Skip for now
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-xl">What happens next</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)]">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--secondary)] text-xs font-semibold">
                      1
                    </span>
                    <p>We review your profile and verify details to keep support fair.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--secondary)] text-xs font-semibold">
                      2
                    </span>
                    <p>You can submit a request for meal vouchers or surplus packs.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--secondary)] text-xs font-semibold">
                      3
                    </span>
                    <p>Once approved, your dashboard will show active vouchers and pickup codes.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow)] bg-[var(--primary)] text-white">
                <CardContent className="pt-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Need help?</p>
                  <p className="text-lg font-semibold mt-3">Our team can assist with verification.</p>
                  <p className="text-sm text-white/80 mt-2">Email support@ecoeats.org or visit the help desk on campus.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
