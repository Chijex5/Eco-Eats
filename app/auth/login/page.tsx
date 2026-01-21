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
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                EE
              </div>
              <div className="text-left">
                <p className="text-xl font-semibold text-[var(--foreground)]">EcoEats</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Welcome back</p>
              </div>
            </Link>
            <h1 className="text-3xl text-[var(--foreground)] mb-2">Sign in to continue</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Access your dashboard and manage your impact.
            </p>
          </div>

          <Card className="shadow-[var(--shadow)]">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
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
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
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
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-[var(--muted-foreground)]">
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
                    className="font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
                Don't have an account yet?
              </div>
              <div className="mt-4 text-center">
                <Link href="/auth/signup">
                  <Button variant="outline" size="lg" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
            This is a Phase A prototype. Full authentication arrives in Phase B.
          </p>
        </div>
      </div>
    </div>
  );
}
