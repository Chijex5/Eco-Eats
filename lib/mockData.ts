// Mock data for demo purposes
// In Phase B (Full Stack), this will be replaced with real database data

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
  partnerLogo?: string;
  title: string;
  description: string;
  quantityAvailable: number;
  quantityClaimed: number;
  claimLimit: number;
  pickupDeadline: string;
  status: 'ACTIVE' | 'CLOSED' | 'EXPIRED';
  location: string;
  createdAt: string;
}

export interface SupportRequest {
  id: string;
  requestType: 'VOUCHER' | 'FOOD_PACK';
  message: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'FULFILLED';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface HistoryItem {
  id: string;
  type: 'request' | 'voucher' | 'surplus' | 'redemption';
  title: string;
  description: string;
  date: string;
  status: string;
}

export interface Donation {
  id: string;
  amountKobo: number;
  donationType: 'ONE_TIME' | 'MONTHLY' | 'MEAL_VOUCHER';
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paymentRef: string;
  createdAt: string;
  mealCount?: number;
}

export interface ImpactMetrics {
  totalDonated: number;
  mealsFunded: number;
  mealsServed: number;
  peopleHelped: number;
  partnersSupported: number;
}

// Mock Vouchers
export const mockVouchers: Voucher[] = [
  {
    id: '1',
    code: 'EAT-7H3K2',
    qrToken: 'QR-7H3K2-ABCD1234',
    valueKobo: 150000, // ₦1,500
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    code: 'EAT-9M2P5',
    qrToken: 'QR-9M2P5-EFGH5678',
    valueKobo: 100000, // ₦1,000
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    code: 'EAT-X4R8T',
    qrToken: 'QR-X4R8T-IJKL9012',
    valueKobo: 200000, // ₦2,000
    status: 'REDEEMED',
    expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    redeemedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    partnerName: 'Campus Cafeteria',
  },
];

// Mock Surplus Listings
export const mockSurplusListings: SurplusListing[] = [
  {
    id: '1',
    partnerId: 'p1',
    partnerName: 'Campus Cafeteria',
    partnerLogo: '🍽️',
    title: 'Fresh Rice & Stew (10 Packs)',
    description: 'Freshly prepared rice and stew from today\'s lunch service. Must be picked up before 6 PM.',
    quantityAvailable: 10,
    quantityClaimed: 3,
    claimLimit: 1,
    pickupDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    location: 'Main Campus, Building A',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    partnerId: 'p2',
    partnerName: 'Green Kitchen',
    partnerLogo: '🥗',
    title: 'Vegetable Salad Bowls (8 Packs)',
    description: 'Healthy vegetable salad bowls with dressing. Perfect for a nutritious meal.',
    quantityAvailable: 8,
    quantityClaimed: 5,
    claimLimit: 1,
    pickupDeadline: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    location: 'Downtown Plaza',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    partnerId: 'p3',
    partnerName: 'Bakery Corner',
    partnerLogo: '🍞',
    title: 'Fresh Bread & Pastries (15 Packs)',
    description: 'Assorted bread and pastries from today\'s batch. Great for breakfast or snacks.',
    quantityAvailable: 15,
    quantityClaimed: 8,
    claimLimit: 2,
    pickupDeadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    location: 'Market Street',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// Mock Support Requests
export const mockSupportRequests: SupportRequest[] = [
  {
    id: '1',
    requestType: 'VOUCHER',
    message: 'Need food support for this week. Financial difficulty due to delayed allowance.',
    urgency: 'HIGH',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: 'Admin Team',
  },
  {
    id: '2',
    requestType: 'FOOD_PACK',
    message: 'Requesting food pack for family emergency.',
    urgency: 'MEDIUM',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock History
export const mockHistory: HistoryItem[] = [
  {
    id: '1',
    type: 'redemption',
    title: 'Voucher Redeemed',
    description: 'Used voucher EAT-X4R8T at Campus Cafeteria for ₦2,000',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'COMPLETED',
  },
  {
    id: '2',
    type: 'voucher',
    title: 'Voucher Received',
    description: 'Received voucher EAT-7H3K2 worth ₦1,500',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
  },
  {
    id: '3',
    type: 'request',
    title: 'Support Request Approved',
    description: 'Your request for meal voucher was approved',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'APPROVED',
  },
  {
    id: '4',
    type: 'surplus',
    title: 'Claimed Surplus Food',
    description: 'Claimed fresh bread pack from Bakery Corner',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PICKED_UP',
  },
];

// Mock Donations
export const mockDonations: Donation[] = [
  {
    id: '1',
    amountKobo: 500000, // ₦5,000
    donationType: 'MEAL_VOUCHER',
    status: 'COMPLETED',
    paymentRef: 'PAY-ABC123',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    mealCount: 5,
  },
  {
    id: '2',
    amountKobo: 1000000, // ₦10,000
    donationType: 'ONE_TIME',
    status: 'COMPLETED',
    paymentRef: 'PAY-DEF456',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    mealCount: 10,
  },
  {
    id: '3',
    amountKobo: 300000, // ₦3,000
    donationType: 'MONTHLY',
    status: 'COMPLETED',
    paymentRef: 'PAY-GHI789',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    mealCount: 3,
  },
];

// Mock Impact Metrics
export const mockImpactMetrics: ImpactMetrics = {
  totalDonated: 180000000, // ₦18,000
  mealsFunded: 18,
  mealsServed: 15,
  peopleHelped: 12,
  partnersSupported: 3,
};

// Utility function to format currency
export const formatCurrency = (kobo: number): string => {
  return `₦${(kobo / 100).toLocaleString('en-NG')}`;
};

// Utility function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  
  return date.toLocaleDateString('en-NG', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Utility function to format relative time for deadlines
export const formatDeadline = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diff < 0) return 'Expired';
  if (hours === 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} left`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} left`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} left`;
};
