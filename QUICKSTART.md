# EcoEats Quick Start Guide
**For: New developers joining the project**  
**Updated: February 8, 2026**

---

## 🚀 Getting Started (5 minutes)

### 1. Clone and Install
```bash
git clone https://github.com/Chijex5/Eco-Eats.git
cd Eco-Eats
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

Required environment variables:
```
DATABASE_URL=mysql://user:password@localhost:3306/ecoeats_db
NEXTAUTH_SECRET=your-secret-here
AUTH_SECRET=your-secret-here
```

### 3. Create Database
```bash
# Using MySQL CLI
mysql -u root -p
CREATE DATABASE ecoeats_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Run Setup
```bash
npm run dev
# Visit http://localhost:3000/api/setup to create tables
```

### 5. Verify Setup
```bash
# Visit http://localhost:3000/api/health
# Should return: {"status":"ok"}
```

---

## 📂 Project Structure

```
Eco-Eats/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Auth endpoints (✅ DONE)
│   │   │   ├── register/         # User registration
│   │   │   ├── login/           # User login
│   │   │   ├── logout/          # User logout
│   │   │   └── session/         # Session check
│   │   ├── requests/            # ❌ TODO: Support requests
│   │   ├── vouchers/            # ❌ TODO: Voucher management
│   │   ├── donations/           # ❌ TODO: Donations
│   │   ├── admin/               # ❌ TODO: Admin operations
│   │   └── redeem/              # ❌ TODO: Redemptions
│   ├── (public pages)/
│   │   ├── page.tsx             # ✅ Landing page
│   │   ├── how-it-works/        # ✅ How it works
│   │   ├── learn/               # ✅ Education hub
│   │   ├── spotlight/           # ✅ Community heroes
│   │   ├── donate/              # ✅ Donor info
│   │   ├── partners/join/       # ✅ Partner signup
│   │   └── contact/             # ✅ Contact form
│   ├── auth/                    # ✅ Auth pages
│   ├── app/                     # Beneficiary dashboard (🚧 PARTIAL)
│   ├── donor/                   # Donor dashboard (🚧 PARTIAL)
│   ├── partner/                 # Partner dashboard (❌ TODO)
│   └── admin/                   # Admin dashboard (❌ TODO)
├── components/                   # Reusable React components
├── lib/                         # Utilities and database
│   ├── auth/                    # Auth helpers (✅ DONE)
│   └── db/                      # Database utilities (✅ DONE)
│       ├── connection.ts        # MySQL connection
│       ├── schema.ts            # Table creation
│       ├── users.ts             # User queries
│       ├── requests.ts          # Request queries
│       └── vouchers.ts          # Voucher queries
├── data/                        # Static data
├── public/                      # Static assets
├── middleware.ts                # Route protection (✅ DONE)
├── progress.md                  # Original progress tracker
└── STATUS.md                    # Current status (NEW)
```

---

## 🎨 Key Technologies

| Technology | Purpose | Documentation |
|-----------|---------|---------------|
| **Next.js 16** | Full-stack framework | [docs](https://nextjs.org/docs) |
| **TypeScript** | Type safety | [docs](https://www.typescriptlang.org/) |
| **Tailwind CSS v4** | Styling | [docs](https://tailwindcss.com/docs) |
| **MySQL** | Database | [docs](https://dev.mysql.com/doc/) |
| **mysql2** | Database driver | [npm](https://www.npmjs.com/package/mysql2) |
| **bcryptjs** | Password hashing | [npm](https://www.npmjs.com/package/bcryptjs) |
| **jose** | JWT tokens | [npm](https://www.npmjs.com/package/jose) |

---

## 🗄️ Database Schema Overview

### Users & Roles
- `users` - All user accounts (5 role types)
- `beneficiary_profiles` - Additional beneficiary info

### Food System
- `food_partners` - Partner locations (cafeterias, restaurants)
- `partner_staff` - Staff who can redeem vouchers
- `surplus_listings` - Available surplus food

### Support Flow
- `support_requests` - Beneficiary help requests
- `vouchers` - Meal vouchers (with QR codes)
- `voucher_redemptions` - Proof of meal delivery
- `surplus_claims` - Surplus food pickups

### Funding & Analytics
- `donations` - Donor contributions
- `impact_events` - Analytics event log

---

## 🔑 User Roles & Permissions

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **BENEFICIARY** | Request help, view own vouchers, claim surplus | See others' data, approve requests |
| **DONOR** | Fund vouchers, view aggregate impact | See beneficiary identities |
| **PARTNER_OWNER** | Add staff, post surplus, view redemptions | Approve requests |
| **PARTNER_STAFF** | Redeem vouchers, confirm pickups | Post surplus |
| **ADMIN** | Approve requests, issue vouchers, see all data | (full access) |

---

## 🛠️ Development Workflow

### Building a New Feature (Example: Support Requests API)

#### Step 1: Create Database Query Helper
```typescript
// lib/db/requests.ts
export async function createRequest(data: CreateRequestData) {
  const id = generateId();
  await query(
    `INSERT INTO support_requests (id, beneficiary_user_id, request_type, message, urgency, status)
     VALUES (?, ?, ?, ?, ?, 'PENDING')`,
    [id, data.userId, data.requestType, data.message, data.urgency]
  );
  return id;
}
```

#### Step 2: Create API Route
```typescript
// app/api/requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createRequest } from '@/lib/db/requests';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'BENEFICIARY') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const requestId = await createRequest({
    userId: session.userId,
    ...body
  });

  return NextResponse.json({ id: requestId });
}
```

#### Step 3: Create Frontend Component
```typescript
// app/app/request-help/page.tsx
'use client';
import { useState } from 'react';

export default function RequestHelpPage() {
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        requestType: 'VOUCHER',
        message,
        urgency: 'MEDIUM'
      })
    });
    // Handle response...
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe your situation..."
      />
      <button type="submit">Submit Request</button>
    </form>
  );
}
```

#### Step 4: Test the Flow
```bash
# 1. Start dev server
npm run dev

# 2. Register as beneficiary
# Visit http://localhost:3000/auth/signup

# 3. Login
# Visit http://localhost:3000/auth/login

# 4. Submit request
# Visit http://localhost:3000/app/request-help

# 5. Check database
mysql -u root -p ecoeats_db
SELECT * FROM support_requests;
```

---

## 🧪 Testing Your Work

### Manual Testing Checklist

**Before committing code, test:**

1. **API Route**
   - [ ] Returns correct status codes (200, 401, 404, 500)
   - [ ] Validates input data
   - [ ] Handles missing/invalid tokens
   - [ ] Creates correct database records

2. **Frontend**
   - [ ] Form validation works
   - [ ] Loading states show
   - [ ] Success/error messages display
   - [ ] Page redirects correctly

3. **Database**
   - [ ] Records created with correct values
   - [ ] Foreign keys valid
   - [ ] Timestamps set automatically
   - [ ] No duplicate entries

### Testing with cURL

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123","role":"BENEFICIARY"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Create request (with auth cookie)
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"requestType":"VOUCHER","message":"Need help","urgency":"MEDIUM"}'
```

---

## 🔍 Debugging Tips

### Common Issues

**1. Database Connection Failed**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u root -p -e "SELECT 1"

# Check .env file has correct credentials
cat .env | grep DATABASE_URL
```

**2. Auth Token Issues**
```bash
# Check cookies in browser DevTools
# Application > Cookies > localhost:3000

# Verify token signature
# lib/auth/session.ts - check AUTH_SECRET matches .env
```

**3. CORS Errors**
```bash
# Next.js API routes don't need CORS for same-origin
# If using external frontend, add CORS headers in route.ts
```

**4. Database Table Not Found**
```bash
# Re-run setup
curl http://localhost:3000/api/setup

# Or manually via MySQL
mysql -u root -p ecoeats_db < schema.sql
```

---

## 📝 Code Style Guide

### TypeScript
```typescript
// ✅ Good
interface CreateRequestData {
  userId: string;
  requestType: 'VOUCHER' | 'FOOD_PACK';
  message: string;
  urgency: 'LOW' | 'MED' | 'HIGH';
}

// ❌ Bad
function createRequest(data: any) { ... }
```

### API Routes
```typescript
// ✅ Good
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // ... handle request
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// ❌ Bad
export async function POST(req: NextRequest) {
  const data = await req.json();
  query(`INSERT INTO ...`); // No error handling!
  return NextResponse.json({ ok: true });
}
```

### Database Queries
```typescript
// ✅ Good - Use parameterized queries
await query(
  'SELECT * FROM users WHERE email = ?',
  [email]
);

// ❌ Bad - SQL injection risk!
await query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## 🎯 Priority Work Items

### P0 - Critical (Must complete for MVP)
1. ❌ POST `/api/requests` - Create support request
2. ❌ GET `/api/admin/requests` - List pending requests
3. ❌ PATCH `/api/admin/requests/:id` - Approve/decline
4. ❌ POST `/api/admin/vouchers/issue` - Issue voucher
5. ❌ GET `/api/vouchers/me` - Get user's vouchers
6. ❌ Implement QR code generation
7. ❌ POST `/api/redeem/voucher` - Redeem voucher

### P1 - High (Important for demo)
8. ❌ Impact event logging
9. ❌ GET `/api/admin/impact` - Analytics data
10. ❌ Surplus listing/claiming
11. ❌ Create demo accounts

### P2 - Medium (Nice to have)
12. ⭐ Donor donation flow
13. ⭐ Email notifications
14. ⭐ Advanced analytics

---

## 🚦 When You're Stuck

### Resources

1. **Technical Questions**
   - Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
   - MySQL Queries: https://dev.mysql.com/doc/
   - TypeScript: https://www.typescriptlang.org/docs/

2. **Project-Specific Questions**
   - Read PRD.md for requirements
   - Check STATUS.md for current state
   - Look at existing code (e.g., auth routes) for patterns

3. **Ask for Help**
   - Review existing similar code first
   - Describe what you tried
   - Share error messages
   - Include relevant code snippets

### Debugging Workflow

```
1. Reproduce the issue consistently
2. Check browser console for errors
3. Check server terminal for API errors
4. Check database for data issues
5. Add console.log() statements
6. Use Chrome DevTools debugger
7. Simplify to minimal test case
8. Ask for help with context
```

---

## 📚 Learning Path

### If you're new to:

**Next.js App Router**
- Tutorial: https://nextjs.org/learn
- Time: 2-3 hours

**TypeScript**
- Tutorial: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- Time: 1 hour

**MySQL**
- Tutorial: https://www.mysqltutorial.org/
- Time: 2 hours

**React Hooks**
- Tutorial: https://react.dev/learn
- Time: 3-4 hours

---

## ✅ Ready to Start?

### Your First Task (2 hours)

**Goal: Build the beneficiary request creation flow**

1. [ ] Read the PRD.md section on support requests
2. [ ] Study the existing auth API routes
3. [ ] Create `/api/requests/route.ts` with POST handler
4. [ ] Add request creation logic to `lib/db/requests.ts`
5. [ ] Wire up the frontend form in `/app/app/request-help/page.tsx`
6. [ ] Test with a beneficiary account
7. [ ] Verify record in database
8. [ ] Commit your changes

**Success Criteria:**
- Beneficiary can fill out request form
- Form submits to API
- API validates and creates database record
- User sees success message
- Database has new record with correct data

---

**Good luck! 🚀 Remember: Small, working iterations beat big incomplete features.**
