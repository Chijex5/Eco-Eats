'use client';

import { useState } from 'react';
import { Users, Check, X, AlertCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Request {
  id: string;
  beneficiary: string;
  email: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  requestType: string;
  message: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
}

export default function RequestsReviewPage() {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      beneficiary: 'Sarah Martinez',
      email: 'sarah.m@student.edu',
      urgency: 'HIGH',
      requestType: 'URGENT_NEED',
      message: 'I am a student who has not eaten in 2 days. I need immediate food assistance.',
      submittedAt: '2026-01-21T10:30:00',
      status: 'PENDING',
    },
    {
      id: '2',
      beneficiary: 'John Doe',
      email: 'john.d@example.com',
      urgency: 'MEDIUM',
      requestType: 'TEMPORARY_HARDSHIP',
      message: 'Lost my job last week and need support until I find new employment.',
      submittedAt: '2026-01-21T09:15:00',
      status: 'PENDING',
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    setSelectedRequest(null);
  };

  const handleDeny = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'DENIED' } : r));
    setSelectedRequest(null);
  };

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[var(--muted)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 bg-[var(--primary)] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Users className="w-4 h-4" />
            <span>Beneficiary Requests</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Review Help Requests
          </h1>
          <p className="text-lg text-[var(--muted-foreground)]">
            {pendingCount} requests pending your review
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {requests.filter(r => r.status === 'PENDING').map((request) => (
              <Card key={request.id} hover className="border-2 border-transparent hover:border-[var(--primary)]">
                <CardContent className="py-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[var(--foreground)]">{request.beneficiary}</h3>
                        <Badge variant={
                          request.urgency === 'HIGH' ? 'error' :
                          request.urgency === 'MEDIUM' ? 'default' : 'success'
                        }>
                          {request.urgency}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)]">{request.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">Request Type:</span>
                      <span className="font-medium">{request.requestType.replace(/_/g, ' ')}</span>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted-foreground)] mb-1">Message:</p>
                      <p className="text-[var(--foreground)]">{request.message}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleApprove(request.id)}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[var(--destructive)]"
                      onClick={() => handleDeny(request.id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Deny
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {pendingCount === 0 && (
              <Card className="text-center">
                <CardContent className="py-12">
                  <Users className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                    All Caught Up!
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    No pending requests to review at this time.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Review Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                  <p className="text-[var(--muted-foreground)]">
                    Verify beneficiary information before approval
                  </p>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                  <p className="text-[var(--muted-foreground)]">
                    Prioritize high urgency requests
                  </p>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                  <p className="text-[var(--muted-foreground)]">
                    Approved beneficiaries will receive voucher issuance notification
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
