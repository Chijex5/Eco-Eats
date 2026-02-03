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
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Section */}
          <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)] font-semibold">
                Donor dashboard
              </p>
              <h1 className="text-4xl sm:text-5xl text-[var(--foreground)] font-bold tracking-tight">
                Welcome back, Chioma
              </h1>
              <p className="text-base text-[var(--muted-foreground)] max-w-2xl leading-relaxed">
                Keep track of your giving, see impact, and fund the next meal.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/donor/donate">
                <Button size="lg" className="w-full sm:w-auto">Fund vouchers</Button>
              </Link>
              <Link href="/donor/impact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">View impact</Button>
              </Link>
            </div>
          </section>

          {/* Impact Highlights */}
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {impactHighlights.map((item) => (
              <Card key={item.label} className="shadow-[var(--shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow)]">
                <CardContent className="pt-6 pb-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)] font-semibold">
                    {item.label}
                  </p>
                  <p className="text-4xl font-bold text-[var(--foreground)] mt-3 mb-2">
                    {item.value}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {item.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Main Content Grid */}
          <section className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-10">
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl">Quick actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-5">
                  {donorActions.map((action) => (
                    <div
                      key={action.title}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[var(--border)] px-5 py-5 hover:border-[var(--primary)]/30 hover:bg-[var(--muted)]/30 transition-all duration-200"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-[var(--foreground)] text-base">
                          {action.title}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                      <Link href={action.href}>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto whitespace-nowrap">
                          Open
                        </Button>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Donations */}
              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl">Recent donations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {recentDonations.map((donation) => (
                    <div 
                      key={donation.title} 
                      className="border-b border-dashed border-[var(--border)] pb-5 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <div className="space-y-1">
                          <p className="font-semibold text-[var(--foreground)] text-base">
                            {donation.title}
                          </p>
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {donation.detail}
                          </p>
                        </div>
                        <span className="text-xs text-[var(--muted-foreground)] font-medium">
                          {donation.time}
                        </span>
                      </div>
                      <span className="inline-block text-xs font-semibold text-[var(--primary)] px-3 py-1.5 bg-[var(--primary)]/10 rounded-full">
                        Status: {donation.status}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Impact Spotlight */}
              <Card className="shadow-[var(--shadow)] bg-[var(--primary-dark)] text-white">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Impact spotlight</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {spotlightStories.map((story) => (
                    <div key={story.title} className="space-y-2">
                      <p className="text-base font-semibold leading-snug">{story.title}</p>
                      <p className="text-sm text-white/90 leading-relaxed">{story.description}</p>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 text-white border-white/40 hover:border-white hover:bg-white/10"
                  >
                    Read full story
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Needs */}
              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Upcoming needs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-[var(--muted-foreground)] leading-relaxed">
                  <p>Exam week relief fund needs ₦40,000 more to activate.</p>
                  <p>Two community kitchens have surplus packs ready for sponsorship.</p>
                  <Link href="/donor/donate" className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full">Sponsor now</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Support Contacts */}
              <Card className="shadow-[var(--shadow)]">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Support contacts</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[var(--muted-foreground)] space-y-3 leading-relaxed">
                  <p className="font-medium">EcoEats Donor Relations</p>
                  <p className="font-semibold text-[var(--foreground)] text-base">donors@ecoeats.org</p>
                  <p>Mon - Fri, 9:00 AM - 5:00 PM</p>
                  <Link href="/contact" className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full">Contact support</Button>
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
