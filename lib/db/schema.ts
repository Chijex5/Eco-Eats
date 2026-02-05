/**
 * Database schema creation and migration
 * Creates all tables defined in PRD.md
 */

import { query } from './connection';

async function safeCreateIndex(sql: string) {
  try {
    await query(sql);
  } catch (error: any) {
    if (error?.code === 'ER_DUP_KEYNAME') {
      return;
    }
    throw error;
  }
}

/**
 * Create all database tables
 */
export async function createTables() {
  try {
    // 1. Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY,
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(30) NOT NULL CHECK (role IN ('BENEFICIARY', 'DONOR', 'PARTNER_OWNER', 'PARTNER_STAFF', 'VOLUNTEER', 'ADMIN')),
        is_email_verified BOOLEAN DEFAULT FALSE,
        phone VARCHAR(30),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 2. Beneficiary profiles
    await query(`
      CREATE TABLE IF NOT EXISTS beneficiary_profiles (
        user_id CHAR(36) PRIMARY KEY,
        affiliation VARCHAR(50) CHECK (affiliation IN ('STUDENT', 'STAFF', 'COMMUNITY')),
        location_text VARCHAR(255),
        need_level VARCHAR(20) CHECK (need_level IN ('LOW', 'MED', 'HIGH')),
        verified_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verified_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 3. Food partners
    await query(`
      CREATE TABLE IF NOT EXISTS food_partners (
        id CHAR(36) PRIMARY KEY,
        owner_user_id CHAR(36),
        name VARCHAR(150) NOT NULL,
        description TEXT,
        logo_url TEXT,
        location_text VARCHAR(255),
        lat DECIMAL(9,6),
        lng DECIMAL(9,6),
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED')),
        opening_hours_json JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 4. Partner staff
    await query(`
      CREATE TABLE IF NOT EXISTS partner_staff (
        id CHAR(36) PRIMARY KEY,
        partner_id CHAR(36),
        user_id CHAR(36),
        staff_role VARCHAR(30),
        can_redeem BOOLEAN DEFAULT TRUE,
        can_post_surplus BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(partner_id, user_id),
        FOREIGN KEY (partner_id) REFERENCES food_partners(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 5. Support requests
    await query(`
      CREATE TABLE IF NOT EXISTS support_requests (
        id CHAR(36) PRIMARY KEY,
        beneficiary_user_id CHAR(36),
        request_type VARCHAR(30) CHECK (request_type IN ('VOUCHER', 'FOOD_PACK')),
        message TEXT,
        urgency VARCHAR(20) CHECK (urgency IN ('LOW', 'MED', 'HIGH')),
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED', 'FULFILLED')),
        reviewed_by CHAR(36),
        reviewed_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (beneficiary_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(id)
      ) ENGINE=InnoDB;
    `);

    // 6. Donations
    await query(`
      CREATE TABLE IF NOT EXISTS donations (
        id CHAR(36) PRIMARY KEY,
        donor_user_id CHAR(36),
        amount_kobo INT NOT NULL,
        currency VARCHAR(10) DEFAULT 'NGN',
        donation_type VARCHAR(30),
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
        payment_ref VARCHAR(120) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (donor_user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    // 7. Vouchers
    await query(`
      CREATE TABLE IF NOT EXISTS vouchers (
        id CHAR(36) PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        qr_token VARCHAR(120) UNIQUE NOT NULL,
        value_kobo INT NOT NULL,
        beneficiary_user_id CHAR(36),
        issued_by_admin_id CHAR(36),
        status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REDEEMED', 'EXPIRED', 'REVOKED')),
        expires_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (beneficiary_user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (issued_by_admin_id) REFERENCES users(id)
      ) ENGINE=InnoDB;
    `);

    // 8. Voucher redemptions
    await query(`
      CREATE TABLE IF NOT EXISTS voucher_redemptions (
        id CHAR(36) PRIMARY KEY,
        voucher_id CHAR(36),
        partner_id CHAR(36),
        redeemed_by_user_id CHAR(36),
        confirmed_by_staff_id CHAR(36),
        redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        meal_description VARCHAR(255),
        value_kobo INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
        FOREIGN KEY (partner_id) REFERENCES food_partners(id) ON DELETE SET NULL,
        FOREIGN KEY (redeemed_by_user_id) REFERENCES users(id),
        FOREIGN KEY (confirmed_by_staff_id) REFERENCES users(id)
      ) ENGINE=InnoDB;
    `);

    // 9. Surplus listings
    await query(`
      CREATE TABLE IF NOT EXISTS surplus_listings (
        id CHAR(36) PRIMARY KEY,
        partner_id CHAR(36),
        title VARCHAR(150) NOT NULL,
        description TEXT,
        quantity_available INT NOT NULL,
        claim_limit_per_user INT DEFAULT 1,
        pickup_deadline TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'COMPLETED')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (partner_id) REFERENCES food_partners(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 10. Surplus claims
    await query(`
      CREATE TABLE IF NOT EXISTS surplus_claims (
        id CHAR(36) PRIMARY KEY,
        listing_id CHAR(36),
        beneficiary_user_id CHAR(36),
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PICKED_UP', 'CANCELLED')),
        pickup_code VARCHAR(20) NOT NULL,
        confirmed_by_staff_id CHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (listing_id) REFERENCES surplus_listings(id) ON DELETE CASCADE,
        FOREIGN KEY (beneficiary_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (confirmed_by_staff_id) REFERENCES users(id)
      ) ENGINE=InnoDB;
    `);

    // 11. Impact events
    await query(`
      CREATE TABLE IF NOT EXISTS impact_events (
        id CHAR(36) PRIMARY KEY,
        event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('MEAL_FUNDED', 'MEAL_SERVED', 'PACK_CLAIMED', 'PACK_PICKED_UP', 'REQUEST_APPROVED', 'PARTNER_JOINED')),
        related_id CHAR(36),
        count INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Create indexes for better query performance
    await safeCreateIndex('CREATE INDEX idx_users_email ON users(email);');
    await safeCreateIndex('CREATE INDEX idx_users_role ON users(role);');
    await safeCreateIndex('CREATE INDEX idx_support_requests_status ON support_requests(status);');
    await safeCreateIndex('CREATE INDEX idx_support_requests_beneficiary ON support_requests(beneficiary_user_id);');
    await safeCreateIndex('CREATE INDEX idx_vouchers_code ON vouchers(code);');
    await safeCreateIndex('CREATE INDEX idx_vouchers_qr_token ON vouchers(qr_token);');
    await safeCreateIndex('CREATE INDEX idx_vouchers_status ON vouchers(status);');
    await safeCreateIndex('CREATE INDEX idx_surplus_listings_status ON surplus_listings(status);');
    await safeCreateIndex('CREATE INDEX idx_impact_events_type ON impact_events(event_type);');
    await safeCreateIndex('CREATE INDEX idx_impact_events_created_at ON impact_events(created_at);');

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
    await query('DROP TABLE IF EXISTS impact_events;');
    await query('DROP TABLE IF EXISTS surplus_claims;');
    await query('DROP TABLE IF EXISTS surplus_listings;');
    await query('DROP TABLE IF EXISTS voucher_redemptions;');
    await query('DROP TABLE IF EXISTS vouchers;');
    await query('DROP TABLE IF EXISTS donations;');
    await query('DROP TABLE IF EXISTS support_requests;');
    await query('DROP TABLE IF EXISTS partner_staff;');
    await query('DROP TABLE IF EXISTS food_partners;');
    await query('DROP TABLE IF EXISTS beneficiary_profiles;');
    await query('DROP TABLE IF EXISTS users;');
    
    console.log('✅ All tables dropped successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
    throw error;
  }
}
