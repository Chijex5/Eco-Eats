'use client';

import { useState } from 'react';
import { Ticket, DollarSign, RefreshCcw, FileText, Download, BarChart3, Utensils, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockDonations, formatCurrency, formatDate } from '@/lib/mockData';

export default function DonationHistoryPage() {
  const [filter, setFilter] = useState<'all' | 'MEAL_VOUCHER' | 'ONE_TIME' | 'MONTHLY'>('all');

  const filteredDonations = filter === 'all'
    ? mockDonations
    : mockDonations.filter(d => d.donationType === filter);

  const totalDonated = mockDonations.reduce((sum, d) => sum + d.amountKobo, 0);
  const totalMeals = mockDonations.reduce((sum, d) => sum + (d.mealCount || 0), 0);

  const stats = {
    total: mockDonations.length,
    mealVouchers: mockDonations.filter(d => d.donationType === 'MEAL_VOUCHER').length,
    oneTime: mockDonations.filter(d => d.donationType === 'ONE_TIME').length,
    monthly: mockDonations.filter(d => d.donationType === 'MONTHLY').length,
  };

  const getDonationTypeLabel = (type: string) => {
    switch (type) {
      case 'MEAL_VOUCHER':
        return 'Meal Voucher';
      case 'ONE_TIME':
        return 'One-Time';
      case 'MONTHLY':
        return 'Monthly';
      default:
        return type;
    }
  };

  const getDonationTypeIcon = (type: string) => {
    switch (type) {
      case 'MEAL_VOUCHER':
        return 'Ticket';
      case 'ONE_TIME':
        return 'DollarSign';
      case 'MONTHLY':
        return '🔄';
      default:
        return 'HandHeart';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="error">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--secondary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <span>FileText</span>
            <span>Donation History</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Your Donations
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-3xl">
            Review all your contributions to fighting hunger and see the impact you've made.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-lg">
            <CardContent className="py-6">
              <div className="text-center">
                <DollarSign className="w-8 h-8 text-[var(--primary)]" />
                <p className="text-2xl font-bold">{formatCurrency(totalDonated)}</p>
                <p className="text-sm opacity-90">Total Donated</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/80 text-white border-none shadow-lg">
            <CardContent className="py-6">
              <div className="text-center">
                <Utensils className="w-8 h-8 text-[var(--primary)]" />
                <p className="text-2xl font-bold">{totalMeals}</p>
                <p className="text-sm opacity-90">Meals Funded</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/80 text-white border-none shadow-lg">
            <CardContent className="py-6">
              <div className="text-center">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-2xl font-bold">{mockDonations.length}</p>
                <p className="text-sm opacity-90">Total Donations</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
            <CardContent className="py-6">
              <div className="text-center">
                <Check className="w-6 h-6 text-[var(--primary)]" />
                <p className="text-2xl font-bold">{mockDonations.filter(d => d.status === 'COMPLETED').length}</p>
                <p className="text-sm opacity-90">Successful</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Donations ({stats.total})
              </Button>
              <Button
                variant={filter === 'MEAL_VOUCHER' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('MEAL_VOUCHER')}
              >
                Ticket Meal Vouchers ({stats.mealVouchers})
              </Button>
              <Button
                variant={filter === 'ONE_TIME' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('ONE_TIME')}
              >
                DollarSign One-Time ({stats.oneTime})
              </Button>
              <Button
                variant={filter === 'MONTHLY' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('MONTHLY')}
              >
                🔄 Monthly ({stats.monthly})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Donations List */}
        <div className="space-y-4">
          {filteredDonations.length > 0 ? (
            filteredDonations.map((donation) => (
              <Card key={donation.id} hover className="transition-all duration-300">
                <CardContent className="py-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white rounded-xl flex items-center justify-center text-3xl shadow-lg">
                        {getDonationTypeIcon(donation.donationType)}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-[var(--foreground)]">
                            {formatCurrency(donation.amountKobo)}
                          </h3>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {getDonationTypeLabel(donation.donationType)}
                            {donation.mealCount && ` • ${donation.mealCount} meal${donation.mealCount > 1 ? 's' : ''}`}
                          </p>
                        </div>
                        {getStatusBadge(donation.status)}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--muted-foreground)]">📅 Date:</span>
                          <span className="font-medium text-[var(--foreground)]">
                            {formatDate(donation.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--muted-foreground)]">🔖 Reference:</span>
                          <span className="font-mono text-xs text-[var(--foreground)]">
                            {donation.paymentRef}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex gap-2">
                      <Button variant="outline" size="sm">
                        📥 Receipt
                      </Button>
                      {donation.donationType === 'MONTHLY' && donation.status === 'COMPLETED' && (
                        <Button variant="ghost" size="sm">
                          ⚙️ Manage
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center bg-gradient-to-br from-[var(--muted)] to-white border-2 border-dashed border-[var(--border)]">
              <CardContent className="py-16">
                <div className="text-6xl mb-4">HandHeart</div>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                  No {filter !== 'all' && getDonationTypeLabel(filter)} Donations
                </h3>
                <p className="text-[var(--muted-foreground)] mb-6">
                  {filter === 'all'
                    ? "You haven&apos;t made any donations yet. Start making a difference today!"
                    : `You don&apos;t have any ${getDonationTypeLabel(filter).toLowerCase()} donations yet.`}
                </p>
                <Button size="lg" onClick={() => window.location.href = '/donor/donate'}>
                  Make a Donation
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Export */}
        {filteredDonations.length > 0 && (
          <Card className="mt-8 bg-gradient-to-br from-[var(--muted)] to-white">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">
                    Export Your Donation History
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Download a complete record for tax purposes or personal records
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="lg">
                    📥 Download PDF
                  </Button>
                  <Button variant="outline" size="lg">
                    BarChart3 Download CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Monthly Subscription Info */}
        {stats.monthly > 0 && (
          <Card className="mt-6 bg-gradient-to-br from-[var(--accent)]/5 to-white border-2 border-[var(--accent)]/20">
            <CardHeader>
              <CardTitle>Monthly Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                You have {stats.monthly} active monthly subscription{stats.monthly > 1 ? 's' : ''}. 
                Thank you for your ongoing support!
              </p>
              <Button variant="outline">
                Manage Subscriptions
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
