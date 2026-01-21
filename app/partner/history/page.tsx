'use client';

import { useState } from 'react';
import { History, UtensilsCrossed, Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function PartnerHistoryPage() {
  const [filter, setFilter] = useState<'all' | 'redemptions' | 'surplus'>('all');

  // Mock data
  const redemptions = [
    {
      id: '1',
      code: 'EAT-7H3K2',
      amount: 150000,
      beneficiary: 'John D.',
      date: '2026-01-21T10:30:00',
      status: 'COMPLETED',
    },
    {
      id: '2',
      code: 'EAT-9M2P5',
      amount: 100000,
      beneficiary: 'Sarah M.',
      date: '2026-01-21T09:15:00',
      status: 'COMPLETED',
    },
    {
      id: '3',
      code: 'EAT-X4R8T',
      amount: 200000,
      beneficiary: 'Mike K.',
      date: '2026-01-20T14:45:00',
      status: 'COMPLETED',
    },
  ];

  const surplusHistory = [
    {
      id: '1',
      title: 'Fresh Rice & Stew',
      posted: '2026-01-21T08:00:00',
      quantity: 10,
      claimed: 7,
      status: 'ACTIVE',
    },
    {
      id: '2',
      title: 'Vegetable Salad Bowls',
      posted: '2026-01-21T09:30:00',
      quantity: 8,
      claimed: 5,
      status: 'ACTIVE',
    },
    {
      id: '3',
      title: 'Fresh Bread & Pastries',
      posted: '2026-01-20T07:00:00',
      quantity: 15,
      claimed: 15,
      status: 'COMPLETED',
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const totalRedemptions = redemptions.length;
  const totalRevenue = redemptions.reduce((sum, r) => sum + r.amount, 0);
  const totalSurplus = surplusHistory.length;
  const totalMealsSaved = surplusHistory.reduce((sum, s) => sum + s.claimed, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--accent)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <History className="w-4 h-4" />
            <span>Activity History</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Your History
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-3xl">
            Track all your voucher redemptions and surplus food postings.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="py-6 text-center">
              <Check className="w-8 h-8 text-[var(--primary)] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--foreground)]">{totalRedemptions}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Redemptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="text-3xl mb-2">₦</div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {(totalRevenue / 100).toLocaleString()}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <UtensilsCrossed className="w-8 h-8 text-[var(--secondary)] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[var(--foreground)]">{totalSurplus}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Surplus Posted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6 text-center">
              <div className="text-3xl mb-2">🍽️</div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{totalMealsSaved}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Meals Saved</p>
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
                <Filter className="w-4 h-4 mr-2" />
                All Activity
              </Button>
              <Button
                variant={filter === 'redemptions' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('redemptions')}
              >
                <Check className="w-4 h-4 mr-2" />
                Redemptions ({redemptions.length})
              </Button>
              <Button
                variant={filter === 'surplus' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('surplus')}
              >
                <UtensilsCrossed className="w-4 h-4 mr-2" />
                Surplus Posts ({surplusHistory.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Lists */}
        <div className="space-y-4">
          {/* Redemptions */}
          {(filter === 'all' || filter === 'redemptions') && redemptions.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
                Voucher Redemptions
              </h2>
              <div className="space-y-3">
                {redemptions.map((redemption) => (
                  <Card key={redemption.id} hover>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-lg flex items-center justify-center">
                            <Check className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono font-semibold text-[var(--foreground)]">
                                {redemption.code}
                              </span>
                              <Badge variant="success">{redemption.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
                              <span>Beneficiary: {redemption.beneficiary}</span>
                              <span>•</span>
                              <span>{formatDate(redemption.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[var(--primary)]">
                            ₦{(redemption.amount / 100).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Surplus History */}
          {(filter === 'all' || filter === 'surplus') && surplusHistory.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
                Surplus Food Posts
              </h2>
              <div className="space-y-3">
                {surplusHistory.map((surplus) => (
                  <Card key={surplus.id} hover>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-[var(--secondary)] text-white rounded-lg flex items-center justify-center">
                            <UtensilsCrossed className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-semibold text-[var(--foreground)]">
                                {surplus.title}
                              </span>
                              <Badge variant={surplus.status === 'ACTIVE' ? 'success' : 'default'}>
                                {surplus.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
                              <span>{surplus.claimed} of {surplus.quantity} claimed</span>
                              <span>•</span>
                              <span>Posted {formatDate(surplus.posted)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export */}
        <Card className="mt-8 bg-gradient-to-br from-[var(--muted)] to-white">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">
                  Export Your History
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Download your activity history for your records
                </p>
              </div>
              <Button variant="outline" size="lg">
                📥 Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
