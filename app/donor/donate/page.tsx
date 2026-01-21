'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/mockData';

export default function DonatePage() {
  const router = useRouter();
  const [donationType, setDonationType] = useState<'MEAL_VOUCHER' | 'ONE_TIME' | 'MONTHLY'>('MEAL_VOUCHER');
  const [mealCount, setMealCount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationComplete, setDonationComplete] = useState(false);

  const MEAL_PRICE = 100000; // ₦1,000 per meal in kobo
  const PRESET_MEALS = [3, 5, 10, 20];
  const PRESET_AMOUNTS = [500000, 1000000, 2000000, 5000000]; // in kobo

  const calculateAmount = () => {
    if (donationType === 'MEAL_VOUCHER') {
      return mealCount * MEAL_PRICE;
    }
    return parseInt(customAmount) * 100 || 0; // Convert to kobo
  };

  const handleDonate = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setDonationComplete(true);

    // Redirect to dashboard after 3 seconds
    setTimeout(() => {
      router.push('/donor/dashboard');
    }, 3000);
  };

  if (donationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]">
            <CardContent className="py-12 text-center">
              <div className="w-24 h-24 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
                ✓
              </div>
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
                Thank You for Your Donation!
              </h2>
              <p className="text-lg text-[var(--muted-foreground)] mb-2">
                Your generous donation of {formatCurrency(calculateAmount())} has been received successfully.
              </p>
              <p className="text-sm text-[var(--muted-foreground)] mb-8">
                {donationType === 'MEAL_VOUCHER' && `You've funded ${mealCount} meal${mealCount > 1 ? 's' : ''} for people in need.`}
                {donationType === 'ONE_TIME' && 'Your one-time donation will make a real difference.'}
                {donationType === 'MONTHLY' && 'Your monthly support will provide ongoing help to those in need.'}
              </p>
              <div className="space-y-4">
                <div className="bg-[var(--muted)] rounded-lg p-6">
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">
                    📧 A receipt has been sent to your email
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    📊 View your impact in the donor dashboard
                  </p>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Redirecting to dashboard...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--secondary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <span>💝</span>
            <span>Make a Donation</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Help Fight Hunger Today
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Your donation provides nutritious meals to people in need and helps us achieve Zero Hunger (SDG 2).
          </p>
        </div>

        {/* Donation Type Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card
            hover
            className={`cursor-pointer transition-all duration-300 ${
              donationType === 'MEAL_VOUCHER'
                ? 'border-2 border-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/5 to-white'
                : 'border-2 border-transparent'
            }`}
            onClick={() => setDonationType('MEAL_VOUCHER')}
          >
            <CardContent className="py-8 text-center">
              <div className="text-5xl mb-4">🎫</div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                Fund Meal Vouchers
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Provide meal vouchers that beneficiaries can redeem at partner locations
              </p>
              {donationType === 'MEAL_VOUCHER' && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--primary)] font-semibold">
                    ✓ Selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            hover
            className={`cursor-pointer transition-all duration-300 ${
              donationType === 'ONE_TIME'
                ? 'border-2 border-[var(--secondary)] bg-gradient-to-br from-[var(--secondary)]/5 to-white'
                : 'border-2 border-transparent'
            }`}
            onClick={() => setDonationType('ONE_TIME')}
          >
            <CardContent className="py-8 text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                One-Time Gift
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Make a single donation to support our programs and operations
              </p>
              {donationType === 'ONE_TIME' && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--secondary)] font-semibold">
                    ✓ Selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            hover
            className={`cursor-pointer transition-all duration-300 ${
              donationType === 'MONTHLY'
                ? 'border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--accent)]/5 to-white'
                : 'border-2 border-transparent'
            }`}
            onClick={() => setDonationType('MONTHLY')}
          >
            <CardContent className="py-8 text-center">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                Monthly Support
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Become a recurring donor and provide ongoing support every month
              </p>
              {donationType === 'MONTHLY' && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--accent)] font-semibold">
                    ✓ Selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {donationType === 'MEAL_VOUCHER' && 'Choose Number of Meals'}
                  {donationType === 'ONE_TIME' && 'Enter Donation Amount'}
                  {donationType === 'MONTHLY' && 'Set Monthly Amount'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {donationType === 'MEAL_VOUCHER' && (
                  <>
                    {/* Meal Presets */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {PRESET_MEALS.map((count) => (
                        <button
                          key={count}
                          onClick={() => setMealCount(count)}
                          className={`p-6 rounded-xl border-2 transition-all ${
                            mealCount === count
                              ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                              : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                          }`}
                        >
                          <div className="text-3xl mb-2">🍽️</div>
                          <p className="text-2xl font-bold text-[var(--foreground)]">{count}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">meals</p>
                          <p className="text-sm font-semibold text-[var(--primary)] mt-2">
                            {formatCurrency(count * MEAL_PRICE)}
                          </p>
                        </button>
                      ))}
                    </div>

                    {/* Custom Meal Count */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                        Or enter custom number of meals:
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={mealCount}
                        onChange={(e) => setMealCount(parseInt(e.target.value) || 1)}
                        placeholder="Enter number of meals"
                      />
                      <p className="text-xs text-[var(--muted-foreground)] mt-2">
                        Each meal voucher is worth ₦1,000
                      </p>
                    </div>
                  </>
                )}

                {(donationType === 'ONE_TIME' || donationType === 'MONTHLY') && (
                  <>
                    {/* Amount Presets */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {PRESET_AMOUNTS.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setCustomAmount((amount / 100).toString())}
                          className={`p-6 rounded-xl border-2 transition-all ${
                            customAmount === (amount / 100).toString()
                              ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                              : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                          }`}
                        >
                          <div className="text-3xl mb-2">💝</div>
                          <p className="text-xl font-bold text-[var(--primary)]">
                            {formatCurrency(amount)}
                          </p>
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                        Or enter custom amount (₦):
                      </label>
                      <Input
                        type="number"
                        min="100"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter amount in Naira"
                      />
                    </div>
                  </>
                )}

                {/* Payment Summary */}
                <Card className="bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]/20">
                  <CardContent className="py-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[var(--muted-foreground)]">Donation Amount:</span>
                      <span className="text-2xl font-bold text-[var(--primary)]">
                        {formatCurrency(calculateAmount())}
                      </span>
                    </div>
                    {donationType === 'MEAL_VOUCHER' && (
                      <p className="text-sm text-[var(--muted-foreground)] text-center">
                        This will fund <strong>{mealCount}</strong> meal{mealCount > 1 ? 's' : ''} for people in need
                      </p>
                    )}
                    {donationType === 'MONTHLY' && (
                      <p className="text-sm text-[var(--muted-foreground)] text-center">
                        You&apos;ll be charged this amount monthly
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Donate Button */}
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleDonate}
                  disabled={isProcessing || calculateAmount() === 0}
                >
                  {isProcessing ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Donate {formatCurrency(calculateAmount())}
                      {donationType === 'MONTHLY' && '/month'}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-[var(--muted-foreground)]">
                  🔒 Your payment is secure and encrypted. You&apos;ll receive a receipt via email.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Impact Info */}
          <div>
            <Card className="bg-gradient-to-br from-[var(--accent)]/5 to-white border-2 border-[var(--accent)]/20 mb-6">
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-5xl mb-3">🎯</div>
                    <p className="text-3xl font-bold text-[var(--accent)] mb-1">
                      {donationType === 'MEAL_VOUCHER' ? mealCount : Math.floor(calculateAmount() / MEAL_PRICE)}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Meal{(donationType === 'MEAL_VOUCHER' ? mealCount : Math.floor(calculateAmount() / MEAL_PRICE)) > 1 ? 's' : ''} This Donation
                    </p>
                  </div>

                  <div className="border-t border-[var(--border)] pt-4 space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span>✓</span>
                      <span className="text-[var(--muted-foreground)]">
                        100% of your donation goes to feeding people
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>✓</span>
                      <span className="text-[var(--muted-foreground)]">
                        Track your impact in real-time
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span>✓</span>
                      <span className="text-[var(--muted-foreground)]">
                        Tax-deductible receipt provided
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[var(--muted)] to-white">
              <CardHeader>
                <CardTitle className="text-lg">Why Donate?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                <p>
                  <strong className="text-[var(--foreground)]">Transparent:</strong> See exactly where your money goes
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Verified:</strong> All beneficiaries are reviewed
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Accountable:</strong> Track impact from donation to meal served
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">SDG 2:</strong> Supporting UN Zero Hunger goal
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
