## ECOEATS — SDG 2 (ZERO HUNGER) FULL APP SPEC

**Mission:** Reduce hunger by connecting **people who need food** , **food sources** , and **support partners**
through a transparent, accountable system.

## Two Deliverables

```
● Phase A (Internal Prototype) : UI/flow only (team alignment, due soon)
● Phase B (Full Full-Stack App) : working end-to-end (judges, Feb 2)
```
# PART 1 — NON-TECHNICAL (FOR

# EVERYONE)

## 1) What EcoEats actually does (SDG 2 framing)

EcoEats is a platform where:

1. **People who need food support** can request help discreetly
2. **Food providers** (cafeterias, restaurants, farms, kitchens) can list:
    ○ surplus meals
    ○ subsidized meals
    ○ donation-ready food packs
3. **Donors/sponsors** (individuals, alumni, CSR, NGOs) can fund:
    ○ meal vouchers
    ○ food packs
4. **Admins/partners** (school/NGO) can verify, approve, and track impact:
    ○ who received support


○ how many meals delivered
○ where the biggest needs are
EcoEats is not “buy food”.
EcoEats is “ **make sure people don’t go hungry** ”.

## 2) People in the system (Roles)

### A) Beneficiaries (People needing food)

They can:
● sign up (low friction)
● request food support
● receive vouchers or food packs
● redeem help (with a code/QR)
● give feedback after receiving help

### B) Food Partners (Restaurants/Canteens/Community Kitchens)

They can:
● list available meals or food packs
● accept voucher redemptions
● confirm pickup/delivery
● see how many people they helped

### C) Donors/Sponsors

They can:
● fund meal vouchers or food packs
● choose donation type (₦ amount or number of meals)


```
● see transparent impact reports (not private details)
```
### D) Volunteers/Delivery (Optional)

They can:
● claim pickup tasks (collect surplus food)
● deliver to distribution points
● confirm delivery (QR/Code)

### E) Admin (School/NGO)

They can:
● approve food partners
● verify beneficiary requests (light verification)
● prevent fraud
● monitor hunger hotspots
● publish impact reports

## 3) Core programs EcoEats supports (choose 2–3 to implement

## now)

To stay buildable by Feb 2, we implement **only a few programs well** , not 10 half-done.

### Program 1: Meal Voucher Program

```
● Donors fund vouchers
● Beneficiaries receive a voucher
● Beneficiary redeems at partner provider using QR/code
● Provider confirms redemption
```

```
● System records impact (“1 meal served”)
```
### Program 2: Surplus Food Rescue

```
● Food partner lists surplus packs (e.g., “10 packs available till 6pm”)
● Beneficiaries can claim (or admin assigns)
● Pickup confirmed (QR/code)
● Reduces waste + feeds people
```
### Program 3 (optional): Community Distribution Events

```
● Admin creates event (date, location, number of packs)
● Volunteers help distribute
● Attendance/pack distribution recorded
```
## 4) What judges must be able to do (end-to-end demo)

By Feb 2, judges should be able to:
✅ Create a beneficiary account
✅ Submit a request for food support
✅ Admin reviews and approves request
✅ Donor funds vouchers
✅ Beneficiary receives voucher in-app
✅ Beneficiary redeems voucher at a food partner
✅ Food partner confirms redemption
✅ Admin dashboard shows: meals served + impact statistics
That’s SDG 2 impact in motion.

## 5) Pages that must exist (plain language list)

### Public


```
● Landing (mission + SDG 2 story + spotlight preview)
● How it works
● Learn (food waste education hub) NEW
● Spotlight (weekly hero features) NEW
● Partners page (how providers join)
● Donate page (donors)
● Contact/Get Involved NEW
● Login / Signup
```
### Beneficiary

```
● Request food support
● Voucher wallet
● Claim surplus packs
● Redemption QR/code
● History + feedback
```
### Food Partner

```
● Partner setup
● Post surplus packs
● Voucher redemption scanner
● Redemption history
● Impact stats (meals served)
```
### Donor

```
● Donate (buy meals / fund vouchers)
● Donation history
● Impact dashboard (aggregate)
```
### Admin


```
● Approve partners
● Review beneficiary requests
● Issue vouchers / assign packs
● Fraud flags & reports
● Impact analytics (meals served, packs distributed)
```
## 6) Why this helps SDG 2 (in one sentence judges love)

EcoEats reduces hunger by **educating communities about food waste, celebrating impact heroes weekly, and turning donations and surplus food into verified meals** , tracked transparently from funding → distribution → redemption.

## 7) Educational Components (New Focus)

### A) Food Waste Education Hub (/learn)
- **The Problem**: Global and local food waste statistics
- **Environmental Impact**: How food waste affects climate and resources
- **Social Impact**: Connection between waste and hunger
- **What You Can Do**: Practical tips for individuals, families, and businesses
- **Success Stories**: Real examples of waste reduction

### B) Community Spotlight (/spotlight)
- **Weekly Features**: Farmer/Donor/Volunteer of the Week
- **Impact Stories**: Detailed narratives of community heroes
- **Measurable Impact**: Stats showing their contributions
- **How They Did It**: Educational breakdown of their approach
- **Call to Action**: How others can replicate their success

### C) Get Involved / Contact
- **Report Food Waste**: Form to alert about wastage in community
- **Volunteer Opportunities**: Ways to actively participate
- **Educational Resources**: Downloadable guides and materials
- **Contact Form**: Direct line to EcoEats team for questions/partnerships
- **Newsletter**: Stay informed about food sustainability

# PART 2 — TECHNICAL (DEV-ONLY,

# DEEP SPEC)

## 1) System architecture (full-stack)

● **Next.js (App Router)** frontend + backend API routes
● **PostgreSQL** database
● Auth + role-based access
● Payment integration (optional but recommended for donors)
● QR/code based redemption system (core proof)
Deployment:
● Vercel for app
● Neon/Supabase/Railway for Postgres


## 2) Roles & permissions (strict)

Roles:
● BENEFICIARY
● DONOR
● PARTNER_OWNER
● PARTNER_STAFF
● VOLUNTEER (optional)
● ADMIN
Permission rules:
● Beneficiary can only see their own requests/vouchers/redemptions
● Donor sees only their donations + aggregate impact, never beneficiary identity
● Partner sees redemptions done at their location, not beneficiary “profile details”
● Admin sees everything

## 3) Data model (tables + columns + types)

### 3.1 users

```
column type notes
id uuid pk
full_name varchar(120)
email varchar(255) unique
password_hash text
role varchar(30)
```

```
is_email_verified boolean default false
phone varchar(30) null optional
created_at timestamptz
updated_at timestamptz
```
### 3.2 beneficiary_profiles

Keep it minimal + dignity-respecting.
**column type notes**
user_id uuid pk fk users.id
affiliation varchar(50) STUDENT/STAFF/COMMUNITY
location_text varchar(255) null “Hostel A”
need_level varchar(20) LOW/MED/HIGH (self-reported + admin reviewed)
verified_status varchar(20) PENDING/VERIFIED/REJECTED
created_at timestamptz

### 3.3 food_partners

```
column type
id uuid pk
owner_user_id uuid fk users.id
name varchar(150)
description text null
logo_url text null
location_text varchar(255)
lat decimal(9,6) null
lng decimal(9,6) null
status varchar(20)
opening_hours_json jsonb
created_at timestamptz
```

### 3.4 partner_staff

```
column type
id uuid pk
partner_id uuid fk food_partners.id
user_id uuid fk users.id
staff_role varchar(30)
can_redeem boolean default true
can_post_surplus boolean default false
created_at timestamptz
```
### 3.5 support_requests

Beneficiary requests help.
**column type notes**
id uuid pk
beneficiary_user_id uuid fk users.id
request_type varchar(30) VOUCHER / FOOD_PACK
message text null short explanation
urgency varchar(20) LOW/MED/HIGH
status varchar(20) PENDING/APPROVED/DECLINED/FULFILLED
reviewed_by uuid fk users.id
null
admin
reviewed_at timestamptz null
created_at timestamptz

### 3.6 donations

Donors fund vouchers/meals.
**column type**
id uuid pk


```
donor_user_id uuid fk users.id
amount_kobo integer
currency varchar(10) default 'NGN'
donation_type varchar(30)
status varchar(20)
payment_ref varchar(120) unique
created_at timestamptz
```
### 3.7 vouchers

Actual units of “meal support”.
**column type notes**
id uuid pk
code varchar(20) unique short human-friendly (e.g., EAT-7H3K2)
qr_token varchar(120) unique for QR
value_kobo integer voucher value
beneficiary_user_id uuid fk users.id who can redeem
issued_by_admin_id uuid fk users.id admin
status varchar(20) ACTIVE/REDEEMED/EXPIRED/REVOKED
expires_at timestamptz
created_at timestamptz

### 3.8 voucher_redemptions

Proof of impact.
**column type**
id uuid pk
voucher_id uuid fk vouchers.id
partner_id uuid fk food_partners.id
redeemed_by_user_id uuid fk users.id


```
confirmed_by_staff_id uuid fk users.id
redeemed_at timestamptz
meal_description varchar(255) null
value_kobo integer
created_at timestamptz
```
### 3.9 surplus_listings

Surplus packs from partners.
**column type**
id uuid pk
partner_id uuid fk food_partners.id
title varchar(150)
description text null
quantity_available integer
claim_limit_per_user integer default 1
pickup_deadline timestamptz
status varchar(20)
created_at timestamptz

### 3.10 surplus_claims

```
column type
id uuid pk
listing_id uuid fk surplus_listings.id
beneficiary_user_id uuid fk users.id
status varchar(20)
pickup_code varchar(20)
confirmed_by_staff_id uuid fk users.id null
created_at timestamptz
```

### 3.11 impact_events (optional but strong)

A unified log for analytics.
**column type**
id uuid pk
event_type varchar(30)
related_id uuid
count integer default 1
created_at timestamptz

## 4) Core APIs (route handlers)

### Auth

```
● POST /api/auth/register
● POST /api/auth/login
● POST /api/auth/verify-email
```
### Beneficiary

```
● POST /api/requests (create support request)
● GET /api/requests/me
● GET /api/vouchers/me
● GET /api/surplus
● POST /api/surplus/:id/claim
```
### Donor

```
● POST /api/donations/initiate
● POST /api/donations/webhook
```

```
● GET /api/donations/me
● GET /api/impact/summary (aggregate only)
```
### Partner

```
● POST /api/partners
● PATCH /api/partners/:id
● POST /api/partners/:id/surplus
● POST /api/redeem/voucher (staff confirms voucher by code/qr_token)
● POST /api/redeem/surplus (staff confirms pickup code)
```
### Admin

```
● GET /api/admin/requests?status=PENDING
● PATCH /api/admin/requests/:id (approve/decline)
● POST /api/admin/vouchers/issue (issue voucher to approved request)
● PATCH /api/admin/partners/:id/approve
● GET /api/admin/impact
```
## 5) Redemption mechanism (QR/code) — exact logic

### Voucher redemption

```
● Beneficiary opens “My Voucher”
● App shows:
○ QR code (contains qr_token)
○ backup short code (code)
● Partner staff opens “Redeem Voucher”
```

● Staff can:
○ scan QR (camera) OR type code
● API validates:
○ voucher exists
○ status = ACTIVE
○ not expired
○ voucher belongs to that beneficiary (optional check if scanning from beneficiary
screen)
● API creates voucher_redemptions record
● API sets voucher status → REDEEMED
● API logs impact event
This produces a hard judge-friendly statement:
“We prevent double spending and prove the meal was served.”

### Surplus pickup confirmation

```
● Beneficiary claims a listing → gets pickup_code
● Staff confirms pickup code → marks as PICKED_UP → logs impact
```
## 6) UI Pages (dev mapping)

Public:
● / mission + CTA
● /how-it-works programs explanation
● /donate donation options
● /partners/join


Auth:
● /auth/signup (role select)
● /auth/signup/beneficiary
● /auth/signup/donor
● /auth/signup/partner
● /auth/login
● /auth/verify-email
Beneficiary:
● /app/request-help
● /app/vouchers
● /app/vouchers/[id] (QR screen)
● /app/surplus
● /app/surplus/[id]
● /app/history
● /app/profile
Donor:
● /donor/dashboard
● /donor/donate
● /donor/history
● /donor/impact
Partner:
● /partner/dashboard
● /partner/surplus


● /partner/redeem (scanner/code)
● /partner/history
● /partner/settings
Admin:
● /admin/dashboard
● /admin/requests
● /admin/partners
● /admin/vouchers
● /admin/impact

## 7) What not to do (scope control so you don’t die)

Do NOT add:
● Real-time chat
● Complex recommendations
● Social features
● Multi-tenant org billing
● Anything “AI”
For judges, impact + accountability beats fancy features.

## 8) Impact metrics (judges will ask)

Track and display:
● Meals funded (from donations)


● Meals served (redemptions)
● Food packs claimed + picked up
● Active partners
● Average time to fulfill request
● Demand hotspots (by location_text group)
Make a dashboard that shows this, even if small numbers.


