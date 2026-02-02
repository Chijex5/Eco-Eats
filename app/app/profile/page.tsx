'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 XXX XXX XXXX',
    affiliation: 'STUDENT',
    location: 'Hostel A, Room 204',
    verificationStatus: 'VERIFIED',
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] mb-6"
            >
              <span className="mr-2">←</span>
              Back to Home
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] mb-2">
                  My Profile
                </h1>
                <p className="text-[var(--muted-foreground)]">
                  Manage your account information and settings
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form className="space-y-5">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={editedProfile.fullName}
                        onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="affiliation"
                        className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                      >
                        Affiliation
                      </label>
                      <select
                        id="affiliation"
                        value={editedProfile.affiliation}
                        onChange={(e) => setEditedProfile({ ...editedProfile, affiliation: e.target.value })}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="STAFF">Staff</option>
                        <option value="COMMUNITY">Community Member</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2"
                      >
                        Location
                      </label>
                      <input
                        id="location"
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none"
                        placeholder="e.g., Hostel A, Room 204"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={handleSave}
                        size="md"
                        variant="primary"
                        className="flex-1"
                      >
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancel}
                        size="md"
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <dl className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-[var(--border)]">
                      <dt className="text-sm font-medium text-[var(--muted-foreground)]">Full Name</dt>
                      <dd className="text-sm text-[var(--foreground)] font-semibold">{profile.fullName}</dd>
                    </div>
                    <div className="flex justify-between py-3 border-b border-[var(--border)]">
                      <dt className="text-sm font-medium text-[var(--muted-foreground)]">Email</dt>
                      <dd className="text-sm text-[var(--foreground)]">{profile.email}</dd>
                    </div>
                    <div className="flex justify-between py-3 border-b border-[var(--border)]">
                      <dt className="text-sm font-medium text-[var(--muted-foreground)]">Phone</dt>
                      <dd className="text-sm text-[var(--foreground)]">{profile.phone}</dd>
                    </div>
                    <div className="flex justify-between py-3 border-b border-[var(--border)]">
                      <dt className="text-sm font-medium text-[var(--muted-foreground)]">Affiliation</dt>
                      <dd className="text-sm text-[var(--foreground)] capitalize">
                        {profile.affiliation.toLowerCase().replace('_', ' ')}
                      </dd>
                    </div>
                    <div className="flex justify-between py-3">
                      <dt className="text-sm font-medium text-[var(--muted-foreground)]">Location</dt>
                      <dd className="text-sm text-[var(--foreground)]">{profile.location}</dd>
                    </div>
                  </dl>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      {profile.verificationStatus === 'VERIFIED' ? (
                        <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                    <Badge
                      variant={profile.verificationStatus === 'VERIFIED' ? 'success' : 'warning'}
                      className="mb-3"
                    >
                      {profile.verificationStatus}
                    </Badge>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {profile.verificationStatus === 'VERIFIED'
                        ? 'Your account has been verified and you can access all services.'
                        : 'Your account verification is pending review.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full">
                    Change Password
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Two-Factor Auth
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            <Link href="/app/vouchers">
              <Card hover className="h-full">
                <CardContent className="py-5 text-center">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">My Vouchers</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">View wallet</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/history">
              <Card hover className="h-full">
                <CardContent className="py-5 text-center">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">Activity History</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Track actions</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/app/surplus">
              <Card hover className="h-full">
                <CardContent className="py-5 text-center">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">Browse Food</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Surplus listings</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <Card className="bg-[var(--surface-alt)] border-[var(--border)]">
            <CardContent className="py-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-3">Privacy & Data</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Your information is handled with care and dignity. We never share your personal details with donors or partners without your consent.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Privacy Policy
                </Button>
                <Button variant="outline" size="sm">
                  Data Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
