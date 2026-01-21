'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';

export default function RequestHelpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    requestType: 'VOUCHER',
    urgency: 'MEDIUM',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);

    // Redirect to vouchers page after 2 seconds
    setTimeout(() => {
      router.push('/app/vouchers');
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
              <div className="w-20 h-20 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                ✓
              </div>
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
                Request Submitted Successfully!
              </h2>
              <p className="text-lg text-[var(--muted-foreground)] mb-6">
                Your support request has been received and is being reviewed by our admin team. 
                You&apos;ll be notified once it's approved.
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Redirecting to your vouchers...
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
          <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <span>🙋</span>
            <span>Request Food Support</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            We're Here to Help
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Your request will be reviewed discreetly and handled with dignity. 
            All information is confidential.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1">Confidential</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Your privacy is our priority
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1">Fast Review</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Usually reviewed within 24 hours
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl mb-2">❤️</div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1">With Dignity</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Respectful, judgment-free support
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Request Type */}
              <Select
                label="What type of support do you need?"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                options={[
                  { value: 'VOUCHER', label: 'Meal Voucher - Use at partner restaurants' },
                  { value: 'FOOD_PACK', label: 'Food Pack - Ready-to-eat meals' },
                ]}
                helperText="Choose the type of support that best fits your needs"
              />

              {/* Urgency */}
              <Select
                label="How urgent is your need?"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                options={[
                  { value: 'LOW', label: 'Low - Planning ahead' },
                  { value: 'MEDIUM', label: 'Medium - Need within a week' },
                  { value: 'HIGH', label: 'High - Immediate need' },
                ]}
                helperText="This helps us prioritize requests"
              />

              {/* Message */}
              <Textarea
                label="Tell us about your situation (optional)"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share any details you'd like us to know. This is optional but can help us better understand your needs."
                helperText="All information is kept strictly confidential"
              />

              {/* Privacy Notice */}
              <div className="bg-[var(--muted)] rounded-lg p-4 border border-[var(--border)]">
                <h4 className="font-semibold text-[var(--foreground)] mb-2 flex items-center">
                  <span className="mr-2">🔒</span>
                  Privacy Notice
                </h4>
                <p className="text-sm text-[var(--muted-foreground)] mb-2">
                  Your request will be reviewed by our admin team only. Your identity will never be 
                  shared with donors or made public. We process requests with complete discretion 
                  and respect.
                </p>
              </div>

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
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/app/vouchers')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Support Info */}
        <Card className="mt-8 bg-gradient-to-br from-[var(--accent)]/5 to-white border-[var(--accent)]/20">
          <CardContent className="py-6">
            <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center">
              <span className="mr-2">💬</span>
              Need Help with Your Request?
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-3">
              If you have questions or need assistance filling out this form, please don&apos;t hesitate to reach out.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center text-[var(--muted-foreground)]">
                <span className="mr-2">📧</span>
                support@ecoeats.org
              </div>
              <div className="flex items-center text-[var(--muted-foreground)]">
                <span className="mr-2">📱</span>
                +234 800 123 4567
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
