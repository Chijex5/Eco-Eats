'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { mockSurplusListings, formatDeadline, formatDate } from '@/lib/mockData';

export default function SurplusDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const listing = mockSurplusListings.find(l => l.id === resolvedParams.id);
  const [quantity, setQuantity] = useState(1);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [pickupCode, setPickupCode] = useState('');

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="py-16">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">
                Listing Not Found
              </h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                This surplus food listing doesn't exist or has been removed.
              </p>
              <Button onClick={() => router.push('/app/surplus')}>
                Back to Listings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const available = listing.quantityAvailable - listing.quantityClaimed;
  const isExpiringSoon = new Date(listing.pickupDeadline).getTime() - Date.now() < 2 * 60 * 60 * 1000;
  const maxClaim = Math.min(listing.claimLimit, available);

  const handleClaim = async () => {
    setIsClaiming(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate pickup code
    const code = `PICK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setPickupCode(code);
    setClaimed(true);
    setIsClaiming(false);
  };

  if (claimed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]">
            <CardContent className="py-12">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                  ✓
                </div>
                <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
                  Food Pack Claimed Successfully!
                </h2>
                <p className="text-lg text-[var(--muted-foreground)] mb-2">
                  You have successfully claimed {quantity} pack{quantity > 1 ? 's' : ''} from {listing.partnerName}.
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Please pick up before {formatDeadline(listing.pickupDeadline)}.
                </p>
              </div>

              {/* Pickup Code */}
              <Card className="bg-white border-2 border-[var(--primary)] mb-8">
                <CardHeader className="text-center">
                  <CardTitle>Your Pickup Code</CardTitle>
                  <p className="text-sm text-[var(--muted-foreground)] mt-2">
                    Show this code when you arrive to collect your food
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-[var(--muted)] rounded-xl p-6 mb-4">
                    <p className="text-4xl font-bold font-mono text-center text-[var(--primary)] tracking-wider">
                      {pickupCode}
                    </p>
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)] space-y-2">
                    <p>📍 <strong>Location:</strong> {listing.location}</p>
                    <p>⏰ <strong>Pickup by:</strong> {formatDeadline(listing.pickupDeadline)}</p>
                    <p>📦 <strong>Quantity:</strong> {quantity} pack{quantity > 1 ? 's' : ''}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="bg-gradient-to-br from-[var(--accent)]/5 to-white border-[var(--accent)]/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Pickup Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm text-[var(--muted-foreground)]">
                    <li className="flex gap-3">
                      <span className="font-bold text-[var(--foreground)]">1.</span>
                      <span>Visit {listing.partnerName} at {listing.location} before the deadline</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[var(--foreground)]">2.</span>
                      <span>Show your pickup code to the staff</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[var(--foreground)]">3.</span>
                      <span>Staff will verify and give you your food pack</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[var(--foreground)]">4.</span>
                      <span>If you can't make it, please cancel your claim so others can benefit</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => router.push('/app/history')}
                >
                  View in History
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => router.push('/app/surplus')}
                >
                  Browse More Listings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/app/surplus')}
          className="mb-6"
        >
          ← Back to Listings
        </Button>

        {/* Warning Banner */}
        {isExpiringSoon && (
          <Card className="mb-6 bg-gradient-to-br from-[var(--destructive)]/10 to-white border-2 border-[var(--destructive)]">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">
                    Pickup Deadline Soon!
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    This listing expires in {formatDeadline(listing.pickupDeadline)}. 
                    Claim now if you can pick up before the deadline.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="text-6xl">{listing.partnerLogo}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <CardTitle className="text-2xl">{listing.title}</CardTitle>
                  <Badge variant={available > 3 ? 'success' : 'warning'}>
                    {available} left
                  </Badge>
                </div>
                <p className="text-[var(--muted-foreground)]">{listing.partnerName}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-[var(--foreground)] mb-2">Description</h3>
              <p className="text-[var(--muted-foreground)]">{listing.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[var(--muted)] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">📦</span>
                  <span className="text-sm text-[var(--muted-foreground)]">Available</span>
                </div>
                <p className="font-bold text-2xl text-[var(--foreground)]">
                  {available} of {listing.quantityAvailable}
                </p>
              </div>

              <div className="bg-[var(--muted)] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">⏰</span>
                  <span className="text-sm text-[var(--muted-foreground)]">Pickup Deadline</span>
                </div>
                <p className={`font-bold text-lg ${
                  isExpiringSoon ? 'text-[var(--destructive)]' : 'text-[var(--foreground)]'
                }`}>
                  {formatDeadline(listing.pickupDeadline)}
                </p>
              </div>

              <div className="bg-[var(--muted)] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">📍</span>
                  <span className="text-sm text-[var(--muted-foreground)]">Location</span>
                </div>
                <p className="font-semibold text-[var(--foreground)]">{listing.location}</p>
              </div>

              <div className="bg-[var(--muted)] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🎫</span>
                  <span className="text-sm text-[var(--muted-foreground)]">Claim Limit</span>
                </div>
                <p className="font-semibold text-[var(--foreground)]">
                  Max {listing.claimLimit} per person
                </p>
              </div>
            </div>

            {/* Posted Info */}
            <div className="text-sm text-[var(--muted-foreground)]">
              Posted {formatDate(listing.createdAt)}
            </div>
          </CardContent>
        </Card>

        {/* Claim Form */}
        {available > 0 ? (
          <Card className="bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]">
            <CardHeader>
              <CardTitle>Claim Your Food Pack</CardTitle>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Select quantity and confirm your claim. You'll receive a pickup code to collect your food.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                    How many packs do you want to claim?
                  </label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      −
                    </Button>
                    <div className="flex-1">
                      <Input
                        type="number"
                        min={1}
                        max={maxClaim}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(maxClaim, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="text-center text-xl font-bold"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setQuantity(Math.min(maxClaim, quantity + 1))}
                      disabled={quantity >= maxClaim}
                    >
                      +
                    </Button>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-2 text-center">
                    Maximum {maxClaim} pack{maxClaim > 1 ? 's' : ''} available
                  </p>
                </div>

                {/* Pickup Reminder */}
                <Card className="bg-[var(--muted)] border-[var(--border)]">
                  <CardContent className="py-4">
                    <h4 className="font-semibold text-[var(--foreground)] mb-2 flex items-center">
                      <span className="mr-2">📋</span>
                      Before You Claim
                    </h4>
                    <ul className="text-sm text-[var(--muted-foreground)] space-y-1 ml-7">
                      <li>• Can you pick up at {listing.location}?</li>
                      <li>• Can you arrive before {formatDeadline(listing.pickupDeadline)}?</li>
                      <li>• Bring a bag or container for your food</li>
                      <li>• You'll receive a pickup code after claiming</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Claim Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => router.push('/app/surplus')}
                    disabled={isClaiming}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleClaim}
                    disabled={isClaiming}
                  >
                    {isClaiming ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Claiming...
                      </>
                    ) : (
                      `Claim ${quantity} Pack${quantity > 1 ? 's' : ''}`
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center bg-gradient-to-br from-[var(--muted)] to-white border-2 border-dashed border-[var(--border)]">
            <CardContent className="py-12">
              <div className="text-5xl mb-4">😔</div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">
                All Packs Claimed
              </h3>
              <p className="text-[var(--muted-foreground)] mb-6">
                This listing has been fully claimed. Check out other available listings.
              </p>
              <Button size="lg" onClick={() => router.push('/app/surplus')}>
                Browse Other Listings
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
