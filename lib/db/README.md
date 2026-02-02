# Database Layer Documentation

This directory contains all database-related code for the EcoEats application.

## Structure

```
lib/db/
├── index.ts          # Central export point for all database operations
├── connection.ts     # MySQL connection pool management
├── schema.ts         # Database table creation and migrations
├── users.ts          # User-related queries
├── requests.ts       # Support request queries
├── vouchers.ts       # Voucher and redemption queries
└── README.md         # This file
```

## Usage

### 1. Set up environment variables

Copy `.env.example` to `.env.local` and configure your MySQL connection:

```bash
DATABASE_URL=mysql://username:password@localhost:3306/ecoeats_db
```

### 2. Initialize database tables

Call the setup API endpoint:

```bash
curl -X POST http://localhost:3000/api/setup
```

Or import and use directly:

```typescript
import { createTables } from '@/lib/db';
await createTables();
```

### 3. Use query functions

```typescript
import { createUser, findUserByEmail } from '@/lib/db';

// Create a user
const user = await createUser({
  full_name: 'John Doe',
  email: 'john@example.com',
  password_hash: 'hashed_password',
  role: 'BENEFICIARY'
});

// Find a user
const foundUser = await findUserByEmail('john@example.com');
```

## Available Query Modules

### users.ts
- `createUser()` - Create a new user
- `findUserByEmail()` - Find user by email
- `findUserById()` - Find user by ID
- `verifyUserEmail()` - Mark email as verified
- `updateUser()` - Update user profile

### requests.ts
- `createSupportRequest()` - Create a support request
- `getRequestsByBeneficiary()` - Get requests for a beneficiary
- `getPendingRequests()` - Get all pending requests (admin)
- `updateRequestStatus()` - Approve/decline a request

### vouchers.ts
- `createVoucher()` - Issue a new voucher
- `getVouchersByBeneficiary()` - Get vouchers for a beneficiary
- `findVoucherByCode()` - Find voucher by code
- `findVoucherByQRToken()` - Find voucher by QR token
- `redeemVoucher()` - Redeem a voucher at a partner

## Database Schema

All 11 tables from PRD.md are defined in `schema.ts`:

1. **users** - All user accounts with role-based access
2. **beneficiary_profiles** - Additional info for beneficiaries
3. **food_partners** - Restaurant/canteen profiles
4. **partner_staff** - Staff members of food partners
5. **support_requests** - Beneficiary requests for help
6. **donations** - Donor contributions
7. **vouchers** - Meal vouchers with QR codes
8. **voucher_redemptions** - Proof of meal delivery
9. **surplus_listings** - Available surplus food
10. **surplus_claims** - Beneficiary claims on surplus
11. **impact_events** - Analytics and impact tracking

## Connection Pool

The database connection uses a singleton pattern with connection pooling:

- Maximum 20 connections
- Waits for available connections
- Automatic SSL for production

## Best Practices

1. **Always use parameterized queries** - All query functions use `?` placeholders
2. **Use transactions for multi-step operations** - See `redeemVoucher()` example
3. **Close connections in tests** - Call `closePool()` after tests
4. **Log queries in development** - Enabled automatically via `NODE_ENV`

## API Routes

Backend API routes are in `app/api/`:

- `/api/health` - Database health check
- `/api/setup` - Initialize database tables
- More routes will be added for auth, requests, vouchers, etc.
