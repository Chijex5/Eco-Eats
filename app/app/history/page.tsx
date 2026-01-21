'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockHistory, formatDate } from '@/lib/mockData';

export default function HistoryPage() {
  const [filter, setFilter] = useState<'all' | 'request' | 'voucher' | 'surplus' | 'redemption'>('all');

  const filteredHistory = filter === 'all' 
    ? mockHistory 
    : mockHistory.filter(item => item.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'request':
        return '📝';
      case 'voucher':
        return '🎫';
      case 'surplus':
        return '🍱';
      case 'redemption':
        return '✓';
      default:
        return '📋';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'request':
        return 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20';
      case 'voucher':
        return 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20';
      case 'surplus':
        return 'bg-[var(--secondary)]/10 text-[var(--secondary)] border-[var(--secondary)]/20';
      case 'redemption':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-[var(--muted)] text-[var(--muted-foreground)]';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'COMPLETED' || status === 'ACTIVE' || status === 'PICKED_UP') {
      return <Badge variant="success">{status}</Badge>;
    }
    if (status === 'PENDING') {
      return <Badge variant="warning">{status}</Badge>;
    }
    if (status === 'APPROVED') {
      return <Badge variant="info">{status}</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  const stats = {
    total: mockHistory.length,
    requests: mockHistory.filter(h => h.type === 'request').length,
    vouchers: mockHistory.filter(h => h.type === 'voucher').length,
    surplus: mockHistory.filter(h => h.type === 'surplus').length,
    redemptions: mockHistory.filter(h => h.type === 'redemption').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--accent)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <span>📜</span>
            <span>Activity History</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Your Activity
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-3xl">
            Track all your interactions with EcoEats - from support requests to meal redemptions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-[var(--muted)] to-white">
            <CardContent className="py-4 text-center">
              <div className="text-3xl mb-1">📋</div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[var(--accent)]/10 to-white">
            <CardContent className="py-4 text-center">
              <div className="text-3xl mb-1">📝</div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.requests}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Requests</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[var(--primary)]/10 to-white">
            <CardContent className="py-4 text-center">
              <div className="text-3xl mb-1">🎫</div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.vouchers}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Vouchers</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[var(--secondary)]/10 to-white">
            <CardContent className="py-4 text-center">
              <div className="text-3xl mb-1">🍱</div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.surplus}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Surplus</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-100 to-white dark:from-green-900/20">
            <CardContent className="py-4 text-center">
              <div className="text-3xl mb-1">✓</div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.redemptions}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Redeemed</p>
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
                All Activity
              </Button>
              <Button
                variant={filter === 'request' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('request')}
              >
                📝 Requests
              </Button>
              <Button
                variant={filter === 'voucher' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('voucher')}
              >
                🎫 Vouchers
              </Button>
              <Button
                variant={filter === 'surplus' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('surplus')}
              >
                🍱 Surplus
              </Button>
              <Button
                variant={filter === 'redemption' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('redemption')}
              >
                ✓ Redemptions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Timeline */}
        <div className="space-y-4">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => (
              <Card key={item.id} hover className="transition-all duration-300">
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl border ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="font-semibold text-[var(--foreground)]">
                          {item.title}
                        </h3>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)] mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                        <span>🕒 {formatDate(item.date)}</span>
                        <span className="capitalize">• {item.type}</span>
                      </div>
                    </div>

                    {/* Visual Timeline Connector */}
                    {index < filteredHistory.length - 1 && (
                      <div className="absolute left-[58px] top-[80px] w-0.5 h-8 bg-[var(--border)]" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center bg-gradient-to-br from-[var(--muted)] to-white border-2 border-dashed border-[var(--border)]">
              <CardContent className="py-16">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                  No {filter !== 'all' ? filter : ''} Activity
                </h3>
                <p className="text-[var(--muted-foreground)] mb-6">
                  {filter === 'all' 
                    ? "You haven&apos;t had any activity yet. Start by requesting support or claiming surplus food."
                    : `You don&apos;t have any ${filter} activity yet.`
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" onClick={() => window.location.href = '/app/request-help'}>
                    Request Support
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.href = '/app/surplus'}>
                    Browse Surplus
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Export/Download */}
        {filteredHistory.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
