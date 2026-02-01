/**
 * Database schema creation and migration
 * Creates all tables defined in PRD.md
 */

import { query } from './connection';

/**
 * Create all database tables
 */
export async function createTables() {
  try {
    // 1. Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(30) NOT NULL CHECK (role IN ('BENEFICIARY', 'DONOR', 'PARTNER_OWNER', 'PARTNER_STAFF', 'VOLUNTEER', 'ADMIN')),
        is_email_verified BOOLEAN DEFAULT FALSE,
        phone VARCHAR(30),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Beneficiary profiles
    await query(`
      CREATE TABLE IF NOT EXISTS beneficiary_profiles (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        affiliation VARCHAR(50) CHECK (affiliation IN ('STUDENT', 'STAFF', 'COMMUNITY')),
        location_text VARCHAR(255),
        need_level VARCHAR(20) CHECK (need_level IN ('LOW', 'MED', 'HIGH')),
        verified_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verified_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Food partners
    await query(`
      CREATE TABLE IF NOT EXISTS food_partners (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        logo_url TEXT,
        location_text VARCHAR(255),
        lat DECIMAL(9,6),
        lng DECIMAL(9,6),
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED')),
        opening_hours_json JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Partner staff
    await query(`
      CREATE TABLE IF NOT EXISTS partner_staff (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        partner_id UUID REFERENCES food_partners(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        staff_role VARCHAR(30),
        can_redeem BOOLEAN DEFAULT TRUE,
        can_post_surplus BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(partner_id, user_id)
      );
    `);

    // 5. Support requests
    await query(`
      CREATE TABLE IF NOT EXISTS support_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        beneficiary_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        request_type VARCHAR(30) CHECK (request_type IN ('VOUCHER', 'FOOD_PACK')),
        message TEXT,
        urgency VARCHAR(20) CHECK (urgency IN ('LOW', 'MED', 'HIGH')),
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED', 'FULFILLED')),
        reviewed_by UUID REFERENCES users(id),
        reviewed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 6. Donations
    await query(`
      CREATE TABLE IF NOT EXISTS donations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        donor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        amount_kobo INTEGER NOT NULL,
        currency VARCHAR(10) DEFAULT 'NGN',
        donation_type VARCHAR(30),
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
        payment_ref VARCHAR(120) UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 7. Vouchers
    await query(`
      CREATE TABLE IF NOT EXISTS vouchers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(20) UNIQUE NOT NULL,
        qr_token VARCHAR(120) UNIQUE NOT NULL,
        value_kobo INTEGER NOT NULL,
        beneficiary_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        issued_by_admin_id UUID REFERENCES users(id),
        status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REDEEMED', 'EXPIRED', 'REVOKED')),
        expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 8. Voucher redemptions
    await query(`
      CREATE TABLE IF NOT EXISTS voucher_redemptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        voucher_id UUID REFERENCES vouchers(id) ON DELETE CASCADE,
        partner_id UUID REFERENCES food_partners(id) ON DELETE SET NULL,
        redeemed_by_user_id UUID REFERENCES users(id),
        confirmed_by_staff_id UUID REFERENCES users(id),
        redeemed_at TIMESTAMPTZ DEFAULT NOW(),
        meal_description VARCHAR(255),
        value_kobo INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 9. Surplus listings
    await query(`
      CREATE TABLE IF NOT EXISTS surplus_listings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        partner_id UUID REFERENCES food_partners(id) ON DELETE CASCADE,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        quantity_available INTEGER NOT NULL,
        claim_limit_per_user INTEGER DEFAULT 1,
        pickup_deadline TIMESTAMPTZ NOT NULL,
        status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'COMPLETED')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 10. Surplus claims
    await query(`
      CREATE TABLE IF NOT EXISTS surplus_claims (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        listing_id UUID REFERENCES surplus_listings(id) ON DELETE CASCADE,
        beneficiary_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PICKED_UP', 'CANCELLED')),
        pickup_code VARCHAR(20) NOT NULL,
        confirmed_by_staff_id UUID REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 11. Impact events
    await query(`
      CREATE TABLE IF NOT EXISTS impact_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('MEAL_FUNDED', 'MEAL_SERVED', 'PACK_CLAIMED', 'PACK_PICKED_UP', 'REQUEST_APPROVED', 'PARTNER_JOINED')),
        related_id UUID,
        count INTEGER DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create indexes for better query performance
    await query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
    await query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);');
    await query('CREATE INDEX IF NOT EXISTS idx_support_requests_status ON support_requests(status);');
    await query('CREATE INDEX IF NOT EXISTS idx_support_requests_beneficiary ON support_requests(beneficiary_user_id);');
    await query('CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(code);');
    await query('CREATE INDEX IF NOT EXISTS idx_vouchers_qr_token ON vouchers(qr_token);');
    await query('CREATE INDEX IF NOT EXISTS idx_vouchers_status ON vouchers(status);');
    await query('CREATE INDEX IF NOT EXISTS idx_surplus_listings_status ON surplus_listings(status);');
    await query('CREATE INDEX IF NOT EXISTS idx_impact_events_type ON impact_events(event_type);');
    await query('CREATE INDEX IF NOT EXISTS idx_impact_events_created_at ON impact_events(created_at);');

    console.log('✅ All database tables created successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

/**
 * Drop all tables (use with caution!)
 */
export async function dropTables() {
  try {
    await query('DROP TABLE IF EXISTS impact_events CASCADE;');
    await query('DROP TABLE IF EXISTS surplus_claims CASCADE;');
    await query('DROP TABLE IF EXISTS surplus_listings CASCADE;');
    await query('DROP TABLE IF EXISTS voucher_redemptions CASCADE;');
    await query('DROP TABLE IF EXISTS vouchers CASCADE;');
    await query('DROP TABLE IF EXISTS donations CASCADE;');
    await query('DROP TABLE IF EXISTS support_requests CASCADE;');
    await query('DROP TABLE IF EXISTS partner_staff CASCADE;');
    await query('DROP TABLE IF EXISTS food_partners CASCADE;');
    await query('DROP TABLE IF NOT EXISTS beneficiary_profiles CASCADE;');
    await query('DROP TABLE IF EXISTS users CASCADE;');
    
    console.log('✅ All tables dropped successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
    throw error;
  }
}
