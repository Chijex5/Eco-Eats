'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type FormField = {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

type RoleConfig = {
  id: string;
  title: string;
  description: string;
  details: string;
  formFields: FormField[];
};

export default function Signup() {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const roles: RoleConfig[] = [
    {
      id: 'beneficiary',
      title: 'Beneficiary',
      description: 'I need food support',
      details: 'Request help, receive vouchers, access meals with dignity',
      formFields: [
        {
          id: 'community',
          label: 'Community / City',
          type: 'text',
          placeholder: 'e.g. Ikeja, Lagos',
          required: true,
        },
        {
          id: 'household',
          label: 'Household Size (Optional)',
          type: 'number',
          placeholder: 'e.g. 4',
        },
      ],
    },
    {
      id: 'donor',
      title: 'Donor',
      description: 'I want to donate',
      details: 'Fund meal vouchers and track your impact',
      formFields: [
        {
          id: 'donor-type',
          label: 'Donor Type',
          type: 'select',
          required: true,
          options: ['Individual', 'Business', 'Foundation'],
        },
        {
          id: 'impact-focus',
          label: 'Impact Focus (Optional)',
          type: 'text',
          placeholder: 'e.g. school meals, emergencies',
        },
      ],
    },
    {
      id: 'partner',
      title: 'Food Partner',
      description: 'I can provide food',
      details: 'List meals, accept vouchers, help your community',
      formFields: [
        {
          id: 'organization',
          label: 'Organization Name',
          type: 'text',
          placeholder: 'e.g. Green Cafe',
          required: true,
        },
        {
          id: 'service-area',
          label: 'Service Area',
          type: 'text',
          placeholder: 'e.g. Yaba, Lagos',
          required: true,
        },
        {
          id: 'daily-capacity',
          label: 'Meals Per Day (Optional)',
          type: 'number',
          placeholder: 'e.g. 50',
        },
      ],
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setStep('form');
    setFormError('');
    setFormSuccess('');
  };

  const selectedRoleConfig = roles.find((role) => role.id === selectedRole);
  const selectedRoleLabel = selectedRoleConfig?.title;
  const roleFields = selectedRoleConfig?.formFields ?? [];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!selectedRole) {
      setFormError('Select a role to continue.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirm-password') || '');

    if (!fullName || !email || !password || !confirmPassword) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role: selectedRole,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setFormError(data?.error || 'Unable to create account.');
        return;
      }

      setFormSuccess('Account created. Redirecting…');
      router.push(data?.redirect || '/');
    } catch (error) {
      console.error(error);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden lg:block">
          <img
            src="/images/login.webp"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/25 via-transparent to-[var(--secondary)]/20" />
        </div>

        <div className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[var(--background)] lg:bg-[var(--primary-dark)]/95">
          <div className="absolute inset-0 hidden lg:block bg-gradient-to-b from-[var(--primary-dark)]/60 via-[var(--primary-dark)]/80 to-[var(--primary-dark)]/60" />

          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[var(--secondary)] text-[var(--foreground)] flex items-center justify-center text-sm font-semibold shadow-sm">
                  EE
                </div>
                <div className="text-left">
                  <p className="text-xl font-semibold text-[var(--foreground)] lg:text-[var(--surface)]">EcoEats</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-80">
                    Get started
                  </p>
                </div>
              </Link>
              <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] lg:text-[var(--surface)] mb-2">
                {step === 'role' ? 'Choose your role' : 'Create your account'}
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-80">
                {step === 'role'
                  ? 'Select the option that best describes you.'
                  : `Signing up as ${selectedRoleLabel}`}
              </p>
            </div>

            {step === 'role' && (
              <div className="grid md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <Card
                    key={role.id}
                    hover
                    className="cursor-pointer transition-all"
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl text-center mb-2">{role.title}</CardTitle>
                      <p className="text-[var(--primary)] font-semibold text-center mb-2 text-sm">
                        {role.description}
                      </p>
                      <p className="text-[var(--muted-foreground)] text-sm text-center">
                        {role.details}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        Select role
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {step === 'form' && (
              <Card className="shadow-[var(--shadow)] max-w-2xl mx-auto bg-[var(--surface)] lg:bg-[var(--primary-dark)]/85 lg:border-[var(--surface)]/15 lg:text-[var(--surface)]">
                <CardContent className="pt-6">
                  <button
                    onClick={() => setStep('role')}
                    className="flex items-center text-sm font-semibold text-[var(--primary)] lg:text-[var(--secondary)] hover:text-[var(--primary-dark)] mb-6"
                  >
                    <span className="mr-2">←</span>
                    Change role
                  </button>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-70 mb-3">
                        Account details
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-70 mb-2"
                          >
                            Full Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-70 mb-2"
                          >
                            Email Address
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    {roleFields.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-70 mb-3">
                          Role details
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                          {roleFields.map((field) => (
                            <div key={field.id} className={field.type === 'select' ? 'md:col-span-2' : ''}>
                              <label
                                htmlFor={field.id}
                                className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-70 mb-2"
                              >
                                {field.label}
                              </label>
                              {field.type === 'select' ? (
                                <select
                                  id={field.id}
                                  name={field.id}
                                  required={field.required}
                                  defaultValue=""
                                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
                                >
                                  <option value="" disabled>
                                    Select one
                                  </option>
                                  {field.options?.map((option: string) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  id={field.id}
                                  name={field.id}
                                  type={field.type}
                                  required={field.required}
                                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                                  placeholder={field.placeholder}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-70 mb-3">
                        Security
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="password"
                            className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-70 mb-2"
                          >
                            Password
                          </label>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                            placeholder="••••••••"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="confirm-password"
                            className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-70 mb-2"
                          >
                            Confirm Password
                          </label>
                          <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            required
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-70 mt-2">
                        Must be at least 8 characters.
                      </p>
                    </div>

                    <label className="flex items-start gap-3 text-sm text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-80">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="mt-1 h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span>
                        I agree to the{' '}
                        <a
                          href="#"
                          className="text-[var(--primary)] lg:text-[var(--secondary)] hover:text-[var(--primary-dark)]"
                        >
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a
                          href="#"
                          className="text-[var(--primary)] lg:text-[var(--secondary)] hover:text-[var(--primary-dark)]"
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>

                    {formError && (
                      <p className="text-sm text-red-500">{formError}</p>
                    )}
                    {formSuccess && (
                      <p className="text-sm text-emerald-600">{formSuccess}</p>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating account…' : 'Create Account'}
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-80">
                    Already have an account?
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/auth/login">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full lg:text-[var(--surface)] lg:border-[var(--surface)]/40 lg:hover:border-[var(--secondary)] lg:hover:text-[var(--secondary)] lg:hover:bg-[var(--secondary)]/10"
                      >
                        Sign In Instead
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            <p className="mt-8 text-center text-xs text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-70">
              By creating an account, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
