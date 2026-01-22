// Mock data for Phase A prototype demonstration

export interface Voucher {
  id: string;
  code: string;
  qrToken: string;
  valueKobo: number;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'REVOKED';
  expiresAt: string;
  createdAt: string;
  redeemedAt?: string;
  partnerName?: string;
}

export interface SurplusListing {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerLocation: string;
  title: string;
  description: string;
  quantityAvailable: number;
  quantityClaimed: number;
  claimLimitPerUser: number;
  pickupDeadline: string;
  status: 'ACTIVE' | 'CLAIMED' | 'EXPIRED';
  createdAt: string;
}

export interface SupportRequest {
  id: string;
  requestType: 'VOUCHER' | 'FOOD_PACK';
  message: string;
  urgency: 'LOW' | 'MED' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'FULFILLED';
  createdAt: string;
  reviewedAt?: string;
}

export interface Donation {
  id: string;
  amountKobo: number;
  currency: string;
  donationType: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
  mealsSponsored: number;
}

export interface ActivityItem {
  id: string;
  type: 'voucher_received' | 'voucher_redeemed' | 'surplus_claimed' | 'request_submitted' | 'request_approved';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

// Mock Vouchers
export const mockVouchers: Voucher[] = [
  {
    id: '1',
    code: 'EAT-7H3K2',
    qrToken: 'voucher_qr_token_1',
    valueKobo: 150000, // ₦1,500
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    code: 'EAT-9M4P7',
    qrToken: 'voucher_qr_token_2',
    valueKobo: 200000, // ₦2,000
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    code: 'EAT-2X6N8',
    qrToken: 'voucher_qr_token_3',
    valueKobo: 150000,
    status: 'REDEEMED',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    redeemedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    partnerName: 'Campus Cafeteria',
  },
];

// Mock Surplus Listings
export const mockSurplusListings: SurplusListing[] = [
  {
    id: '1',
    partnerId: 'partner_1',
    partnerName: 'Campus Cafeteria',
    partnerLocation: 'Main Campus Building',
    title: 'Fresh Lunch Packs Available',
    description: 'Nutritious rice and chicken meals ready for pickup. Must collect before 6 PM.',
    quantityAvailable: 15,
    quantityClaimed: 8,
    claimLimitPerUser: 1,
    pickupDeadline: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    partnerId: 'partner_2',
    partnerName: 'Community Kitchen',
    partnerLocation: 'East Side Community Center',
    title: 'Breakfast Food Packs',
    description: 'Bread, eggs, and fruit packs. Perfect for starting your day right.',
    quantityAvailable: 10,
    quantityClaimed: 3,
    claimLimitPerUser: 1,
    pickupDeadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    partnerId: 'partner_3',
    partnerName: 'Green Leaf Restaurant',
    partnerLocation: 'Downtown Area',
    title: 'Vegetarian Meal Boxes',
    description: 'Healthy vegetarian meals with salad, pasta, and dessert. Pickup by 7 PM.',
    quantityAvailable: 8,
    quantityClaimed: 8,
    claimLimitPerUser: 1,
    pickupDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    status: 'CLAIMED',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Support Requests
export const mockSupportRequests: SupportRequest[] = [
  {
    id: '1',
    requestType: 'VOUCHER',
    message: 'Need help with meals for this week. Currently facing financial difficulties.',
    urgency: 'HIGH',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    requestType: 'FOOD_PACK',
    message: 'Requesting food support for my family.',
    urgency: 'MED',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Donations
export const mockDonations: Donation[] = [
  {
    id: '1',
    amountKobo: 1000000, // ₦10,000
    currency: 'NGN',
    donationType: 'MEAL_VOUCHERS',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    mealsSponsored: 6,
  },
  {
    id: '2',
    amountKobo: 500000, // ₦5,000
    currency: 'NGN',
    donationType: 'MEAL_VOUCHERS',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    mealsSponsored: 3,
  },
  {
    id: '3',
    amountKobo: 2000000, // ₦20,000
    currency: 'NGN',
    donationType: 'GENERAL_FUND',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    mealsSponsored: 12,
  },
];

// Mock Activity History
export const mockActivityHistory: ActivityItem[] = [
  {
    id: '1',
    type: 'voucher_received',
    title: 'Voucher Received',
    description: 'You received a ₦1,500 meal voucher',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: '2',
    type: 'voucher_redeemed',
    title: 'Voucher Redeemed',
    description: 'Redeemed at Campus Cafeteria',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '3',
    type: 'surplus_claimed',
    title: 'Surplus Food Claimed',
    description: 'Claimed lunch pack from Community Kitchen',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '4',
    type: 'request_approved',
    title: 'Request Approved',
    description: 'Your support request has been approved',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: '5',
    type: 'request_submitted',
    title: 'Request Submitted',
    description: 'Support request submitted for review',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
];

// Helper functions
export const formatCurrency = (kobo: number): string => {
  return `₦${(kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-NG', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(dateString);
};

export const getExpiryStatus = (expiryDate: string): { label: string; className: string } => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMs < 0) {
    return { label: 'Expired', className: 'text-[var(--destructive)]' };
  }
  if (diffDays === 0) {
    return { label: 'Expires today', className: 'text-[var(--secondary)]' };
  }
  if (diffDays < 3) {
    return { label: `Expires in ${diffDays} day${diffDays > 1 ? 's' : ''}`, className: 'text-[var(--secondary)]' };
  }
  return { label: `Expires in ${diffDays} days`, className: 'text-[var(--muted-foreground)]' };
};
