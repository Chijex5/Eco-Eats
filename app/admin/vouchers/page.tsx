'use client';

import { useState } from 'react';
import { Ticket, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function VoucherIssuancePage() {
  const [formData, setFormData] = useState({
    beneficiary: '',
    amount: '1500',
    expiryDays: '7',
  });

  const [issued, setIssued] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIssued(true);
    setTimeout(() => {
      setIssued(false);
      setFormData({ beneficiary: '', amount: '1500', expiryDays: '7' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-[var(--accent)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Ticket className="w-4 h-4" />
            <span>Issue Vouchers</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Create Meal Vouchers
          </h1>
        </div>

        {issued && (
          <Card className="mb-6 bg-gradient-to-br from-[var(--primary)]/5 to-white border-2 border-[var(--primary)]">
            <CardContent className="py-4 text-center">
              <p className="font-semibold text-[var(--primary)]">✓ Voucher issued successfully!</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Voucher Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Select
                label="Select Beneficiary"
                value={formData.beneficiary}
                onChange={(e) => setFormData({...formData, beneficiary: e.target.value})}
                options={[
                  { value: '', label: 'Choose beneficiary...' },
                  { value: '1', label: 'Sarah Martinez - APPROVED' },
                  { value: '2', label: 'John Doe - APPROVED' },
                ]}
                required
              />

              <Select
                label="Voucher Value"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                options={[
                  { value: '1000', label: '₦1,000' },
                  { value: '1500', label: '₦1,500' },
                  { value: '2000', label: '₦2,000' },
                ]}
              />

              <Select
                label="Validity Period"
                value={formData.expiryDays}
                onChange={(e) => setFormData({...formData, expiryDays: e.target.value})}
                options={[
                  { value: '7', label: '7 days' },
                  { value: '14', label: '14 days' },
                  { value: '30', label: '30 days' },
                ]}
              />

              <Button type="submit" size="lg" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Issue Voucher
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
