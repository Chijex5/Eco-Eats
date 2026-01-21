'use client';

import Link from 'next/link';
import { Shield, Users, Store, Ticket, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboardPage() {
  // Mock data - will be replaced with real data in Phase B
  const stats = {
    pendingRequests: 12,
    activeBeneficiaries: 245,
    activePartners: 8,
    pendingPartners: 3,
    vouchersIssued: 450,
    vouchersRedeemed: 312,
    totalImpact: 98500000, // in kobo
    monthlyGrowth: 15,
  };

  const recentActivity = [
    {
      id: '1',
      type: 'REQUEST',
      title: 'New help request from Sarah M.',
      time: '5 minutes ago',
      status: 'PENDING',
    },
    {
      id: '2',
      type: 'REDEMPTION',
      title: 'Voucher redeemed at Campus Cafeteria',
      time: '12 minutes ago',
      status: 'COMPLETED',
    },
    {
      id: '3',
      type: 'PARTNER',
      title: 'New partner application: Downtown Diner',
      time: '1 hour ago',
      status: 'PENDING',
    },
  ];

  const urgentTasks = [
    { id: '1', task: 'Review 12 pending beneficiary requests', link: '/admin/requests', priority: 'HIGH' },
    { id: '2', task: 'Approve 3 new partner applications', link: '/admin/partners', priority: 'MEDIUM' },
    { id: '3', task: 'Issue vouchers to 8 approved beneficiaries', link: '/admin/vouchers', priority: 'HIGH' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[var(--destructive)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </div>
              <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
                System Overview
              </h1>
              <p className="text-lg text-[var(--muted-foreground)]">
                Manage beneficiaries, partners, and monitor system health
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-[var(--destructive)] to-red-700 text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Pending Requests</p>
                  <p className="text-3xl font-bold">{stats.pendingRequests}</p>
                </div>
                <AlertCircle className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Active Beneficiaries</p>
                  <p className="text-3xl font-bold">{stats.activeBeneficiaries}</p>
                </div>
                <Users className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/80 text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Active Partners</p>
                  <p className="text-3xl font-bold">{stats.activePartners}</p>
                  <p className="text-xs opacity-75">+{stats.pendingPartners} pending</p>
                </div>
                <Store className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/80 text-white border-none shadow-xl">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Vouchers Issued</p>
                  <p className="text-3xl font-bold">{stats.vouchersIssued}</p>
                  <p className="text-xs opacity-75">{stats.vouchersRedeemed} redeemed</p>
                </div>
                <Ticket className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Tasks Alert */}
        {urgentTasks.length > 0 && (
          <Card className="mb-8 bg-gradient-to-br from-[var(--destructive)]/5 to-white border-2 border-[var(--destructive)]/30">
            <CardHeader>
              <CardTitle className="flex items-center text-[var(--destructive)]">
                <AlertCircle className="w-5 h-5 mr-2" />
                Tasks Requiring Attention ({urgentTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urgentTasks.map((task) => (
                  <Link key={task.id} href={task.link}>
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-[var(--border)] cursor-pointer">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.priority === 'HIGH'
                            ? 'bg-[var(--destructive)] text-white'
                            : 'bg-[var(--secondary)] text-white'
                        }`}>
                          {task.priority}
                        </div>
                        <span className="font-medium text-[var(--foreground)]">{task.task}</span>
                      </div>
                      <span className="text-[var(--muted-foreground)] text-sm">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Link href="/admin/requests">
            <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-[var(--primary)] cursor-pointer">
              <CardContent className="py-8 text-center">
                <div className="w-12 h-12 mb-4 text-[var(--primary)] mx-auto">
                  <Users className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  Review Requests
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Approve or deny help requests
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/partners">
            <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-[var(--secondary)] cursor-pointer">
              <CardContent className="py-8 text-center">
                <div className="w-12 h-12 mb-4 text-[var(--secondary)] mx-auto">
                  <Store className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  Manage Partners
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Approve new partner applications
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/vouchers">
            <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-[var(--accent)] cursor-pointer">
              <CardContent className="py-8 text-center">
                <div className="w-12 h-12 mb-4 text-[var(--accent)] mx-auto">
                  <Ticket className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  Issue Vouchers
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Create vouchers for beneficiaries
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/impact">
            <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-green-500 cursor-pointer">
              <CardContent className="py-8 text-center">
                <div className="w-12 h-12 mb-4 text-green-600 mx-auto">
                  <TrendingUp className="w-full h-full" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                  View Analytics
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  System-wide impact metrics
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-lg"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'REQUEST' ? 'bg-[var(--primary)] text-white' :
                          activity.type === 'PARTNER' ? 'bg-[var(--secondary)] text-white' :
                          'bg-[var(--accent)] text-white'
                        }`}>
                          {activity.type === 'REQUEST' && <Users className="w-5 h-5" />}
                          {activity.type === 'PARTNER' && <Store className="w-5 h-5" />}
                          {activity.type === 'REDEMPTION' && <Ticket className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[var(--foreground)]">{activity.title}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{activity.time}</p>
                        </div>
                      </div>
                      <Badge variant={activity.status === 'PENDING' ? 'default' : 'success'}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-sm text-[var(--muted-foreground)]">Redemption Rate</span>
                  </div>
                  <span className="font-semibold text-[var(--foreground)]">
                    {Math.round((stats.vouchersRedeemed / stats.vouchersIssued) * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-sm text-[var(--muted-foreground)]">Monthly Growth</span>
                  </div>
                  <span className="font-semibold text-[var(--primary)]">+{stats.monthlyGrowth}%</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-sm text-[var(--muted-foreground)]">Partner Coverage</span>
                  </div>
                  <span className="font-semibold text-[var(--foreground)]">{stats.activePartners} locations</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-[var(--primary)]" />
                    <span className="text-sm text-[var(--muted-foreground)]">Total Impact</span>
                  </div>
                  <span className="font-semibold text-[var(--primary)]">
                    ₦{(stats.totalImpact / 100).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
