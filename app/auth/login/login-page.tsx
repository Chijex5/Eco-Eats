'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessError = searchParams.get('error');
  const logoSrc = '/logo.png';
  const [logoFailed, setLogoFailed] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!email || !password) {
      setFormError('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (data?.needs_verification) {
          setFormError('');
          setFormSuccess('');
          setVerificationEmail(String(data?.email || email).toLowerCase());
          setOtp('');
          setVerificationNotice(data?.error || 'Use the OTP sent to your email to verify your account.');
          return;
        }
        setFormError(data?.error || 'Unable to sign in.');
        return;
      }

      const redirect = searchParams.get('redirect') || data?.redirect || '/';
      router.push(redirect);
      router.refresh();
    } catch (error) {
      console.error(error);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerification = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!verificationEmail || otp.trim().length !== 6) {
      setFormError('Enter the 6-digit OTP sent to your email.');
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await fetch('/api/auth/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail, otp: otp.trim() }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setFormError(data?.error || 'Unable to verify OTP.');
        return;
      }

      setFormSuccess('Email verified. Redirecting…');
      setVerificationEmail('');
      setVerificationNotice('');
      router.push(data?.redirect || '/');
      router.refresh();
    } catch (error) {
      console.error(error);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setFormError('');
    setFormSuccess('');
    setVerificationNotice('');

    if (!verificationEmail) {
      setFormError('Enter your email and password first.');
      return;
    }

    setIsResendingOtp(true);
    try {
      const response = await fetch('/api/auth/register/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setFormError(data?.error || 'Unable to resend OTP.');
        return;
      }
      setFormSuccess(data?.message || 'A new OTP was sent.');
    } catch (error) {
      console.error(error);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsResendingOtp(false);
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

        <div className="relative flex items-center justify-center px-4 sm:px-6 lg:px-10 py-16 bg-[var(--background)] lg:bg-[var(--primary-dark)]/95">
          <div className="absolute inset-0 hidden lg:block bg-gradient-to-b from-[var(--primary-dark)]/60 via-[var(--primary-dark)]/80 to-[var(--primary-dark)]/60" />

          <div className="relative w-full max-w-md">
            <div className="text-center lg:text-left mb-8">
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[var(--secondary)] text-[var(--foreground)] flex items-center justify-center text-sm font-semibold shadow-sm">
                  {logoFailed ? (
                    <span className="text-sm font-semibold text-[var(--primary)]">EE</span>
                  ) : (
                    <img
                      src={logoSrc}
                      alt="EcoEats logo"
                      className="h-8 w-8 object-contain"
                      loading="eager"
                      decoding="async"
                      onError={() => setLogoFailed(true)}
                    />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-xl font-semibold text-[var(--foreground)] lg:text-[var(--surface)]">EcoEats</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-80">
                    Welcome back
                  </p>
                </div>
              </Link>
              <h1 className="text-3xl text-[var(--foreground)] lg:text-[var(--surface)] mb-2">
                Sign in to continue
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-80">
                Access your dashboard and manage your impact.
              </p>
            </div>

            <Card className="shadow-[var(--shadow)] bg-[var(--surface)] lg:bg-[var(--primary-dark)]/85 lg:border-[var(--surface)]/15 lg:text-[var(--surface)]">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {accessError === 'forbidden' && (
                    <p className="text-sm text-amber-600">
                      You don&apos;t have access to that page. Please sign in with a different role.
                    </p>
                  )}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                      placeholder="you@example.com"
                    />
                  </div>

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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-80">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      Remember me
                    </label>

                    <Link
                      href="/auth/forgot-password"
                      className="font-semibold text-[var(--primary)] lg:text-[var(--secondary)] hover:text-[var(--primary-dark)]"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in…' : 'Sign In'}
                  </Button>

                  {formSuccess && <p className="text-sm text-emerald-600">{formSuccess}</p>}
                  {formError && <p className="text-sm text-red-500">{formError}</p>}
                </form>

                <div className="mt-6 text-center text-sm text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-80">
                  Don&apos;t have an account yet?
                </div>
                <div className="mt-4 text-center">
                  <Link href="/auth/signup">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full lg:text-[var(--surface)] lg:border-[var(--surface)]/40 lg:hover:border-[var(--secondary)] lg:hover:text-[var(--secondary)] lg:hover:bg-[var(--secondary)]/10"
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-xs text-[var(--muted-foreground)] lg:text-[var(--surface)] lg:opacity-70">
              Secure sign-in powered by EcoEats.
            </p>
          </div>
        </div>
      </div>

      {verificationEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <Card className="w-full max-w-md shadow-[var(--shadow)] bg-[var(--surface)]">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Verify your email</h2>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">
                    Enter the code sent to <span className="font-semibold">{verificationEmail}</span>.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close verification modal"
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  onClick={() => {
                    setVerificationEmail('');
                    setOtp('');
                    setVerificationNotice('');
                  }}
                >
                  ✕
                </button>
              </div>

              {verificationNotice && <p className="text-sm text-emerald-600">{verificationNotice}</p>}
              {formSuccess && <p className="text-sm text-emerald-600">{formSuccess}</p>}

              <form className="space-y-3" onSubmit={handleOtpVerification}>
                <input
                  id="login-otp"
                  name="login-otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base tracking-[0.35em] text-center font-semibold text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none"
                  placeholder="000000"
                />
                <Button type="submit" size="lg" className="w-full" disabled={isVerifyingOtp}>
                  {isVerifyingOtp ? 'Verifying…' : 'Verify email'}
                </Button>
              </form>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleResendOtp}
                disabled={isResendingOtp}
              >
                {isResendingOtp ? 'Resending…' : 'Resend OTP'}
              </Button>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
