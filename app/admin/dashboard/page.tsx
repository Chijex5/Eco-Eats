import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const highlights = [
  { label: 'Pending requests', value: '12', detail: 'Awaiting review today' },
  { label: 'Vouchers issued', value: '38', detail: 'Across 5 partners' },
  { label: 'Meals served', value: '29', detail: 'Redeemed this week' },
  { label: 'Partners active', value: '8', detail: 'Ready for redemptions' },
];

const quickActions = [
  {
    title: 'Review beneficiary requests',
    description: 'Approve or decline new requests and issue vouchers.',
    href: '/admin/requests',
    action: 'Open requests',
  },
  {
    title: 'Track redemption history',
    description: 'Monitor voucher redemptions and meals served.',
    href: '/admin/impact',
    action: 'View impact',
  },
  {
    title: 'Manage partner network',
    description: 'Check partner status and onboarding progress.',
    href: '/admin/partners',
    action: 'View partners',
  },
];

const activityLog = [
  {
    title: 'Voucher issued for Lagos Student Support',
    detail: '₦2,500 · 3 minutes ago',
  },
  {
    title: 'Request approved for Amina Yusuf',
    detail: 'Food pack · 25 minutes ago',
  },
  {
    title: 'Partner redemption confirmed',
    detail: 'Campus Kitchen · 2 hours ago',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)] font-semibold">
                Admin dashboard
              </p>
              <h1 className="text-4xl sm:text-5xl text-[var(--foreground)] font-semibold">
                Operations overview.
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                Review requests, issue vouchers, and keep tabs on partner activity across EcoEats.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/admin/requests">
                <Button size="lg">Review requests</Button>
              </Link>
              <Link href="/admin/impact">
                <Button variant="outline" size="lg">View impact</Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <Card key={item.label} className="shadow-[var(--shadow)]">
                <CardContent className="pt-6 pb-6 space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)] font-semibold">
                    {item.label}
                  </p>
                  <p className="text-3xl font-semibold text-[var(--foreground)]">{item.value}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action) => (
                  <div
                    key={action.title}
                    className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-[var(--foreground)]">{action.title}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{action.description}</p>
                    </div>
                    <Link href={action.href}>
                      <Button variant="outline" size="sm">{action.action}</Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Latest activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {activityLog.map((item) => (
                  <div key={item.title} className="space-y-1 border-b border-dashed border-[var(--border)] pb-3 last:border-b-0 last:pb-0">
                    <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                    <p className="text-[var(--muted-foreground)]">{item.detail}</p>
                  </div>
                ))}
                <Link href="/admin/requests" className="block pt-2">
                  <Button size="sm" className="w-full">Review pending requests</Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
