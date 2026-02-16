'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type PartnerProfile = {
  id: string;
  name: string;
  description?: string | null;
  location_text?: string | null;
  status: string;
};

type StaffMember = {
  id: string;
  full_name: string;
  email: string;
  staff_role?: string | null;
  can_redeem: number;
  can_post_surplus: number;
};

export default function PartnerSettingsPage() {
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');

  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [staffRole, setStaffRole] = useState('Counter staff');
  const [canPostSurplus, setCanPostSurplus] = useState(false);
  const [staffSaveState, setStaffSaveState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [staffSaveMessage, setStaffSaveMessage] = useState('');

  useEffect(() => {
    const loadPartner = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/partners');
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Unable to load partner profile.');
        }
        const data = await response.json();
        setPartner(data.partner);
        setStaff(data.staff || []);
        setName(data.partner.name || '');
        setDescription(data.partner.description || '');
        setLocationText(data.partner.location_text || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load partner profile.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPartner();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!partner) {
      return;
    }
    setSaveState('saving');
    setSaveError('');

    try {
      const response = await fetch(`/api/partners/${partner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          locationText,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to update partner profile.');
      }

      const data = await response.json();
      setPartner(data.partner);
      setSaveState('success');
    } catch (err) {
      setSaveState('error');
      setSaveError(err instanceof Error ? err.message : 'Unable to update partner profile.');
    }
  };

  const handleAddStaff = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStaffSaveState('saving');
    setStaffSaveMessage('');

    try {
      const response = await fetch('/api/partners/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: staffName,
          email: staffEmail,
          temporaryPassword,
          staffRole,
          canPostSurplus,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to create staff member.');
      }

      if (payload?.staff) {
        setStaff((current) => [payload.staff as StaffMember, ...current]);
      }

      setStaffName('');
      setStaffEmail('');
      setTemporaryPassword('');
      setStaffRole('Counter staff');
      setCanPostSurplus(false);
      setStaffSaveState('success');
      setStaffSaveMessage(payload?.message || 'Staff member added successfully.');
    } catch (err) {
      setStaffSaveState('error');
      setStaffSaveMessage(err instanceof Error ? err.message : 'Unable to create staff member.');
    }
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Settings</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Partner profile and access.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Keep your public information accurate and verify who has access to redeem or post surplus packs.
            </p>
          </section>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {isLoading ? <p className="text-sm text-[var(--muted-foreground)]">Loading settings...</p> : null}

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Partner details</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    Partner name
                    <input
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </label>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    Description
                    <textarea
                      rows={3}
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </label>
                  <label className="text-sm text-[var(--muted-foreground)]">
                    Location
                    <input
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                      value={locationText}
                      onChange={(event) => setLocationText(event.target.value)}
                    />
                  </label>

                  {saveState === 'error' ? <p className="text-sm text-rose-600">{saveError}</p> : null}
                  {saveState === 'success' ? (
                    <p className="text-sm text-emerald-600">Partner profile updated.</p>
                  ) : null}

                  <Button type="submit" size="lg" disabled={saveState === 'saving'}>
                    {saveState === 'saving' ? 'Saving...' : 'Save changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardHeader>
                <CardTitle>Staff access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-3 border border-dashed border-[var(--border)] rounded-xl p-4" onSubmit={handleAddStaff}>
                  <p className="text-sm font-semibold text-[var(--foreground)]">Add staff login</p>
                  <label className="text-sm text-[var(--muted-foreground)] block">
                    Staff name
                    <input
                      value={staffName}
                      onChange={(event) => setStaffName(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
                      required
                    />
                  </label>
                  <label className="text-sm text-[var(--muted-foreground)] block">
                    Staff email
                    <input
                      type="email"
                      value={staffEmail}
                      onChange={(event) => setStaffEmail(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
                      required
                    />
                  </label>
                  <label className="text-sm text-[var(--muted-foreground)] block">
                    Temporary password
                    <input
                      type="password"
                      minLength={8}
                      value={temporaryPassword}
                      onChange={(event) => setTemporaryPassword(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
                      required
                    />
                  </label>
                  <label className="text-sm text-[var(--muted-foreground)] block">
                    Staff role
                    <input
                      value={staffRole}
                      onChange={(event) => setStaffRole(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <input
                      type="checkbox"
                      checked={canPostSurplus}
                      onChange={(event) => setCanPostSurplus(event.target.checked)}
                    />
                    Allow this staff member to post surplus listings
                  </label>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Staff must change this temporary password immediately after first login.
                  </p>

                  {staffSaveState === 'error' ? <p className="text-sm text-rose-600">{staffSaveMessage}</p> : null}
                  {staffSaveState === 'success' ? <p className="text-sm text-emerald-600">{staffSaveMessage}</p> : null}

                  <Button type="submit" size="sm" disabled={staffSaveState === 'saving'}>
                    {staffSaveState === 'saving' ? 'Adding staff...' : 'Add staff'}
                  </Button>
                </form>

                {staff.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">No staff members added yet.</p>
                ) : (
                  staff.map((member) => (
                    <div
                      key={member.id}
                      className="border-b border-dashed border-[var(--border)] pb-4 last:border-0 last:pb-0"
                    >
                      <p className="font-semibold text-[var(--foreground)]">{member.full_name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{member.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {member.can_redeem ? (
                          <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">Redeem</span>
                        ) : null}
                        {member.can_post_surplus ? (
                          <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">Surplus</span>
                        ) : null}
                        {member.staff_role ? (
                          <span className="text-xs text-[var(--muted-foreground)]">{member.staff_role}</span>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
