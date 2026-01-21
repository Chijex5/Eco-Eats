'use client';

import { TrendingUp, Users, Store, Ticket, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function ImpactAnalyticsPage() {
  const metrics = {
    totalBeneficiaries: 245,
    totalPartners: 8,
    vouchersIssued: 450,
    vouchersRedeemed: 312,
    totalValue: 52500000,
    mealsServed: 312,
    growthRate: 15,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <BarChart3 className="w-4 h-4" />
            <span>Impact Analytics</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            System-Wide Impact
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white">
            <CardContent className="py-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-80" />
              <p className="text-4xl font-bold mb-2">{metrics.totalBeneficiaries}</p>
              <p className="text-sm opacity-90">Total Beneficiaries</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/80 text-white">
            <CardContent className="py-8 text-center">
              <Ticket className="w-12 h-12 mx-auto mb-3 opacity-80" />
              <p className="text-4xl font-bold mb-2">{metrics.mealsServed}</p>
              <p className="text-sm opacity-90">Meals Served</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="py-8 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-80" />
              <p className="text-4xl font-bold mb-2">+{metrics.growthRate}%</p>
              <p className="text-sm opacity-90">Monthly Growth</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-lg">
                  <span className="text-[var(--muted-foreground)]">Active Partners</span>
                  <span className="text-2xl font-bold">{metrics.totalPartners}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-lg">
                  <span className="text-[var(--muted-foreground)]">Vouchers Issued</span>
                  <span className="text-2xl font-bold">{metrics.vouchersIssued}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-lg">
                  <span className="text-[var(--muted-foreground)]">Redemption Rate</span>
                  <span className="text-2xl font-bold">{Math.round((metrics.vouchersRedeemed/metrics.vouchersIssued)*100)}%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-lg">
                  <span className="text-[var(--muted-foreground)]">Total Value</span>
                  <span className="text-2xl font-bold">₦{(metrics.totalValue/100).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
