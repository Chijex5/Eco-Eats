/**
 * Database Seed Script
 * Creates test data for all user roles and entities
 * Usage: npm run seed
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { query, closePool } from '../lib/db/connection';
import { createTables } from '../lib/db/schema';
import { generateId } from '../lib/db/ids';

// Helper function to generate short unique codes
// Uses UUID to ensure uniqueness, then takes first N characters
// Note: prefix + length should not exceed database column limits
function generateShortCode(prefix: string, length: number = 8): string {
  // Use UUID to ensure uniqueness, then take first N characters
  const uuid = generateId().replace(/-/g, '').toUpperCase();
  return prefix + uuid.substring(0, length);
}

// Test user data for each role
// WARNING: These use weak passwords for testing ONLY
// NEVER use these patterns in production!
const TEST_USERS = [
  {
    full_name: 'Alice Beneficiary',
    email: 'alice@beneficiary.test',
    password: 'password123',
    role: 'BENEFICIARY' as const,
    phone: '+2348012345671',
  },
  {
    full_name: 'Bob Beneficiary',
    email: 'bob@beneficiary.test',
    password: 'password123',
    role: 'BENEFICIARY' as const,
    phone: '+2348012345672',
  },
  {
    full_name: 'Charlie Donor',
    email: 'charlie@donor.test',
    password: 'password123',
    role: 'DONOR' as const,
    phone: '+2348012345673',
  },
  {
    full_name: 'Diana Donor',
    email: 'diana@donor.test',
    password: 'password123',
    role: 'DONOR' as const,
    phone: '+2348012345674',
  },
  {
    full_name: 'Eric Partner Owner',
    email: 'eric@partner.test',
    password: 'password123',
    role: 'PARTNER_OWNER' as const,
    phone: '+2348012345675',
  },
  {
    full_name: 'Frank Staff',
    email: 'frank@staff.test',
    password: 'password123',
    role: 'PARTNER_STAFF' as const,
    phone: '+2348012345676',
  },
  {
    full_name: 'Grace Admin',
    email: 'grace@admin.test',
    password: 'password123',
    role: 'ADMIN' as const,
    phone: '+2348012345677',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Step 1: Create tables if they don't exist
    console.log('📊 Creating tables...');
    await createTables();

    // Step 2: Create users
    console.log('\n👥 Creating test users...');
    const userIds: Record<string, string> = {};
    
    for (const userData of TEST_USERS) {
      const userId = generateId();
      const passwordHash = await bcrypt.hash(userData.password, 10);
      
      await query(
        `INSERT INTO users (id, full_name, email, password_hash, role, phone, is_email_verified)
         VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
        [userId, userData.full_name, userData.email, passwordHash, userData.role, userData.phone]
      );
      
      userIds[userData.email] = userId;
      console.log(`  ✓ Created ${userData.role}: ${userData.email} (password: ${userData.password})`);
    }

    // Step 3: Create beneficiary profiles
    console.log('\n🎓 Creating beneficiary profiles...');
    await query(
      `INSERT INTO beneficiary_profiles (user_id, affiliation, location_text, need_level, verified_status)
       VALUES (?, ?, ?, ?, ?)`,
      [userIds['alice@beneficiary.test'], 'STUDENT', 'University of Lagos, Akoka', 'HIGH', 'VERIFIED']
    );
    console.log('  ✓ Created profile for Alice (Student, High need)');

    await query(
      `INSERT INTO beneficiary_profiles (user_id, affiliation, location_text, need_level, verified_status)
       VALUES (?, ?, ?, ?, ?)`,
      [userIds['bob@beneficiary.test'], 'COMMUNITY', 'Yaba, Lagos', 'MED', 'VERIFIED']
    );
    console.log('  ✓ Created profile for Bob (Community, Medium need)');

    // Step 4: Create food partners
    console.log('\n🍽️  Creating food partners...');
    const partnerId1 = generateId();
    await query(
      `INSERT INTO food_partners (id, owner_user_id, name, description, location_text, lat, lng, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        partnerId1,
        userIds['eric@partner.test'],
        'Campus Cafeteria',
        'Student-friendly meals and snacks',
        'UNILAG Campus, Akoka',
        6.5174,
        3.3895,
        'APPROVED'
      ]
    );
    console.log('  ✓ Created partner: Campus Cafeteria');

    const partnerId2 = generateId();
    await query(
      `INSERT INTO food_partners (id, owner_user_id, name, description, location_text, lat, lng, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        partnerId2,
        userIds['eric@partner.test'],
        'Quick Bite Restaurant',
        'Fast food and local dishes',
        'Yaba, Lagos',
        6.5074,
        3.3725,
        'APPROVED'
      ]
    );
    console.log('  ✓ Created partner: Quick Bite Restaurant');

    // Step 5: Create partner staff associations
    console.log('\n👷 Creating partner staff associations...');
    const staffId = generateId();
    await query(
      `INSERT INTO partner_staff (id, partner_id, user_id, staff_role, can_redeem, can_post_surplus)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [staffId, partnerId1, userIds['frank@staff.test'], 'CASHIER', true, true]
    );
    console.log('  ✓ Associated Frank with Campus Cafeteria as Cashier');

    // Step 6: Create support requests
    console.log('\n📝 Creating support requests...');
    const requestId1 = generateId();
    await query(
      `INSERT INTO support_requests (id, beneficiary_user_id, request_type, message, urgency, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        requestId1,
        userIds['alice@beneficiary.test'],
        'VOUCHER',
        'I need help with meals for this week. Running low on funds after paying school fees.',
        'HIGH',
        'PENDING'
      ]
    );
    console.log('  ✓ Created PENDING request from Alice');

    const requestId2 = generateId();
    await query(
      `INSERT INTO support_requests (id, beneficiary_user_id, request_type, message, urgency, status, reviewed_by, reviewed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        requestId2,
        userIds['bob@beneficiary.test'],
        'VOUCHER',
        'Need assistance with food this month.',
        'MED',
        'APPROVED',
        userIds['grace@admin.test']
      ]
    );
    console.log('  ✓ Created APPROVED request from Bob');

    const requestId3 = generateId();
    await query(
      `INSERT INTO support_requests (id, beneficiary_user_id, request_type, message, urgency, status, reviewed_by, reviewed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        requestId3,
        userIds['alice@beneficiary.test'],
        'FOOD_PACK',
        'Looking for food packs if available.',
        'LOW',
        'FULFILLED',
        userIds['grace@admin.test']
      ]
    );
    console.log('  ✓ Created FULFILLED request from Alice');

    // Step 7: Create vouchers
    console.log('\n🎫 Creating vouchers...');
    const voucherId1 = generateId();
    const code1 = generateShortCode('ECO', 8);
    const qrToken1 = generateId();
    await query(
      `INSERT INTO vouchers (id, code, qr_token, value_kobo, beneficiary_user_id, issued_by_admin_id, status, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`,
      [
        voucherId1,
        code1,
        qrToken1,
        500000, // 5000 NGN
        userIds['bob@beneficiary.test'],
        userIds['grace@admin.test'],
        'ACTIVE'
      ]
    );
    console.log(`  ✓ Created ACTIVE voucher for Bob: ${code1} (₦5,000)`);

    const voucherId2 = generateId();
    const code2 = generateShortCode('ECO', 8);
    const qrToken2 = generateId();
    await query(
      `INSERT INTO vouchers (id, code, qr_token, value_kobo, beneficiary_user_id, issued_by_admin_id, status, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))`,
      [
        voucherId2,
        code2,
        qrToken2,
        300000, // 3000 NGN
        userIds['alice@beneficiary.test'],
        userIds['grace@admin.test'],
        'REDEEMED'
      ]
    );
    console.log(`  ✓ Created REDEEMED voucher for Alice: ${code2} (₦3,000)`);

    // Step 8: Create voucher redemption
    console.log('\n💰 Creating voucher redemption...');
    const redemptionId = generateId();
    await query(
      `INSERT INTO voucher_redemptions (id, voucher_id, partner_id, redeemed_by_user_id, confirmed_by_staff_id, value_kobo, meal_description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        redemptionId,
        voucherId2,
        partnerId1,
        userIds['alice@beneficiary.test'],
        userIds['frank@staff.test'],
        300000,
        'Rice and chicken with salad'
      ]
    );
    console.log("  ✓ Created redemption record for Alice's voucher at Campus Cafeteria");

    // Step 9: Create donations
    console.log('\n💝 Creating donations...');
    const donationId1 = generateId();
    await query(
      `INSERT INTO donations (id, donor_user_id, amount_kobo, currency, donation_type, status, payment_ref)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        donationId1,
        userIds['charlie@donor.test'],
        10000000, // 100,000 NGN
        'NGN',
        'ONE_TIME',
        'COMPLETED',
        'PAY-' + generateId()
      ]
    );
    console.log('  ✓ Created completed donation from Charlie (₦100,000)');

    const donationId2 = generateId();
    await query(
      `INSERT INTO donations (id, donor_user_id, amount_kobo, currency, donation_type, status, payment_ref)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        donationId2,
        userIds['diana@donor.test'],
        5000000, // 50,000 NGN
        'NGN',
        'MONTHLY',
        'COMPLETED',
        'PAY-' + generateId()
      ]
    );
    console.log('  ✓ Created completed donation from Diana (₦50,000)');

    // Step 10: Create surplus listings
    console.log('\n🥡 Creating surplus listings...');
    const surplusId1 = generateId();
    await query(
      `INSERT INTO surplus_listings (id, partner_id, title, description, quantity_available, claim_limit_per_user, pickup_deadline, status)
       VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 2 DAY), ?)`,
      [
        surplusId1,
        partnerId1,
        'Fresh bread and pastries',
        'End of day bakery items, still fresh and good quality',
        20,
        2,
        'ACTIVE'
      ]
    );
    console.log('  ✓ Created active surplus listing: Fresh bread and pastries');

    const surplusId2 = generateId();
    await query(
      `INSERT INTO surplus_listings (id, partner_id, title, description, quantity_available, claim_limit_per_user, pickup_deadline, status)
       VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY), ?)`,
      [
        surplusId2,
        partnerId2,
        'Leftover lunch packs',
        'Prepared lunch boxes from today, must be picked up by evening',
        10,
        1,
        'ACTIVE'
      ]
    );
    console.log('  ✓ Created active surplus listing: Leftover lunch packs');

    // Step 11: Create surplus claims
    console.log('\n📦 Creating surplus claims...');
    const claimId = generateId();
    const pickupCode = generateShortCode('PK', 6);
    await query(
      `INSERT INTO surplus_claims (id, listing_id, beneficiary_user_id, status, pickup_code)
       VALUES (?, ?, ?, ?, ?)`,
      [
        claimId,
        surplusId1,
        userIds['bob@beneficiary.test'],
        'PENDING',
        pickupCode
      ]
    );
    console.log(`  ✓ Created surplus claim by Bob (pickup code: ${pickupCode})`);

    // Step 12: Create impact events
    console.log('\n📊 Creating impact events...');
    await query(
      `INSERT INTO impact_events (id, event_type, related_id, count)
       VALUES (?, ?, ?, ?)`,
      [generateId(), 'REQUEST_APPROVED', requestId2, 1]
    );
    await query(
      `INSERT INTO impact_events (id, event_type, related_id, count)
       VALUES (?, ?, ?, ?)`,
      [generateId(), 'MEAL_SERVED', redemptionId, 1]
    );
    await query(
      `INSERT INTO impact_events (id, event_type, related_id, count)
       VALUES (?, ?, ?, ?)`,
      [generateId(), 'PACK_CLAIMED', claimId, 1]
    );
    console.log('  ✓ Created impact events for tracking');

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📝 Test Credentials:');
    console.log('==========================================');
    console.log('Beneficiary 1: alice@beneficiary.test / password123');
    console.log('Beneficiary 2: bob@beneficiary.test / password123');
    console.log('Donor 1: charlie@donor.test / password123');
    console.log('Donor 2: diana@donor.test / password123');
    console.log('Partner Owner: eric@partner.test / password123');
    console.log('Partner Staff: frank@staff.test / password123');
    console.log('Admin: grace@admin.test / password123');
    console.log('==========================================\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await closePool();
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('🎉 Seeding process finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  });
