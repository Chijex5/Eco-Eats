'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10V7.8C8 5.7 9.8 4 12 4C14.2 4 16 5.7 16 7.8V10" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const requestOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Enter your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || 'Unable to send OTP.');
        return;
      }

      setMessage('OTP sent. Check your inbox to continue.');
      setStep('reset');
    } catch (requestError) {
      console.error(requestError);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!otp || !newPassword || !confirmPassword) {
      setError('Enter your OTP and new password.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || 'Unable to reset password.');
        return;
      }

      setMessage('Password updated successfully. Redirecting...');
      setTimeout(() => {
        router.push('/auth/login');
      }, 900);
    } catch (resetError) {
      console.error(resetError);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md sm:max-w-lg">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-[var(--shadow)]">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                <span className="text-[var(--primary)]"><LockIcon /></span>
                Account recovery
              </div>
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">Forgot password</h1>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {step === 'request' ? 'Enter your email to receive an OTP.' : 'Enter the OTP and choose a new password.'}
              </p>
            </div>
            {step === 'reset' ? (
              <button
                type="button"
                onClick={() => {
                  setStep('request');
                  setOtp('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setError('');
                  setMessage('');
                }}
                className="text-xs font-medium text-[var(--primary)] hover:underline"
              >
                Change email
              </button>
            ) : null}
          </div>

          {step === 'request' ? (
            <form onSubmit={requestOtp} className="space-y-5">
              <label className="block text-sm text-[var(--muted-foreground)]">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={resetPassword} className="space-y-5">
              <label className="block text-sm text-[var(--muted-foreground)]">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                  required
                />
              </label>

              <label className="block text-sm text-[var(--muted-foreground)]">
                OTP
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] tracking-[0.25em] outline-none focus:border-[var(--primary)]"
                  placeholder="123456"
                  required
                />
              </label>

              <label className="block text-sm text-[var(--muted-foreground)]">
                New password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                  required
                />
              </label>

              <label className="block text-sm text-[var(--muted-foreground)]">
                Confirm password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                  required
                />
              </label>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Updating password...' : 'Reset password'}
              </Button>
            </form>
          )}

          {error ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">{error}</p> : null}
          {message ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">{message}</p> : null}

          <div className="mt-6 border-t border-[var(--border)] pt-4 text-center">
            <Link href="/auth/login" className="text-sm font-medium text-[var(--primary)] hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
