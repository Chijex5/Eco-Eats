'use client';

import { useState } from 'react';
import { Store, Check, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function PartnersApprovalPage() {
  const [partners, setPartners] = useState([
    {
      id: '1',
      name: 'Downtown Diner',
      contact: 'Mike Johnson',
      email: 'mike@downtowndiner.com',
      location: 'Downtown Plaza, Main Street',
      capacity: 30,
      status: 'PENDING',
    },
    {
      id: '2',
      name: 'Green Kitchen',
      contact: 'Emma Green',
      email: 'emma@greenkitchen.com',
      location: 'Market Street, Building 5',
      capacity: 40,
      status: 'PENDING',
    },
  ]);

  const handleApprove = (id: string) => {
    setPartners(partners.map(p => p.id === id ? { ...p, status: 'APPROVED' } : p));
  };

  const handleDeny = (id: string) => {
    setPartners(partners.map(p => p.id === id ? { ...p, status: 'DENIED' } : p));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--secondary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Store className="w-4 h-4" />
            <span>Partner Applications</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Review Partner Applications
          </h1>
        </div>

        <div className="space-y-6">
          {partners.filter(p => p.status === 'PENDING').map((partner) => (
            <Card key={partner.id}>
              <CardContent className="py-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">{partner.name}</h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-[var(--muted-foreground)]">Contact: {partner.contact}</p>
                      <p className="text-[var(--muted-foreground)]">Email: {partner.email}</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{partner.location}</span>
                      </div>
                      <p>Daily Capacity: {partner.capacity} vouchers</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button size="lg" onClick={() => handleApprove(partner.id)}>
                    <Check className="w-4 h-4 mr-2" />
                    Approve Partner
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => handleDeny(partner.id)}>
                    <X className="w-4 h-4 mr-2" />
                    Deny
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
