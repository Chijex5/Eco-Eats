# Database Seed Script

## Overview
This directory contains scripts for database setup and seeding.

## seed-database.ts

Populates the database with test data for all user roles and entities.

### Prerequisites
- MySQL database server running
- Database created (e.g., `ecoeats_db`)
- `.env` file configured with `DATABASE_URL`

### Usage

```bash
npm run seed
```

### What it creates

#### Users (7 test accounts)
- **Beneficiaries** (2):
  - `alice@beneficiary.test` / `password123` - Student, High need
  - `bob@beneficiary.test` / `password123` - Community, Medium need

- **Donors** (2):
  - `charlie@donor.test` / `password123` - ₦100,000 donation
  - `diana@donor.test` / `password123` - ₦50,000 donation

- **Partner Owner** (1):
  - `eric@partner.test` / `password123` - Owns 2 restaurants

- **Partner Staff** (1):
  - `frank@staff.test` / `password123` - Works at Campus Cafeteria

- **Admin** (1):
  - `grace@admin.test` / `password123` - System administrator

#### Other Data
- 2 Food Partners (Campus Cafeteria, Quick Bite Restaurant)
- 3 Support Requests (PENDING, APPROVED, FULFILLED)
- 2 Vouchers (ACTIVE, REDEEMED)
- 2 Donations (COMPLETED)
- 2 Surplus Listings (ACTIVE)
- 1 Surplus Claim (PENDING)
- Impact events for tracking

### Features
- ✅ Creates all database tables if they don't exist
- ✅ Hashes passwords with bcrypt
- ✅ Generates unique IDs for all entities
- ✅ Creates realistic test data across all user roles
- ✅ Includes various entity statuses (PENDING, APPROVED, etc.)
- ✅ Sets up relationships between entities

### Notes
- **NOT idempotent**: Running multiple times will create duplicate data and may cause unique constraint violations (duplicate emails). For a clean slate, drop and recreate the database first.
- For a clean database: `DROP DATABASE ecoeats_db; CREATE DATABASE ecoeats_db;`
- All users have `is_email_verified` set to `TRUE` for easier testing
- Passwords are bcrypt-hashed for security
- ⚠️ **WARNING**: The password 'password123' is for testing ONLY. Never use weak passwords in production!

### Example Output

```
🌱 Starting database seeding...

📊 Creating tables...
✅ All database tables created successfully

👥 Creating test users...
  ✓ Created BENEFICIARY: alice@beneficiary.test (password: password123)
  ✓ Created BENEFICIARY: bob@beneficiary.test (password: password123)
  ...

🎓 Creating beneficiary profiles...
  ✓ Created profile for Alice (Student, High need)
  ...

✅ Database seeding completed successfully!

📝 Test Credentials:
==========================================
Beneficiary 1: alice@beneficiary.test / password123
Beneficiary 2: bob@beneficiary.test / password123
...
==========================================
```

### Troubleshooting

**Database connection error:**
- Check your `.env` file has correct `DATABASE_URL`
- Ensure MySQL server is running
- Verify database exists

**Duplicate entry error:**
- The script doesn't clear existing data
- Either drop and recreate the database, or use different email addresses

**Permission denied:**
- Ensure database user has INSERT permissions on all tables
