'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useState } from 'react';

export default function Signup() {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const roles = [
    {
      id: 'beneficiary',
      title: 'Beneficiary',
      icon: '👥',
      description: 'I need food support',
      details: 'Request help, receive vouchers, access meals with dignity',
    },
    {
      id: 'donor',
      title: 'Donor',
      icon: '💝',
      description: 'I want to donate',
      details: 'Fund meal vouchers and track your impact',
    },
    {
      id: 'partner',
      title: 'Food Partner',
      icon: '🍽️',
      description: 'I can provide food',
      details: 'List meals, accept vouchers, help your community',
    },
    {
      id: 'admin',
      title: 'Admin',
      icon: '🛡️',
      description: 'I manage a program',
      details: 'Verify users, approve requests, track impact',
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setStep('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-2xl font-bold">🌱</span>
            </div>
            <span className="text-2xl font-bold text-[var(--foreground)]">
              EcoEats
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            {step === 'role' ? 'Choose Your Role' : 'Create Your Account'}
          </h1>
          <p className="text-[var(--muted-foreground)]">
            {step === 'role' 
              ? 'Select the option that best describes you'
              : `Signing up as ${roles.find(r => r.id === selectedRole)?.title}`
            }
          </p>
        </div>

        {/* Role Selection */}
        {step === 'role' && (
          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Card
                key={role.id}
                hover
                className="cursor-pointer bg-white transition-all duration-300 hover:scale-105"
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader>
                  <div className="text-5xl mb-4 text-center">{role.icon}</div>
                  <CardTitle className="text-xl text-center mb-2">
                    {role.title}
                  </CardTitle>
                  <p className="text-[var(--primary)] font-semibold text-center mb-3">
                    {role.description}
                  </p>
                  <p className="text-[var(--muted-foreground)] text-sm text-center">
                    {role.details}
                  </p>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Select →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Registration Form */}
        {step === 'form' && (
          <Card className="bg-white shadow-xl max-w-2xl mx-auto">
            <CardContent className="pt-6">
              {/* Back Button */}
              <button
                onClick={() => setStep('role')}
                className="flex items-center text-[var(--primary)] hover:text-[var(--primary-dark)] mb-6 transition-colors"
              >
                <span className="mr-2">←</span>
                Change role
              </button>

              <form className="space-y-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold mb-2 text-[var(--foreground)]"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2 text-[var(--foreground)]"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold mb-2 text-[var(--foreground)]"
                  >
                    Phone Number <span className="text-[var(--muted-foreground)] font-normal">(Optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold mb-2 text-[var(--foreground)]"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-semibold mb-2 text-[var(--foreground)]"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-lg focus:border-[var(--primary)] focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 mt-1 text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)] rounded"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-3 block text-sm text-[var(--muted-foreground)]"
                  >
                    I agree to the{' '}
                    <a href="#" className="text-[var(--primary)] hover:text-[var(--primary-dark)]">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[var(--primary)] hover:text-[var(--primary-dark)]">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full">
                  Create Account
                </Button>
              </form>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-[var(--muted-foreground)]">
                      Already have an account?
                    </span>
                  </div>
                </div>
              </div>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="w-full">
                    Sign In Instead
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            🔒 This is a Phase A prototype. Full authentication coming in Phase B.
          </p>
        </div>
      </div>
    </div>
  );
}
