'use client';

import Link from 'next/link';
import { DollarSign, Utensils, Heart, Sparkles, TrendingUp, HandHeart, Globe, Lock, Check, BarChart3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockDonations, mockImpactMetrics, formatCurrency, formatDate } from '@/lib/mockData';

export default function DonorDashboardPage() {
  const recentDonations = mockDonations.slice(0, 3);
  const totalDonated = mockDonations.reduce((sum, d) => sum + d.amountKobo, 0);
  const totalMeals = mockDonations.reduce((sum, d) => sum + (d.mealCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[var(--secondary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                <HandHeart className="w-4 h-4" />
                <span>Donor Dashboard</span>
              </div>
              <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
                Welcome Back, Donor!
              </h1>
              <p className="text-lg text-[var(--muted-foreground)]">
                Thank you for making a difference in the fight against hunger
              </p>
            </div>
            <Link href="/donor/donate">
              <Button size="lg" className="shadow-lg">
                <HandHeart className="w-4 h-4 mr-2" />
                Make a Donation
              </Button>
            </Link>
          </div>
        </div>

        {/* Impact Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total Donated</p>
                  <p className="text-3xl font-bold">{formatCurrency(totalDonated)}</p>
                </div>
                <DollarSign className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/80 text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Meals Funded</p>
                  <p className="text-3xl font-bold">{totalMeals}</p>
                </div>
                <Utensils className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/80 text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">People Helped</p>
                  <p className="text-3xl font-bold">{mockImpactMetrics.peopleHelped}</p>
                </div>
                <div className="w-12 h-12 opacity-80">
                <Heart className="w-full h-full" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Donations Made</p>
                  <p className="text-3xl font-bold">{mockDonations.length}</p>
                </div>
                <Sparkles className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/donor/donate">
            <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-[var(--primary)] cursor-pointer">
              <CardContent className="py-8 text-center">
                
                <div className="w-12 h-12 mb-4 text-[var(--primary)] mx-auto">
                <HandHeart className="w-full h-full" /></div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  Make a Donation
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Fund meal vouchers or support our programs
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/donor/impact">
            <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-[var(--accent)] cursor-pointer">
              <CardContent className="py-8 text-center">
                <div className="text-5xl mb-4">BarChart3</div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  View Impact
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  See how your donations are making a difference
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/donor/history">
            <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-[var(--secondary)] cursor-pointer">
              <CardContent className="py-8 text-center">
                <div className="text-5xl mb-4">FileText</div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  Donation History
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Review all your past donations
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Donations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Donations</CardTitle>
                  <Link href="/donor/history">
                    <Button variant="ghost" size="sm">
                      View All →
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentDonations.length > 0 ? (
                  <div className="space-y-4">
                    {recentDonations.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-lg hover:bg-[var(--muted)]/70 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-2xl">
                            HandHeart
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--foreground)]">
                              {formatCurrency(donation.amountKobo)}
                            </p>
                            <p className="text-sm text-[var(--muted-foreground)]">
                              {donation.donationType === 'MEAL_VOUCHER' && `${donation.mealCount} meal voucher${(donation.mealCount || 0) > 1 ? 's' : ''}`}
                              {donation.donationType === 'ONE_TIME' && 'One-time donation'}
                              {donation.donationType === 'MONTHLY' && 'Monthly donation'}
                              {' • '}
                              {formatDate(donation.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="success">{donation.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3"><HandHeart className="w-full h-full" /></div>
                    <p className="text-[var(--muted-foreground)]">
                      No donations yet. Make your first donation to get started!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Impact Snapshot */}
          <div>
            <Card className="bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]/20">
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 mb-3 text-[var(--accent)]">
                  <TrendingUp className="w-full h-full" /></div>
                  <p className="text-3xl font-bold text-[var(--primary)] mb-1">
                    {mockImpactMetrics.mealsServed}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Meals Served So Far
                  </p>
                </div>

                <div className="border-t border-[var(--border)] pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--muted-foreground)]">Meals Funded</span>
                    <span className="font-semibold text-[var(--foreground)]">{totalMeals}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--muted-foreground)]">People Helped</span>
                    <span className="font-semibold text-[var(--foreground)]">{mockImpactMetrics.peopleHelped}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--muted-foreground)]">Partners Supported</span>
                    <span className="font-semibold text-[var(--foreground)]">{mockImpactMetrics.partnersSupported}</span>
                  </div>
                </div>

                <Link href="/donor/impact">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Full Impact Report →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Thank You Message */}
        <Card className="mt-8 bg-gradient-to-br from-[var(--secondary)]/10 to-white border-2 border-[var(--secondary)]/20">
          <CardContent className="py-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 text-[var(--foreground)]">
              <Heart className="w-full h-full" /></div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                  Thank You for Your Generosity
                </h3>
                <p className="text-[var(--muted-foreground)] mb-4">
                  Your contributions are making a real difference in the lives of people facing food insecurity. 
                  Every donation helps us get closer to achieving SDG 2: Zero Hunger. Together, we're building 
                  a community where no one goes hungry.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <span className="text-xl text-[var(--accent)]">
                    <Globe className="w-5 h-5" /></span>
                    <span>Supporting SDG 2</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <span className="text-xl text-[var(--primary)]">
                    <Lock className="w-5 h-5" /></span>
                    <span>100% Transparent</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <span className="text-xl text-[var(--primary)]">
                    <Check className="w-5 h-5" /></span>
                    <span>Verified Impact</span>
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
