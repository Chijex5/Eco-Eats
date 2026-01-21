'use client';

import { useState } from 'react';
import { Settings, Store, MapPin, Clock, Phone, Mail, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function PartnerSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    businessName: 'Campus Cafeteria',
    contactName: 'John Smith',
    email: 'contact@campuscafeteria.edu',
    phone: '+234 800 123 4567',
    address: 'Main Campus, Building A, University Drive',
    description: 'A university cafeteria serving fresh meals daily to students and staff.',
    operatingHours: '8:00 AM - 6:00 PM',
    capacity: '50',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSaving(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--accent)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Settings className="w-4 h-4" />
            <span>Partner Settings</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Manage Your Profile
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Keep your business information up to date so beneficiaries can find you easily.
          </p>
        </div>

        {/* Success Message */}
        {saved && (
          <Card className="mb-6 bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--primary)] text-white rounded-full flex items-center justify-center">
                  <Save className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Settings saved successfully!</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Your changes have been updated.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="w-5 h-5 mr-2 text-[var(--primary)]" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g., Campus Cafeteria"
                helperText="The name of your food business or restaurant"
                required
              />

              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell beneficiaries about your business..."
                helperText="A brief description of what you offer"
                required
              />

              <Input
                label="Daily Capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 50"
                helperText="How many vouchers can you typically redeem per day?"
              />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-[var(--secondary)]" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Contact Person"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="e.g., John Smith"
                helperText="Main contact person for this account"
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@example.com"
                helperText="We'll use this for important notifications"
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234 800 123 4567"
                helperText="Beneficiaries may call for directions or pickup questions"
                required
              />
            </CardContent>
          </Card>

          {/* Location & Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[var(--accent)]" />
                Location & Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                label="Physical Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address with landmarks..."
                helperText="Provide clear directions so beneficiaries can find you"
                required
              />

              <Input
                label="Operating Hours"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleChange}
                placeholder="e.g., 8:00 AM - 6:00 PM"
                helperText="When can beneficiaries come to redeem vouchers?"
                required
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Account Status */}
        <Card className="mt-8 bg-gradient-to-br from-[var(--primary)]/5 to-white border-[var(--primary)]/20">
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
              <span className="text-[var(--muted-foreground)]">Verification Status:</span>
              <span className="font-semibold text-[var(--primary)]">✓ Verified</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
              <span className="text-[var(--muted-foreground)]">Partner Since:</span>
              <span className="font-semibold text-[var(--foreground)]">January 2026</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[var(--muted-foreground)]">Partner ID:</span>
              <span className="font-mono text-sm font-semibold">PTR-2026-001</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
