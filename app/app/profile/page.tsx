'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 800 123 4567',
    affiliation: 'STUDENT',
    location: 'Hostel A, Room 205',
    emergencyContact: '+234 800 765 4321',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const stats = {
    vouchersReceived: 3,
    surplusClaimed: 4,
    totalValue: '₦4,500',
    memberSince: 'January 2026',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <span>👤</span>
            <span>My Profile</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Profile Settings
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8 bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]/20">
          <CardContent className="py-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
                  {formData.fullName.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  {formData.fullName}
                </h2>
                <p className="text-[var(--muted-foreground)] mb-3">{formData.email}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Badge variant="success">Beneficiary</Badge>
                  <Badge variant="info">Verified</Badge>
                  <Badge>Member since {stats.memberSince}</Badge>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex-shrink-0">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} size="lg">
                    ✏️ Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl mb-2">🎫</div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.vouchersReceived}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Vouchers Received</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl mb-2">🍱</div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.surplusClaimed}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Surplus Claimed</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl mb-2">💰</div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{stats.totalValue}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Total Support</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl mb-2">📅</div>
              <p className="text-xl font-bold text-[var(--foreground)]">{stats.memberSince}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Member Since</p>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Select
                label="Affiliation"
                name="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                disabled={!isEditing}
                options={[
                  { value: 'STUDENT', label: 'Student' },
                  { value: 'STAFF', label: 'Staff' },
                  { value: 'COMMUNITY', label: 'Community Member' },
                ]}
              />
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditing}
                helperText="E.g., Hostel A, Room 205 or Community Address"
              />
              <Input
                label="Emergency Contact"
                name="emergencyContact"
                type="tel"
                value={formData.emergencyContact}
                onChange={handleChange}
                disabled={!isEditing}
                helperText="Optional but recommended"
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <div>
                <h4 className="font-semibold text-[var(--foreground)]">Email Notifications</h4>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Receive updates about vouchers and surplus food
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
              <div>
                <h4 className="font-semibold text-[var(--foreground)]">SMS Notifications</h4>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Get text alerts for time-sensitive updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-semibold text-[var(--foreground)]">Change Password</h4>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Update your password to keep your account secure
                </p>
              </div>
              <Button variant="outline">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-gradient-to-br from-[var(--muted)] to-white">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[var(--foreground)]">Download Your Data</h4>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Get a copy of all your activity and personal information
                </p>
              </div>
              <Button variant="outline">
                📥 Download
              </Button>
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[var(--destructive)]">Delete Account</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Permanently remove your account and all data
                  </p>
                </div>
                <Button variant="outline" className="text-[var(--destructive)] border-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-white">
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
