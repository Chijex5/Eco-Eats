'use client';

import Link from 'next/link';
import { Store, UtensilsCrossed, Scan, History, Settings, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function PartnerDashboardPage() {
  // Mock data - will be replaced with real data in Phase B
  const stats = {
    activeSurplus: 2,
    todayRedemptions: 8,
    totalSaved: 245,
    revenue: 120000, // in kobo
  };

  const recentSurplus = [
    {
      id: '1',
      title: 'Fresh Rice & Stew',
      quantity: 10,
      claimed: 3,
      expiresIn: '3 hours',
      status: 'ACTIVE',
    },
    {
      id: '2',
      title: 'Vegetable Salad Bowls',
      quantity: 8,
      claimed: 5,
      expiresIn: '2 hours',
      status: 'ACTIVE',
    },
  ];

  const recentRedemptions = [
    {
      id: '1',
      code: 'EAT-7H3K2',
      amount: 150000,
      time: '10 minutes ago',
      beneficiary: 'John D.',
    },
    {
      id: '2',
      code: 'EAT-9M2P5',
      amount: 100000,
      time: '25 minutes ago',
      beneficiary: 'Sarah M.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[var(--secondary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                <Store className="w-4 h-4" />
                <span>Partner Dashboard</span>
              </div>
              <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
                Campus Cafeteria
              </h1>
              <p className="text-lg text-[var(--muted-foreground)]">
                Manage your surplus food and voucher redemptions
              </p>
            </div>
            <Link href="/partner/surplus">
              <Button size="lg" className="shadow-lg">
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Post Surplus Food
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Active Surplus</p>
                  <p className="text-3xl font-bold">{stats.activeSurplus}</p>
                </div>
                <UtensilsCrossed className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/80 text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Today's Redemptions</p>
                  <p className="text-3xl font-bold">{stats.todayRedemptions}</p>
                </div>
                <CheckCircle className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/80 text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Meals Saved</p>
                  <p className="text-3xl font-bold">{stats.totalSaved}</p>
                </div>
                <TrendingUp className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Revenue (This Month)</p>
                  <p className="text-3xl font-bold">₦{(stats.revenue / 100).toLocaleString()}</p>
                </div>
                <Store className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/partner/surplus">
            <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-[var(--primary)] cursor-pointer">
              <CardContent className="py-8 text-center">
                <div className="w-12 h-12 mb-4 text-[var(--primary)] mx-auto">
                  <UtensilsCrossed className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  Post Surplus
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  List surplus food for beneficiaries to claim
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/partner/redeem">
            <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-[var(--secondary)] cursor-pointer">
              <CardContent className="py-8 text-center">
                <div className="w-12 h-12 mb-4 text-[var(--secondary)] mx-auto">
                  <Scan className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  Redeem Voucher
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Scan and validate beneficiary vouchers
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/partner/history">
            <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-[var(--accent)] cursor-pointer">
              <CardContent className="py-8 text-center">
                <div className="w-12 h-12 mb-4 text-[var(--accent)] mx-auto">
                  <History className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  View History
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Review redemptions and surplus posts
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Surplus */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Surplus Listings</CardTitle>
                  <Link href="/partner/surplus">
                    <Button variant="ghost" size="sm">
                      View All →
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentSurplus.length > 0 ? (
                  <div className="space-y-4">
                    {recentSurplus.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-lg hover:bg-[var(--muted)]/70 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-lg flex items-center justify-center">
                            <UtensilsCrossed className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-[var(--foreground)]">
                              {item.title}
                            </p>
                            <p className="text-sm text-[var(--muted-foreground)]">
                              {item.claimed} of {item.quantity} claimed • Expires in {item.expiresIn}
                            </p>
                          </div>
                        </div>
                        <Badge variant="success">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UtensilsCrossed className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3" />
                    <p className="text-[var(--muted-foreground)]">
                      No active surplus listings. Post some food to get started!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Redemptions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Redemptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRedemptions.map((redemption) => (
                    <div key={redemption.id} className="pb-3 border-b border-[var(--border)] last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm font-semibold text-[var(--primary)]">
                          {redemption.code}
                        </span>
                        <span className="font-semibold text-[var(--foreground)]">
                          ₦{(redemption.amount / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                        <span>{redemption.beneficiary}</span>
                        <span>{redemption.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/partner/history">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View All Redemptions →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Impact Message */}
        <Card className="mt-8 bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]/20">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-10 h-10 text-[var(--primary)] flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">
                  Your Impact
                </h3>
                <p className="text-[var(--muted-foreground)] mb-4">
                  By posting surplus food and accepting vouchers, you've helped save {stats.totalSaved} meals 
                  from going to waste while supporting the community. Together, we're building a sustainable 
                  solution to hunger.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-[var(--muted-foreground)]">Reduce food waste</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-[var(--muted-foreground)]">Support community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-[var(--muted-foreground)]">Generate revenue</span>
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
