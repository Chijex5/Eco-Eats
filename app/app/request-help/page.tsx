'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useState } from 'react';

export default function RequestHelp() {
  const [requestType, setRequestType] = useState<'VOUCHER' | 'FOOD_PACK'>('VOUCHER');
  const [urgency, setUrgency] = useState<'LOW' | 'MED' | 'HIGH'>('MED');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In Phase B, this would call the API
    console.log({ requestType, urgency, message });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-shell">
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center shadow-[var(--shadow)]">
              <CardContent className="py-12">
                <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-[var(--primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl text-[var(--foreground)] mb-4">
                  Request Submitted Successfully
                </h2>
                <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
                  Your support request has been received and will be reviewed by our team. We'll notify you once it's been approved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/app/vouchers">
                    <Button size="lg" variant="primary">
                      View Voucher Wallet
                    </Button>
                  </Link>
                  <Link href="/app/surplus">
                    <Button size="lg" variant="outline">
                      Browse Surplus Food
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] mb-6"
            >
              <span className="mr-2">←</span>
              Back to Home
            </Link>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] mb-3">
              Request Food Support
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg">
              We're here to help. Submit your request and our team will review it promptly.
            </p>
          </div>

          <Card className="shadow-[var(--shadow)]">
            <CardHeader>
              <CardTitle className="text-xl">Support Request Form</CardTitle>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                All requests are handled confidentially with dignity and respect.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-3">
                    Request Type
                  </label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRequestType('VOUCHER')}
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${
                        requestType === 'VOUCHER'
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                      }`}
                    >
                      <div className="font-semibold text-[var(--foreground)] mb-1">Meal Voucher</div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Receive a voucher to redeem at partner locations
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRequestType('FOOD_PACK')}
                      className={`rounded-2xl border-2 p-4 text-left transition-all ${
                        requestType === 'FOOD_PACK'
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                      }`}
                    >
                      <div className="font-semibold text-[var(--foreground)] mb-1">Food Pack</div>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Request a prepared food package for pickup
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-3">
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['LOW', 'MED', 'HIGH'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setUrgency(level)}
                        className={`rounded-xl border-2 py-3 px-2 text-center transition-all ${
                          urgency === level
                            ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                            : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                        }`}
                      >
                        <div className="font-semibold text-sm">{level === 'MED' ? 'MEDIUM' : level}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                  >
                    Additional Details (Optional)
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none resize-none"
                    placeholder="Share any additional information that might help us serve you better..."
                  />
                  <p className="text-xs text-[var(--muted-foreground)] mt-2">
                    Optional: Explain your situation if you're comfortable sharing.
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                  <h4 className="font-semibold text-[var(--foreground)] mb-2">What happens next?</h4>
                  <ul className="text-sm text-[var(--muted-foreground)] space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--primary)] mt-1">•</span>
                      <span>Your request will be reviewed by our team within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--primary)] mt-1">•</span>
                      <span>Once approved, you'll receive a notification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--primary)] mt-1">•</span>
                      <span>Your voucher or food pack details will appear in your wallet</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" size="lg" className="flex-1">
                    Submit Request
                  </Button>
                  <Link href="/" className="flex-1">
                    <Button type="button" size="lg" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <Card hover>
              <CardHeader>
                <CardTitle className="text-lg">Need Immediate Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                  Browse available surplus food listings for immediate pickup.
                </p>
                <Link href="/app/surplus">
                  <Button variant="outline" size="sm" className="w-full">
                    View Surplus Food
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader>
                <CardTitle className="text-lg">Have Questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">
                  Learn more about how EcoEats works and what to expect.
                </p>
                <Link href="/how-it-works">
                  <Button variant="outline" size="sm" className="w-full">
                    How It Works
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
