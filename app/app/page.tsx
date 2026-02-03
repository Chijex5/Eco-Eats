import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const quickActions = [
  {
    title: 'Request food support',
    description: 'Submit a new request for vouchers or surplus packs.',
    href: '/app/request-help',
  },
  {
    title: 'View voucher wallet',
    description: 'Check your active vouchers and redemption codes.',
    href: '/app/vouchers',
  },
  {
    title: 'Browse surplus packs',
    description: 'See nearby surplus packs and claim available slots.',
    href: '/app/surplus',
  },
];

const summaryStats = [
  { label: 'Active requests', value: '1', detail: 'Awaiting admin review' },
  { label: 'Available vouchers', value: '2', detail: 'Redeemable this week' },
  { label: 'Surplus packs claimed', value: '3', detail: 'Pickup codes issued' },
  { label: 'Meals received', value: '6', detail: 'Total impact so far' },
];

const nextSteps = [
  {
    title: 'Complete verification',
    description: 'Upload a quick ID or student card to speed up approval.',
  },
  {
    title: 'Choose pickup preferences',
    description: 'Set preferred pickup windows to reduce missed visits.',
  },
  {
    title: 'Share feedback',
    description: 'Tell us how the last meal pickup went to improve matching.',
  },
];

const recentActivity = [
  {
    title: 'Voucher request submitted',
    detail: 'Needs review within 24 hours.',
    time: 'Today, 09:12',
  },
  {
    title: 'Surplus pack claimed at Green Cafe',
    detail: 'Pickup code: EAT-0421',
    time: 'Yesterday, 17:45',
  },
  {
    title: 'Voucher redeemed',
    detail: 'Meal served at Campus Kitchen.',
    time: 'Mon, 11:20',
  },
];

export default function BeneficiaryDashboard() {
  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Beneficiary dashboard</p>
              <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">Welcome back, Amina</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Here&apos;s your support overview and next steps for the week.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/app/request-help">
                <Button size="lg">New request</Button>
              </Link>
              <Link href="/app/profile">
                <Button variant="outline" size="lg">Edit profile</Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryStats.map((stat) => (
              <Card key={stat.label} className="shadow-[var(--shadow)]">
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-semibold text-[var(--foreground)] mt-2">{stat.value}</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{stat.detail}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <div className="space-y-6">
              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-2xl">Quick actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {quickActions.map((action) => (
                    <div
                      key={action.title}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[var(--border)] px-4 py-4"
                    >
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{action.title}</p>
                        <p className="text-sm text-[var(--muted-foreground)]">{action.description}</p>
                      </div>
                      <Link href={action.href}>
                        <Button variant="outline" size="sm">Open</Button>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-2xl">Recent activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.title} className="border-b border-dashed border-[var(--border)] pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{activity.title}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{activity.detail}</p>
                        </div>
                        <span className="text-xs text-[var(--muted-foreground)]">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-[var(--shadow)] bg-[var(--primary-dark)] text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Current request status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/80">Meal voucher request</p>
                  <p className="text-2xl font-semibold mt-2">Pending review</p>
                  <p className="text-sm text-white/70 mt-2">Expected decision in 24 hours.</p>
                  <Button variant="outline" size="sm" className="mt-4 text-white border-white/40 hover:border-white">
                    View request
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-xl">Next steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)]">
                  {nextSteps.map((step) => (
                    <div key={step.title} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary)]" />
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{step.title}</p>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-xl">Support contacts</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[var(--muted-foreground)] space-y-3">
                  <p>EcoEats Help Desk</p>
                  <p className="font-semibold text-[var(--foreground)]">support@ecoeats.org</p>
                  <p>Mon - Fri, 9:00 AM - 5:00 PM</p>
                  <Link href="/contact">
                    <Button variant="outline" size="sm">Get in touch</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
