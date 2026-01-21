'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed, MapPin, Clock, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';

export default function PostSurplusPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    pickupHours: '4',
    claimLimit: '1',
    location: 'Main Campus, Building A',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push('/partner/dashboard');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]">
            <CardContent className="py-12">
              <div className="w-20 h-20 bg-[var(--primary)] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <UtensilsCrossed className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
                Surplus Posted Successfully!
              </h2>
              <p className="text-lg text-[var(--muted-foreground)] mb-2">
                Your surplus food listing is now live and beneficiaries can start claiming it.
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Redirecting to dashboard...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--secondary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Post Surplus Food</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Share Your Surplus
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Help reduce food waste by making your surplus food available to beneficiaries in need.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="py-6">
              <Clock className="w-8 h-8 text-[var(--primary)] mx-auto mb-2" />
              <h3 className="font-semibold text-[var(--foreground)] mb-1">Quick Process</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                List food in under 2 minutes
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <Users className="w-8 h-8 text-[var(--secondary)] mx-auto mb-2" />
              <h3 className="font-semibold text-[var(--foreground)] mb-1">Reach Beneficiaries</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Connect with people in need
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <AlertCircle className="w-8 h-8 text-[var(--accent)] mx-auto mb-2" />
              <h3 className="font-semibold text-[var(--foreground)] mb-1">Track Claims</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Monitor pickups in real-time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Surplus Food Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <Input
                label="Food Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Fresh Rice & Stew, Vegetable Salad Bowls"
                helperText="Give it a descriptive name so beneficiaries know what to expect"
                required
              />

              {/* Description */}
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the food, ingredients, portion size, etc."
                helperText="Be specific about what's included and any dietary information"
                required
              />

              {/* Quantity and Claim Limit */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Total Quantity Available"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g., 10"
                  helperText="Number of packs/portions available"
                  required
                />

                <Select
                  label="Claim Limit Per Person"
                  name="claimLimit"
                  value={formData.claimLimit}
                  onChange={handleChange}
                  options={[
                    { value: '1', label: '1 pack per person' },
                    { value: '2', label: '2 packs per person' },
                    { value: '3', label: '3 packs per person' },
                  ]}
                  helperText="Maximum claimable by one person"
                />
              </div>

              {/* Pickup Details */}
              <Select
                label="Pickup Deadline"
                name="pickupHours"
                value={formData.pickupHours}
                onChange={handleChange}
                options={[
                  { value: '2', label: 'Within 2 hours' },
                  { value: '4', label: 'Within 4 hours' },
                  { value: '6', label: 'Within 6 hours' },
                  { value: '8', label: 'Within 8 hours' },
                ]}
                helperText="How soon must beneficiaries pick up the food?"
              />

              <Input
                label="Pickup Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Main Campus, Building A"
                helperText="Where can beneficiaries collect the food?"
                required
              />

              {/* Important Notice */}
              <Card className="bg-[var(--muted)] border-[var(--border)]">
                <CardContent className="py-4">
                  <h4 className="font-semibold text-[var(--foreground)] mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-[var(--secondary)]" />
                    Food Safety Guidelines
                  </h4>
                  <ul className="text-sm text-[var(--muted-foreground)] space-y-1 ml-6">
                    <li>• Ensure food is fresh and safe to consume</li>
                    <li>• Food should be properly stored until pickup</li>
                    <li>• Clearly communicate any allergen information</li>
                    <li>• Be available during the pickup window</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <UtensilsCrossed className="w-4 h-4 mr-2" />
                      Post Surplus Food
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/partner/dashboard')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mt-8 bg-gradient-to-br from-[var(--accent)]/5 to-white border-[var(--accent)]/20">
          <CardContent className="py-6">
            <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[var(--accent)]" />
              Why Post Surplus Food?
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm text-[var(--muted-foreground)]">
              <div>
                <strong className="text-[var(--foreground)]">Reduce Waste:</strong> Keep good food from going to landfills
              </div>
              <div>
                <strong className="text-[var(--foreground)]">Help Community:</strong> Support people facing food insecurity
              </div>
              <div>
                <strong className="text-[var(--foreground)]">Track Impact:</strong> See how many meals you've saved
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
