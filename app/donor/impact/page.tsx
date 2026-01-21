'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockDonations, mockImpactMetrics, formatCurrency } from '@/lib/mockData';

export default function ImpactPage() {
  const totalDonated = mockDonations.reduce((sum, d) => sum + d.amountKobo, 0);
  const totalMeals = mockDonations.reduce((sum, d) => sum + (d.mealCount || 0), 0);

  const impactPercentage = Math.round((mockImpactMetrics.mealsServed / mockImpactMetrics.mealsFunded) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <span>📊</span>
            <span>Impact Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Your Impact Report
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            See the real-world difference your donations are making in the fight against hunger.
          </p>
        </div>

        {/* Hero Impact Card */}
        <Card className="mb-12 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-2xl">
          <CardContent className="py-12">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">🎯</div>
              <h2 className="text-5xl font-bold mb-2">{mockImpactMetrics.mealsServed}</h2>
              <p className="text-xl opacity-90">Meals Served Through Your Donations</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur">
                <p className="text-3xl font-bold mb-1">{formatCurrency(totalDonated)}</p>
                <p className="text-sm opacity-90">Total Donated</p>
              </div>
              <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur">
                <p className="text-3xl font-bold mb-1">{mockImpactMetrics.peopleHelped}</p>
                <p className="text-sm opacity-90">People Helped</p>
              </div>
              <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur">
                <p className="text-3xl font-bold mb-1">{mockImpactMetrics.partnersSupported}</p>
                <p className="text-sm opacity-90">Partners Supported</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="py-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">
                🍽️
              </div>
              <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                {totalMeals}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Meals Funded
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/80 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">
                ✓
              </div>
              <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                {mockImpactMetrics.mealsServed}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Meals Served
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/80 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">
                👥
              </div>
              <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                {mockImpactMetrics.peopleHelped}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Beneficiaries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">
                {impactPercentage}%
              </div>
              <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                {impactPercentage}%
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Redemption Rate
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Impact Breakdown */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Impact Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Meals Progress */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🍽️</span>
                      <span className="font-semibold text-[var(--foreground)]">Meals Impact</span>
                    </div>
                    <Badge variant="success">
                      {mockImpactMetrics.mealsServed} / {mockImpactMetrics.mealsFunded}
                    </Badge>
                  </div>
                  <div className="w-full bg-[var(--muted)] rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-full transition-all"
                      style={{ width: `${impactPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">
                    {impactPercentage}% of funded meals have been redeemed
                  </p>
                </div>

                {/* Donation Types */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-[var(--muted)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎫</span>
                      <span className="text-sm text-[var(--muted-foreground)]">Meal Vouchers</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--foreground)]">
                      {mockDonations.filter(d => d.donationType === 'MEAL_VOUCHER').length}
                    </p>
                  </div>

                  <div className="bg-[var(--muted)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💰</span>
                      <span className="text-sm text-[var(--muted-foreground)]">One-Time</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--foreground)]">
                      {mockDonations.filter(d => d.donationType === 'ONE_TIME').length}
                    </p>
                  </div>

                  <div className="bg-[var(--muted)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🔄</span>
                      <span className="text-sm text-[var(--muted-foreground)]">Monthly</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--foreground)]">
                      {mockDonations.filter(d => d.donationType === 'MONTHLY').length}
                    </p>
                  </div>
                </div>

                {/* Impact Timeline */}
                <div>
                  <h4 className="font-semibold text-[var(--foreground)] mb-4">Recent Impact</h4>
                  <div className="space-y-3">
                    {[
                      { icon: '✓', text: '3 meals served at Campus Cafeteria', time: '2 hours ago' },
                      { icon: '🎫', text: '2 new vouchers issued to beneficiaries', time: '5 hours ago' },
                      { icon: '✓', text: '5 meals served at Green Kitchen', time: '1 day ago' },
                      { icon: '👥', text: '2 new beneficiaries registered', time: '2 days ago' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-[var(--muted)] rounded-lg">
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm text-[var(--foreground)]">{item.text}</p>
                          <p className="text-xs text-[var(--muted-foreground)] mt-1">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SDG Impact & Actions */}
          <div className="space-y-6">
            {/* SDG Alignment */}
            <Card className="bg-gradient-to-br from-[var(--secondary)]/5 to-white border-2 border-[var(--secondary)]/20">
              <CardHeader>
                <CardTitle className="text-lg">SDG 2: Zero Hunger</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">🎯</div>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Your donations directly contribute to the UN Sustainable Development Goal 2
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span className="text-[var(--muted-foreground)]">
                      Zero hunger by 2030
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span className="text-[var(--muted-foreground)]">
                      Food security for all
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span className="text-[var(--muted-foreground)]">
                      End malnutrition
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Inspire others by sharing your contribution to fighting hunger
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    📱 Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    📥 Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Continue Support */}
            <Card className="bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]/20">
              <CardHeader>
                <CardTitle className="text-lg">Continue Supporting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Your generosity is changing lives. Consider making another donation or setting up monthly support.
                </p>
                <Link href="/donor/donate">
                  <Button size="lg" className="w-full">
                    💝 Make Another Donation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transparency Statement */}
        <Card className="bg-gradient-to-br from-[var(--accent)]/5 to-white border-2 border-[var(--accent)]/20">
          <CardContent className="py-8">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🔒</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                  100% Transparency Guarantee
                </h3>
                <p className="text-[var(--muted-foreground)] mb-4">
                  Every donation is tracked from the moment it's made until a meal is served. You can see exactly 
                  how your money is being used to fight hunger. We maintain complete transparency in our operations, 
                  with all transactions verified and impact metrics updated in real-time.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xl">✓</span>
                    <span className="text-[var(--muted-foreground)]">Verified beneficiaries</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xl">✓</span>
                    <span className="text-[var(--muted-foreground)]">Real-time tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xl">✓</span>
                    <span className="text-[var(--muted-foreground)]">Accountable partners</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
