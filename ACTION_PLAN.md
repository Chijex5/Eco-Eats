# EcoEats MVP Development Action Plan
**Dependency-Based Task Breakdown for Parallel Development**

---

## 🎯 Overview

This plan separates all tasks into **Independent** (can be done in parallel) and **Dependent** (require other tasks first) categories to maximize team velocity and enable parallel development across multiple developers/workstreams.

---

## 📋 Task Categories

### Legend
- 🟢 **Independent** - Can start immediately, no dependencies
- 🟡 **Dependent** - Requires completion of other tasks
- ⏱️ **Estimated Time**
- 🔗 **Dependencies** - What must be done first

---

## PHASE 0: Foundation Setup (DO FIRST)

### Task 0.1: Database Seed Script 🟢 INDEPENDENT
**Priority**: P0 - Critical  
**Time**: 2 hours  
**Dependencies**: None  
**Can be done by**: Any developer

**Description**: Create script to populate database with test data for all user roles.

**Deliverables**:
- Script file: `scripts/seed-database.ts` or `scripts/seed.sql`
- Test users for each role (BENEFICIARY, DONOR, PARTNER_OWNER, PARTNER_STAFF, ADMIN)
- Sample data for testing (2-3 of each entity type)

**Why Independent**: Uses existing database schema, no API dependencies.

**Output enables**: All subsequent UI and API testing

---

## PHASE 1: Core APIs (PARALLEL WORKSTREAMS)

### 🔵 WORKSTREAM A: Beneficiary Request System

#### Task A1: Support Request Creation API 🟢 INDEPENDENT
**Priority**: P0 - Critical  
**Time**: 2 hours  
**Dependencies**: None (uses existing DB schema)  
**Can be done by**: Developer A

**Files to create/modify**:
- `app/api/requests/route.ts` (POST handler)
- `lib/db/requests.ts` (already exists, add `createRequest` function)

**Deliverables**:
- POST `/api/requests` endpoint
- Accepts: `{ requestType, message, urgency }`
- Returns: `{ id, status }`
- Validates: user is BENEFICIARY role
- Creates record in `support_requests` table

**Test with**:
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"requestType":"VOUCHER","message":"Need help","urgency":"MEDIUM"}'
```

---

#### Task A2: Support Request Listing API 🟢 INDEPENDENT
**Priority**: P0 - Critical  
**Time**: 1.5 hours  
**Dependencies**: None (can be built in parallel with A1)  
**Can be done by**: Developer B

**Files to create/modify**:
- `app/api/requests/me/route.ts` (GET handler)
- `lib/db/requests.ts` (add `getUserRequests` function)

**Deliverables**:
- GET `/api/requests/me` - Get user's own requests
- Filters by `beneficiary_user_id = session.userId`
- Returns array of requests with status

---

### 🔵 WORKSTREAM B: Admin Approval System

#### Task B1: Admin Request Listing API 🟢 INDEPENDENT
**Priority**: P0 - Critical  
**Time**: 1.5 hours  
**Dependencies**: None  
**Can be done by**: Developer A or B (parallel with A1/A2)

**Files to create/modify**:
- `app/api/admin/requests/route.ts` (GET handler)
- `lib/db/requests.ts` (add `getAdminRequests` function)

**Deliverables**:
- GET `/api/admin/requests?status=PENDING` endpoint
- Requires ADMIN role
- Returns all requests, optionally filtered by status
- Includes beneficiary name (JOIN with users table)

---

#### Task B2: Admin Request Approval API 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 2 hours  
**Dependencies**: B1 (same API route family)  
**Can be done by**: Developer who did B1

**Files to create/modify**:
- `app/api/admin/requests/[id]/route.ts` (PATCH handler)
- `lib/db/requests.ts` (add `updateRequestStatus` function)

**Deliverables**:
- PATCH `/api/admin/requests/:id` endpoint
- Accepts: `{ status: 'APPROVED' | 'DECLINED', adminNotes?: string }`
- Updates request status and `reviewed_by`, `reviewed_at`
- Returns updated request

**Dependencies**: 
- 🔗 B1 (uses same DB helper patterns)

---

### 🔵 WORKSTREAM C: Voucher System

#### Task C1: QR Code Library Integration 🟢 INDEPENDENT
**Priority**: P0 - Critical  
**Time**: 1 hour  
**Dependencies**: None  
**Can be done by**: Any developer (setup task)

**Commands**:
```bash
npm install qrcode.react
npm install --save-dev @types/qrcode.react
```

**Files to create**:
- `components/QRCodeDisplay.tsx` - Reusable QR component
- `components/VoucherCard.tsx` - Voucher display component

**Deliverables**:
- QR code component that accepts `value` prop
- Displays QR code with backup text code below
- Styled for mobile display

**Test standalone**: Create test page to verify QR rendering

---

#### Task C2: Voucher Issuance API 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 3 hours  
**Dependencies**: Need request approval flow (B2)  
**Can be done by**: Developer C

**Files to create/modify**:
- `app/api/admin/vouchers/issue/route.ts` (POST handler)
- `lib/db/vouchers.ts` (already exists, enhance functions)
- `lib/utils/voucher-codes.ts` (generate unique codes)

**Deliverables**:
- POST `/api/admin/vouchers/issue` endpoint
- Accepts: `{ requestId, valueKobo, expiresInDays }`
- Generates unique `code` and `qr_token`
- Creates voucher record
- Updates request status to FULFILLED

**Dependencies**: 
- 🔗 B2 (must be able to approve requests first)
- 🔗 Request must be in APPROVED status

---

#### Task C3: Voucher Retrieval API 🟢 INDEPENDENT
**Priority**: P0 - Critical  
**Time**: 1.5 hours  
**Dependencies**: None (can be built before vouchers exist)  
**Can be done by**: Any developer

**Files to create/modify**:
- `app/api/vouchers/me/route.ts` (GET handler)
- `lib/db/vouchers.ts` (add `getUserVouchers` function)

**Deliverables**:
- GET `/api/vouchers/me` endpoint
- Returns user's vouchers (ACTIVE, REDEEMED, EXPIRED)
- Includes QR token for display
- Filters out revoked vouchers

---

### 🔵 WORKSTREAM D: Partner Redemption System

#### Task D1: Voucher Redemption API 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 3 hours  
**Dependencies**: C2, C3 (vouchers must exist to redeem)  
**Can be done by**: Developer D

**Files to create/modify**:
- `app/api/redeem/voucher/route.ts` (POST handler)
- `lib/db/vouchers.ts` (add redemption functions)
- `lib/db/redemptions.ts` (new file)

**Deliverables**:
- POST `/api/redeem/voucher` endpoint
- Accepts: `{ code: string }` or `{ qrToken: string }`
- Validates: voucher exists, status=ACTIVE, not expired
- Creates `voucher_redemptions` record
- Updates voucher status to REDEEMED
- Returns success with voucher details

**Dependencies**:
- 🔗 C2 (vouchers must be issuable)
- 🔗 C3 (voucher lookup logic)

---

#### Task D2: QR Scanner Component 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 2 hours  
**Dependencies**: C1 (QR library), D1 (redemption API)  
**Can be done by**: Frontend developer

**Files to create**:
- `components/QRScanner.tsx` - Camera-based scanner
- OR use simpler approach: manual code entry only

**Deliverables**:
- Camera access for QR scanning (if time permits)
- Manual code entry input (fallback/primary)
- Calls redemption API on scan/submit
- Shows success/error messages

**Dependencies**:
- 🔗 C1 (QR code library installed)
- 🔗 D1 (redemption endpoint ready)

**Note**: Can start with manual code entry only, add camera later if time.

---

### 🔵 WORKSTREAM E: Impact Tracking

#### Task E1: Impact Event Logging 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 2 hours  
**Dependencies**: D1 (redemption triggers impact events)  
**Can be done by**: Any backend developer

**Files to create/modify**:
- `lib/db/impact.ts` (new file)
- Add logging to: voucher redemption, surplus pickup, request approval

**Deliverables**:
- `logImpactEvent(type, relatedId, count)` function
- Logs to `impact_events` table
- Called after: voucher redemption, request approval, voucher issuance

**Impact event types**:
- `REQUEST_APPROVED`
- `VOUCHER_ISSUED`
- `VOUCHER_REDEEMED` ← most critical for "meals served"
- `SURPLUS_CLAIMED`
- `SURPLUS_PICKED_UP`

**Dependencies**:
- 🔗 D1 (redemption is main impact event)
- 🔗 B2 (approval is secondary event)
- 🔗 C2 (issuance is tracking point)

---

#### Task E2: Impact Analytics API 🟡 DEPENDENT
**Priority**: P1 - High  
**Time**: 2 hours  
**Dependencies**: E1 (impact events must be logged)  
**Can be done by**: Backend developer

**Files to create/modify**:
- `app/api/admin/impact/route.ts` (GET handler)
- `lib/db/impact.ts` (add analytics queries)

**Deliverables**:
- GET `/api/admin/impact` endpoint
- Returns metrics:
  - Total requests (all, approved, declined)
  - Vouchers issued
  - Vouchers redeemed (meals served) ← KEY METRIC
  - Active vouchers (issued but not redeemed)
  - Surplus packs claimed/picked up (if implemented)

**Dependencies**:
- 🔗 E1 (needs logged events to query)

---

## PHASE 2: User Interface Pages (PARALLEL WORKSTREAMS)

### 🔵 WORKSTREAM F: Beneficiary UI

#### Task F1: Request Help Form 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 2 hours  
**Dependencies**: A1 (request creation API)  
**Can be done by**: Frontend developer

**Files to modify**:
- `app/app/request-help/page.tsx`

**Deliverables**:
- Form with fields: request type, message, urgency
- Calls POST `/api/requests`
- Shows loading state
- Success message + redirect to dashboard
- Error handling

**Dependencies**:
- 🔗 A1 (API must exist to call)

---

#### Task F2: Voucher Wallet UI 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 2 hours  
**Dependencies**: C1, C3 (QR component + voucher API)  
**Can be done by**: Frontend developer

**Files to modify**:
- `app/app/vouchers/page.tsx`
- Create: `app/app/vouchers/[id]/page.tsx` (detail view)

**Deliverables**:
- Lists user's vouchers (calls GET `/api/vouchers/me`)
- Shows: code, value, expiry, status
- Click voucher → detail page with large QR code
- QR code displays `qr_token`
- Shows backup code prominently

**Dependencies**:
- 🔗 C1 (QR component)
- 🔗 C3 (voucher listing API)

---

#### Task F3: Request Status Dashboard 🟡 DEPENDENT
**Priority**: P1 - High  
**Time**: 1.5 hours  
**Dependencies**: A2 (user's request listing API)  
**Can be done by**: Frontend developer

**Files to modify**:
- `app/app/page.tsx` (beneficiary dashboard)

**Deliverables**:
- Shows user's requests with status
- Calls GET `/api/requests/me`
- Status badges: Pending, Approved, Declined, Fulfilled
- Link to request help if no pending requests

**Dependencies**:
- 🔗 A2 (request listing API)

---

### 🔵 WORKSTREAM G: Admin UI

#### Task G1: Request Review Dashboard 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 2.5 hours  
**Dependencies**: B1, B2 (admin request APIs)  
**Can be done by**: Frontend developer

**Files to create**:
- `app/admin/requests/page.tsx`

**Deliverables**:
- Table of pending requests
- Shows: beneficiary name, request type, message, urgency, date
- Approve/Decline buttons for each request
- Calls PATCH `/api/admin/requests/:id`
- Updates table after action (optimistic update or refetch)

**Dependencies**:
- 🔗 B1 (listing API)
- 🔗 B2 (approval API)

---

#### Task G2: Voucher Issuance UI 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 2 hours  
**Dependencies**: C2 (voucher issuance API)  
**Can be done by**: Frontend developer

**Files to create**:
- `app/admin/vouchers/page.tsx`
- OR integrate into `app/admin/requests/page.tsx`

**Deliverables**:
- Form to issue voucher: select approved request, set value, expiry
- Calls POST `/api/admin/vouchers/issue`
- Shows success message
- Updates request list (marks as fulfilled)

**Option**: Combine with G1 - add "Issue Voucher" button directly on approved requests.

**Dependencies**:
- 🔗 C2 (issuance API)
- 🔗 B1 (needs list of approved requests)

---

#### Task G3: Impact Analytics Dashboard 🟡 DEPENDENT
**Priority**: P1 - High  
**Time**: 2 hours  
**Dependencies**: E2 (impact API)  
**Can be done by**: Frontend developer

**Files to modify**:
- `app/admin/dashboard/page.tsx` (create if doesn't exist)
- OR `app/admin/impact/page.tsx`

**Deliverables**:
- Cards showing key metrics:
  - Total requests (pending, approved, declined)
  - Vouchers issued
  - Meals served (vouchers redeemed) ← MOST IMPORTANT
  - Active vouchers
- Calls GET `/api/admin/impact`
- Simple bar charts or numbers (keep it simple)

**Dependencies**:
- 🔗 E2 (analytics API)

---

### 🔵 WORKSTREAM H: Partner UI

#### Task H1: Voucher Redemption Scanner UI 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 2 hours  
**Dependencies**: D1, D2 (redemption API + scanner component)  
**Can be done by**: Frontend developer

**Files to create**:
- `app/partner/redeem/page.tsx`

**Deliverables**:
- Manual code entry input (primary)
- QR scanner button (if D2 completed)
- Calls POST `/api/redeem/voucher`
- Shows voucher details on successful scan
- Confirm redemption button
- Success/error messages

**Dependencies**:
- 🔗 D1 (redemption API)
- 🔗 D2 (scanner component - optional)

---

#### Task H2: Redemption History 🟡 DEPENDENT
**Priority**: P2 - Medium  
**Time**: 1.5 hours  
**Dependencies**: D1 (redemption must exist to show history)  
**Can be done by**: Frontend developer

**Files to create**:
- `app/partner/history/page.tsx`
- `app/api/partner/redemptions/route.ts` (new API)

**Deliverables**:
- API: GET `/api/partner/redemptions` - partner's redemption history
- UI: Table showing date, voucher code, value, beneficiary (anonymized)
- Shows total meals served by this partner

**Dependencies**:
- 🔗 D1 (redemptions exist in database)

---

## PHASE 3: Testing & Deployment

### 🔵 WORKSTREAM I: Testing

#### Task I1: End-to-End Flow Testing 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 3 hours  
**Dependencies**: ALL core features (A1, A2, B1, B2, C2, C3, D1, F1, F2, G1, G2, H1)  
**Can be done by**: Any team member

**Test scenarios**:
1. Beneficiary registers → requests help → sees pending status
2. Admin reviews request → approves
3. Admin issues voucher to beneficiary
4. Beneficiary sees voucher in wallet with QR code
5. Partner scans/enters code → redeems voucher
6. Admin sees "1 meal served" in impact dashboard

**Deliverables**:
- Test checklist (completed)
- Bug list (if any found)
- Demo script for stakeholders

**Dependencies**: 
- 🔗 ALL P0 features must be complete

---

#### Task I2: Bug Fixes & Polish 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 3-5 hours (buffer)  
**Dependencies**: I1 (testing reveals bugs)  
**Can be done by**: All developers

**Activities**:
- Fix bugs found in testing
- Add loading states
- Improve error messages
- Mobile responsiveness check
- Handle edge cases (expired vouchers, double redemption, etc.)

**Dependencies**:
- 🔗 I1 (must test first to find issues)

---

### 🔵 WORKSTREAM J: Deployment

#### Task J1: Production Database Setup 🟢 INDEPENDENT
**Priority**: P1 - High  
**Time**: 1 hour  
**Dependencies**: None (can be done anytime)  
**Can be done by**: DevOps/Backend lead

**Activities**:
- Create production MySQL database (PlanetScale/Railway/AWS RDS)
- Run schema creation (from `lib/db/schema.ts`)
- Set up connection string
- Test connection

**Can start**: Anytime in parallel with development

---

#### Task J2: Environment Configuration 🟢 INDEPENDENT
**Priority**: P1 - High  
**Time**: 30 minutes  
**Dependencies**: None  
**Can be done by**: DevOps/Backend lead

**Activities**:
- Set Vercel environment variables:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `AUTH_SECRET`
- Configure any other secrets
- Test environment variable access

**Can start**: Anytime

---

#### Task J3: Vercel Deployment 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 1 hour  
**Dependencies**: J1, J2, I2 (all features tested and working)  
**Can be done by**: DevOps/Backend lead

**Activities**:
- Deploy to Vercel
- Verify deployment successful
- Test production site
- Check database connectivity
- Verify all features work in production

**Dependencies**:
- 🔗 J1 (production DB must exist)
- 🔗 J2 (environment variables must be set)
- 🔗 I2 (code must be tested and bug-free)

---

#### Task J4: Demo Account Setup 🟡 DEPENDENT
**Priority**: P0 - Critical  
**Time**: 30 minutes  
**Dependencies**: J3 (production site must be deployed)  
**Can be done by**: Any team member

**Activities**:
- Create demo accounts on production:
  - `demo-beneficiary@ecoeats.com`
  - `demo-admin@ecoeats.com`
  - `demo-partner@ecoeats.com`
  - `demo-donor@ecoeats.com`
- Create sample data: 1 request, 1 voucher, 1 redemption
- Test complete flow with demo accounts
- Document login credentials

**Dependencies**:
- 🔗 J3 (must be deployed)
- 🔗 Task 0.1 seed script can be adapted for production

---

## PHASE 4: Nice-to-Have Features (OPTIONAL)

### Task K1: Surplus Food System 🟢 INDEPENDENT
**Priority**: P2 - Medium  
**Time**: 4 hours  
**Dependencies**: None (independent subsystem)  
**Can be done by**: 1-2 developers

**Files to create**:
- `app/api/surplus/route.ts` (POST/GET)
- `app/api/surplus/[id]/claim/route.ts` (POST)
- `app/partner/surplus/page.tsx` (UI)
- `app/app/surplus/page.tsx` (beneficiary view)

**Deliverables**:
- Partner can post surplus listings
- Beneficiary can claim surplus
- Pickup code generation
- Confirmation flow

**Why Independent**: Separate from voucher system, own database tables.

---

### Task K2: Donor Flow 🟢 INDEPENDENT
**Priority**: P2 - Medium  
**Time**: 3 hours  
**Dependencies**: None (for manual flow)  
**Can be done by**: 1 developer

**Files to create**:
- `app/donor/donate/page.tsx`
- `app/api/donations/route.ts` (POST - manual for now)
- `app/donor/impact/page.tsx`

**Deliverables**:
- Donation form (manual recording, no payment gateway)
- Donation history
- Impact dashboard for donors (aggregate stats only)

**Why Independent**: Can work without other features, manual process acceptable.

---

### Task K3: Email Notifications 🟡 DEPENDENT
**Priority**: P3 - Low  
**Time**: 3 hours  
**Dependencies**: Core flows working  
**Can be done by**: Backend developer

**Activities**:
- Set up email service (SendGrid/Postmark)
- Send emails on: request approved, voucher issued, voucher redeemed
- Email templates

**Dependencies**:
- 🔗 B2 (approval triggers email)
- 🔗 C2 (issuance triggers email)
- 🔗 D1 (redemption triggers email)

---

## 📊 SUMMARY: Parallel Workstreams

### Week 1 (Feb 9-15): Core Development

**🟢 START IMMEDIATELY (No Dependencies)**:
- Task 0.1: Seed script (2h) - Anyone
- Task A1: Request creation API (2h) - Dev A
- Task A2: Request listing API (1.5h) - Dev B
- Task B1: Admin request listing API (1.5h) - Dev C
- Task C1: QR library integration (1h) - Dev D
- Task C3: Voucher retrieval API (1.5h) - Dev E
- Task J1: Production DB setup (1h) - DevOps
- Task J2: Environment config (0.5h) - DevOps

**Total**: 11 hours of parallel work (can be done by 5-8 people simultaneously)

---

**🟡 START AFTER ABOVE COMPLETE**:
- Task B2: Admin approval API (2h) - Dev C [needs B1]
- Task C2: Voucher issuance API (3h) - Dev A [needs B2]
- Task F1: Request help form (2h) - Frontend [needs A1]
- Task F3: Request dashboard (1.5h) - Frontend [needs A2]
- Task G1: Admin review UI (2.5h) - Frontend [needs B1, B2]

**Total**: 11 hours (some parallel possible)

---

### Week 2 (Feb 16-22): Integration & Polish

**🟡 CONTINUE**:
- Task D1: Redemption API (3h) - Dev [needs C2, C3]
- Task F2: Voucher wallet UI (2h) - Frontend [needs C1, C3]
- Task G2: Voucher issuance UI (2h) - Frontend [needs C2]
- Task E1: Impact logging (2h) - Backend [needs D1]
- Task D2: QR scanner (2h) - Frontend [needs C1, D1]
- Task H1: Partner redemption UI (2h) - Frontend [needs D1, D2]

**Total**: 13 hours

---

**🟡 FINAL PHASE**:
- Task E2: Impact analytics API (2h) - Backend [needs E1]
- Task G3: Impact dashboard UI (2h) - Frontend [needs E2]
- Task I1: End-to-end testing (3h) - All team
- Task I2: Bug fixes (3-5h) - All team
- Task J3: Deployment (1h) - DevOps
- Task J4: Demo accounts (0.5h) - Anyone

**Total**: 11.5-13.5 hours

---

## 🎯 Optimal Team Allocation

### 5-Person Team:

**Developer 1 (Backend - Requests)**:
- Task 0.1: Seed script
- Task A1: Request creation API
- Task B2: Admin approval API
- Task C2: Voucher issuance API

**Developer 2 (Backend - Vouchers/Redemption)**:
- Task A2: Request listing API
- Task C3: Voucher retrieval API
- Task D1: Redemption API
- Task E1: Impact logging

**Developer 3 (Backend - Admin/Analytics)**:
- Task B1: Admin listing API
- Task E2: Impact analytics API
- Task H2: Redemption history API

**Developer 4 (Frontend - Beneficiary/Admin)**:
- Task C1: QR library setup
- Task F1: Request help form
- Task F2: Voucher wallet UI
- Task F3: Request dashboard
- Task G1: Admin review UI
- Task G2: Voucher issuance UI

**Developer 5 (Frontend - Partner/Polish)**:
- Task D2: QR scanner component
- Task H1: Partner redemption UI
- Task G3: Impact dashboard UI
- Task I2: Bug fixes and polish

**DevOps/Lead**:
- Task J1: Production DB
- Task J2: Environment config
- Task J3: Deployment
- Task J4: Demo accounts
- Task I1: Coordinate testing

---

## ✅ Critical Path (Longest Dependency Chain)

```
0.1 Seed Script (2h)
  ↓
A1 Request API (2h)
  ↓
B1 Admin List API (1.5h)
  ↓
B2 Admin Approval API (2h)
  ↓
C2 Voucher Issuance API (3h)
  ↓
D1 Redemption API (3h)
  ↓
E1 Impact Logging (2h)
  ↓
E2 Impact Analytics (2h)
  ↓
I1 Testing (3h)
  ↓
I2 Bug Fixes (3h)
  ↓
J3 Deployment (1h)

TOTAL: 25.5 hours critical path
```

With parallel work on UI, actual calendar time: **10-12 days with 3+ developers**

---

## 🚀 Quick Start Recommendation

### Day 1 (Feb 9) - 8 hours
**ALL developers start in parallel**:
- Developer 1: Task 0.1 (seed) → A1 (request API)
- Developer 2: Task C1 (QR setup) → C3 (voucher list API)
- Developer 3: Task B1 (admin list API) → A2 (user requests API)
- DevOps: Task J1 (prod DB) → J2 (env vars)

**End of Day**: 4 independent APIs working, QR library ready, seed data available

### Day 2-3 (Feb 10-11) - 16 hours
- Developer 1: Task B2 (approval) → C2 (voucher issuance)
- Developer 2: Task D1 (redemption API)
- Developer 3: Task F1 (request form) → F3 (request dashboard)
- Developer 4: Task G1 (admin review UI)

**End of Day 3**: Complete request → approval → voucher → redemption backend

### Day 4-5 (Feb 12-13) - 16 hours
- Developer 1: Task E1 (impact logging) → E2 (analytics API)
- Developer 2: Task D2 (QR scanner) → H1 (partner UI)
- Developer 3: Task F2 (voucher wallet)
- Developer 4: Task G2 (voucher issuance UI) → G3 (impact dashboard)

**End of Day 5**: All core features complete

### Day 6-7 (Feb 14-15) - 16 hours
- All: Task I1 (testing) → I2 (bug fixes)
- DevOps: Task J3 (deployment) → J4 (demo accounts)

**End of Day 7**: Production deployment, demo ready

---

## 📋 Daily Standup Template

**What did you complete yesterday?**
- List completed tasks by number (e.g., "Task A1 complete")

**What are you working on today?**
- Current task number and name

**Any blockers?**
- Dependencies waiting on other developers
- Technical issues
- Unclear requirements

**Can you help unblock someone else?**
- Code review needed
- Pair programming available
- Knowledge sharing

---

## 🎯 Success Metrics

**By Feb 15 (Week 1)**:
- [ ] 12/12 core APIs built and tested
- [ ] Database seed script working
- [ ] QR code library integrated

**By Feb 22 (Week 2)**:
- [ ] All 9 critical features working end-to-end
- [ ] Impact dashboard showing "meals served"
- [ ] Deployed to production
- [ ] Demo accounts ready

**Demo Success**:
- [ ] Live demonstration of: Request → Approve → Issue → Display → Redeem → Track
- [ ] No critical bugs during demo
- [ ] Mobile-friendly display

---

*This action plan enables 3-5 developers to work in parallel, minimizing idle time and maximizing velocity. Focus on completing independent tasks first, then tackle dependent tasks in order.*
