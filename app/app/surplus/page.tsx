'use client';

import Link from 'next/link';
import { UtensilsCrossed, ClipboardList, Store, Utensils, MapPin, Clock, Ticket, Lightbulb, Recycle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockSurplusListings, formatDeadline, formatDate } from '@/lib/mockData';

export default function SurplusPage() {
  const activeListings = mockSurplusListings.filter(l => l.status === 'ACTIVE');
  const totalAvailable = activeListings.reduce((sum, l) => sum + (l.quantityAvailable - l.quantityClaimed), 0);
  const now = Date.now();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--secondary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Surplus Food Rescue</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Available Surplus Food
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-3xl">
            Help reduce food waste while getting nutritious meals. Claim surplus food from our partners 
            before it goes to waste. All food is fresh and safe to consume.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/80 text-white border-none shadow-lg">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Available Today</p>
                  <p className="text-3xl font-bold">{totalAvailable} Packs</p>
                </div>
                <div className="w-12 h-12 opacity-80">
                <UtensilsCrossed className="w-full h-full" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-none shadow-lg">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Active Listings</p>
                  <p className="text-3xl font-bold">{activeListings.length}</p>
                </div>
                <div className="w-12 h-12 opacity-80">
                <ClipboardList className="w-full h-full" /></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/80 text-white border-none shadow-lg">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Partner Locations</p>
                  <p className="text-3xl font-bold">{new Set(activeListings.map(l => l.partnerId)).size}</p>
                </div>
                <div className="w-12 h-12 opacity-80">
                <Store className="w-full h-full" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-12 bg-gradient-to-br from-[var(--accent)]/5 to-white border-[var(--accent)]/20">
          <CardHeader>
            <CardTitle>How Surplus Food Rescue Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                  1
                </div>
                <h4 className="font-semibold text-[var(--foreground)] mb-2">Browse Listings</h4>
                <p className="text-sm text-[var(--muted-foreground)]">
                  See available surplus food from partner locations
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                  2
                </div>
                <h4 className="font-semibold text-[var(--foreground)] mb-2">Claim Your Pack</h4>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Reserve food packs before pickup deadline
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                  3
                </div>
                <h4 className="font-semibold text-[var(--foreground)] mb-2">Get Pickup Code</h4>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Receive confirmation with pickup code
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                  4
                </div>
                <h4 className="font-semibold text-[var(--foreground)] mb-2">Pick Up Food</h4>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Visit location with your code before deadline
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listings */}
        {activeListings.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
              Current Listings
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {activeListings.map((listing) => {
                const available = listing.quantityAvailable - listing.quantityClaimed;
                const percentClaimed = (listing.quantityClaimed / listing.quantityAvailable) * 100;
                const isLowStock = available <= 3;
                const isExpiringSoon = new Date(listing.pickupDeadline).getTime() - now < 2 * 60 * 60 * 1000;

                return (
                  <Link key={listing.id} href={`/app/surplus/${listing.id}`}>
                    <Card hover className="h-full transition-all duration-300 border-2 border-transparent hover:border-[var(--secondary)]">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 text-[var(--primary)]">
                          <Utensils className="w-full h-full" /></div>
                              <div>
                                <CardTitle className="text-lg leading-tight mb-1">
                                  {listing.title}
                                </CardTitle>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                  {listing.partnerName}
                                </p>
                              </div>
                            </div>
                          </div>
                          {isLowStock && (
                            <Badge variant="warning">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                          {listing.description}
                        </p>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-[var(--muted-foreground)]">
                              {available} of {listing.quantityAvailable} available
                            </span>
                            <span className={`font-semibold ${
                              isLowStock ? 'text-[var(--secondary)]' : 'text-[var(--primary)]'
                            }`}>
                              {Math.round((available / listing.quantityAvailable) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-[var(--muted)] rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isLowStock
                                  ? 'bg-[var(--secondary)]'
                                  : 'bg-[var(--primary)]'
                              }`}
                              style={{ width: `${100 - percentClaimed}%` }}
                            />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span>MapPin</span>
                            <span className="text-[var(--muted-foreground)]">{listing.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span>Clock</span>
                            <span className={`font-medium ${
                              isExpiringSoon
                                ? 'text-[var(--destructive)]'
                                : 'text-[var(--foreground)]'
                            }`}>
                              Pickup by {formatDeadline(listing.pickupDeadline)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span>Ticket</span>
                            <span className="text-[var(--muted-foreground)]">
                              Max {listing.claimLimit} per person
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-3 border-t border-[var(--border)]">
                          <Button
                            variant={available > 0 ? 'primary' : 'ghost'}
                            size="sm"
                            className="w-full"
                            disabled={available === 0}
                          >
                            {available > 0 ? 'Claim Food →' : 'Fully Claimed'}
                          </Button>
                        </div>

                        {/* Posted Time */}
                        <p className="text-xs text-[var(--muted-foreground)]">
                          Posted {formatDate(listing.createdAt)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <Card className="text-center bg-gradient-to-br from-[var(--muted)] to-white border-2 border-dashed border-[var(--border)]">
            <CardContent className="py-16">
              <UtensilsCrossed className="w-16 h-16 mb-4 text-[var(--muted-foreground)]" />
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                No Listings Available
              </h3>
              <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
                There are no surplus food listings at the moment. Check back later or 
                enable notifications to be alerted when new listings are posted.
              </p>
              <Button size="lg" onClick={() => window.location.reload()}>
                🔄 Refresh Page
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Banner */}
        <Card className="mt-12 bg-gradient-to-br from-[var(--primary)]/5 to-white border-[var(--primary)]/20">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 text-[var(--accent)]">
              <Lightbulb className="w-full h-full" /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--foreground)] mb-2">
                  Reducing Food Waste, Fighting Hunger
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-3">
                  Every day, our partners have surplus food that would otherwise go to waste. 
                  By claiming this food, you're not only getting a nutritious meal but also 
                  helping reduce food waste and environmental impact.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-[var(--primary)]">
                  <Recycle className="w-5 h-5" /></span>
                    <span className="text-[var(--muted-foreground)]">Reduce waste</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-[var(--accent)]">
                  <Globe className="w-5 h-5" /></span>
                    <span className="text-[var(--muted-foreground)]">Help environment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-[var(--primary)]">
                  <Utensils className="w-5 h-5" /></span>
                    <span className="text-[var(--muted-foreground)]">Fresh, safe food</span>
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
