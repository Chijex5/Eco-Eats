'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a prototype - actual authentication will be implemented in Phase B
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden lg:block">
          <img
            src="/image/login.webp"
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
                  EE
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

                    <a
                      href="#"
                      className="font-semibold text-[var(--primary)] lg:text-[var(--secondary)] hover:text-[var(--primary-dark)]"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Sign In
                  </Button>
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
              This is a Phase A prototype. Full authentication arrives in Phase B.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
