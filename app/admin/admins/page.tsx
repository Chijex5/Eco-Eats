'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type UserRole = 'BENEFICIARY' | 'DONOR' | 'PARTNER_OWNER' | 'PARTNER_STAFF' | 'VOLUNTEER' | 'ADMIN';

type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  role: 'ADMIN';
  is_email_verified?: boolean;
  created_at: string;
};

type PlatformUser = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_email_verified?: boolean;
  created_at: string;
};

type RoleCount = {
  role: UserRole;
  total: number;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently added';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatRole = (role: UserRole) => role.replaceAll('_', ' ');

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [allUsers, setAllUsers] = useState<PlatformUser[]>([]);
  const [countsByRole, setCountsByRole] = useState<RoleCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });

  const loadAdmins = useCallback(async () => {
    const response = await fetch('/api/admin/admins');
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'Unable to load admins.');
    }
    const data = (await response.json()) as { admins: AdminUser[] };
    setAdmins(data.admins || []);
  }, []);

  const loadUserInsights = useCallback(async () => {
    const response = await fetch('/api/admin/users');
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'Unable to load user insights.');
    }
    const data = (await response.json()) as { users: PlatformUser[]; countsByRole: RoleCount[] };
    setAllUsers(data.users || []);
    setCountsByRole(data.countsByRole || []);
  }, []);

  const loadPageData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      await Promise.all([loadAdmins(), loadUserInsights()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin data.');
    } finally {
      setIsLoading(false);
    }
  }, [loadAdmins, loadUserInsights]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to create admin user.');
      }

      setSuccess('Admin account created successfully.');
      setForm({ full_name: '', email: '', password: '' });
      await loadPageData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create admin user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">Admin users</p>
            <h1 className="text-3xl sm:text-4xl text-[var(--foreground)]">Manage admins and signups.</h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
              Create accounts for trusted team members and track how many users have signed up by role.
            </p>
          </section>

          <Card className="shadow-[var(--shadow)]">
            <CardHeader>
              <CardTitle>Signup overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[var(--muted-foreground)]">Total signups: {allUsers.length}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {countsByRole.map((entry) => (
                  <div key={entry.role} className="rounded-2xl border border-[var(--border)] px-4 py-3 bg-[var(--surface)]">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{formatRole(entry.role)}</p>
                    <p className="text-2xl font-semibold text-[var(--foreground)]">{entry.total}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow)]">
            <CardHeader>
              <CardTitle>Recent signups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <p className="text-sm text-[var(--muted-foreground)]">Loading users...</p>
              ) : allUsers.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">No signup records yet.</p>
              ) : (
                allUsers.slice(0, 20).map((user) => (
                  <div key={user.id} className="rounded-2xl border border-[var(--border)] px-4 py-3">
                    <p className="font-semibold text-[var(--foreground)]">{user.full_name}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      {formatRole(user.role)} · Added {formatDate(user.created_at)}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow)]">
            <CardHeader>
              <CardTitle>Create admin account</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="full_name" className="text-sm font-medium text-[var(--foreground)]">Full name</label>
                  <input
                    id="full_name"
                    value={form.full_name}
                    onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
                    placeholder="Ada Johnson"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[var(--foreground)]">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
                    placeholder="admin@ecoeats.org"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-[var(--foreground)]">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                  />
                </div>

                {error ? <p className="text-sm text-rose-600">{error}</p> : null}
                {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating admin...' : 'Add admin'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow)]">
            <CardHeader>
              <CardTitle>Current admins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <p className="text-sm text-[var(--muted-foreground)]">Loading admins...</p>
              ) : admins.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">No admin users found yet.</p>
              ) : (
                admins.map((admin) => (
                  <div key={admin.id} className="rounded-2xl border border-[var(--border)] px-4 py-3">
                    <p className="font-semibold text-[var(--foreground)]">{admin.full_name}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{admin.email}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">Added {formatDate(admin.created_at)}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
