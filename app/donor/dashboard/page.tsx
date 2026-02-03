import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const impactHighlights = [
  { label: 'Meals funded', value: '48', detail: '12 vouchers active' },
  { label: 'Partners reached', value: '7', detail: 'Across Lagos' },
  { label: 'Families supported', value: '19', detail: 'Verified beneficiaries' },
  { label: 'Impact rate', value: '92%', detail: 'Redemptions completed' },
];

const recentDonations = [
  {
    title: 'Voucher bundle',
    detail: '₦25,000 · 10 vouchers',
    status: 'Processing',
    time: 'Today, 08:45',
  },
  {
    title: 'Surplus rescue fund',
    detail: '₦12,000 · 24 packs',
    status: 'Completed',
    time: 'Yesterday, 16:20',
  },
  {
    title: 'Emergency top-up',
    detail: '₦8,000 · 16 meals',
    status: 'Completed',
    time: 'Mon, 14:10',
  },
];

const donorActions = [
  {
    title: 'Fund meal vouchers',
    description: 'Sponsor vouchers that can be redeemed immediately.',
    href: '/donor/donate',
  },
  {
    title: 'Review donation history',
    description: 'Track receipts and see where your funding went.',
    href: '/donor/history',
  },
  {
    title: 'See impact dashboard',
    description: 'View aggregated impact numbers and stories.',
    href: '/donor/impact',
  },
];

const spotlightStories = [
  {
    title: 'Campus Kitchen partnership',
    description: 'Your funding helped deliver 60 meals during exam week.',
  },
  {
    title: 'Community surplus rescue',
    description: 'Surplus packs reduced food waste by 35% in two weeks.',
  },
];

export default function DonorDashboard() {
  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Donor dashboard</p>
              <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] mt-3">Welcome back, Chioma</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Keep track of your giving, see impact, and fund the next meal.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/donor/donate">
                <Button size="lg">Fund vouchers</Button>
              </Link>
              <Link href="/donor/impact">
                <Button variant="outline" size="lg">View impact</Button>
              </Link>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {impactHighlights.map((item) => (
              <Card key={item.label} className="shadow-[var(--shadow)]">
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)]">{item.label}</p>
                  <p className="text-3xl font-semibold text-[var(--foreground)] mt-2">{item.value}</p>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{item.detail}</p>
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
                  {donorActions.map((action) => (
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
                  <CardTitle className="text-2xl">Recent donations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentDonations.map((donation) => (
                    <div key={donation.title} className="border-b border-dashed border-[var(--border)] pb-4 last:border-b-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{donation.title}</p>
                          <p className="text-sm text-[var(--muted-foreground)]">{donation.detail}</p>
                        </div>
                        <span className="text-xs text-[var(--muted-foreground)]">{donation.time}</span>
                      </div>
                      <p className="text-xs text-[var(--primary)] mt-2">Status: {donation.status}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-[var(--shadow)] bg-[var(--primary-dark)] text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Impact spotlight</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {spotlightStories.map((story) => (
                    <div key={story.title}>
                      <p className="text-base font-semibold">{story.title}</p>
                      <p className="text-sm text-white/80 mt-1">{story.description}</p>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="mt-2 text-white border-white/40 hover:border-white">
                    Read full story
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-xl">Upcoming needs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                  <p>Exam week relief fund needs ₦40,000 more to activate.</p>
                  <p>Two community kitchens have surplus packs ready for sponsorship.</p>
                  <Link href="/donor/donate">
                    <Button variant="outline" size="sm">Sponsor now</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-xl">Support contacts</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[var(--muted-foreground)] space-y-3">
                  <p>EcoEats Donor Relations</p>
                  <p className="font-semibold text-[var(--foreground)]">donors@ecoeats.org</p>
                  <p>Mon - Fri, 9:00 AM - 5:00 PM</p>
                  <Link href="/contact">
                    <Button variant="outline" size="sm">Contact support</Button>
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
