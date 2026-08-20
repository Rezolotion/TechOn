/**
 * TechOn Platform - Unified Comprehensive Test Suite
 * Executes unit, service, security, database persistence, and full HTTP REST API integration tests.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { SpaceTypes, UserRoles, ReservationStatus } from '../src/core/models.js';
import { SecurityGuard, Permissions } from '../src/security/rbac.js';
import { Sanitizer } from '../src/security/sanitizer.js';
import { getDatabase } from '../src/db/database.js';
import { SpaceRepository } from '../src/repositories/SpaceRepository.js';
import { ReservationRepository } from '../src/repositories/ReservationRepository.js';
import { CateringRepository } from '../src/repositories/CateringRepository.js';
import { PromoRepository } from '../src/repositories/PromoRepository.js';
import { AuditRepository } from '../src/repositories/AuditRepository.js';
import { CateringService } from '../src/services/CateringService.js';
import { PromoService } from '../src/services/PromoService.js';
import { ReservationService } from '../src/services/ReservationService.js';
import { createServer } from '../src/server.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ [PASS]: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL]: ${testName}`);
    failed++;
  }
}

// HTTP request helper for tests
function makeRequest(port, path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = res.headers['content-type']?.includes('application/json')
            ? JSON.parse(data)
            : data;
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 RUNNING TECHON FULL TEST SUITE (WITH SQLITE DB)');
  console.log('====================================================\n');

  // Isolated Test Database
  const testDbPath = path.join(process.cwd(), 'data', 'techon_test.sqlite');
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
  const testDb = getDatabase(testDbPath);

  const spaceRepo = new SpaceRepository(testDb);
  const cateringRepo = new CateringRepository(testDb);
  const promoRepo = new PromoRepository(testDb);
  const auditRepo = new AuditRepository(testDb);
  const resRepo = new ReservationRepository(testDb);

  // --- 1. RBAC & Security ---
  console.log('--- [1/5] Testing RBAC & Security Layer ---');
  assert(SecurityGuard.hasPermission(UserRoles.SUPER_ADMIN, Permissions.MANAGE_PROMO_CODES), 'SuperAdmin has MANAGE_PROMO_CODES permission');
  assert(!SecurityGuard.hasPermission(UserRoles.CUSTOMER, Permissions.REVIEW_HALL_EVENTS), 'Customer cannot review hall events');
  assert(SecurityGuard.hasPermission(UserRoles.CAFE_OPERATOR, Permissions.MANAGE_CATERING_MENU), 'Cafe Operator can manage catering menu');
  assert(SecurityGuard.hasPermission(UserRoles.COWORKING_OPERATOR, Permissions.MANAGE_DESK_CAPACITY), 'Coworking Operator can manage desk capacity');

  // --- 2. Sanitizer & Validation ---
  console.log('\n--- [2/5] Testing Sanitization & Validator ---');
  const dirty = '<script>alert("hack")</script>رضا نیا‌منش';
  assert(!Sanitizer.cleanString(dirty).includes('<script>'), 'XSS script tags stripped');
  assert(Sanitizer.validateIranianPhone('09121112233'), 'Valid Iranian phone accepted (09121112233)');
  assert(!Sanitizer.validateIranianPhone('02188888888'), 'Landline phone rejected as mobile');
  assert(!Sanitizer.validateIranianPhone('12345'), 'Invalid short number rejected');

  // --- 3. Catering & Promo Logic ---
  console.log('\n--- [3/5] Testing Catering & Promo Calculation ---');
  const catering = new CateringService(cateringRepo);
  const menu = catering.getMenu();
  assert(menu.length >= 6, 'Catering menu contains default packages & items');
  const catRes = catering.calculateCateringTotal([{ itemId: menu[0].id, quantity: 2 }]);
  assert(catRes.total === menu[0].price * 2, 'Catering subtotal exact calculation');

  const promo = new PromoService(promoRepo);
  const validPromo = promo.validateAndCalculateDiscount('TECHON2026', 1000000);
  assert(validPromo.valid && validPromo.discountAmount === 200000, '20% Promo discount calculated (200,000)');
  const cappedPromo = promo.validateAndCalculateDiscount('TECHON2026', 5000000);
  assert(cappedPromo.discountAmount === 500000, 'Promo discount max cap (500,000) enforced');

  // --- 4. Reservation & Invoicing Pipeline ---
  console.log('\n--- [4/5] Testing Reservation & Conflict Prevention ---');
  const resService = new ReservationService(catering, promo, spaceRepo, resRepo, auditRepo);
  const start = new Date(Date.now() + 3600000).toISOString();
  const end = new Date(Date.now() + 7200000).toISOString();

  const booking = resService.createReservation({
    spaceKey: 'CONFERENCE_HALL',
    bookingType: 'HOURLY',
    duration: 2,
    startTime: start,
    endTime: end,
    customerName: 'رضا نیامنش',
    customerPhone: '09123456789',
    customerEmail: 'reza@techon.ir',
    eventTopic: 'رویداد هوش مصنوعی',
    equipment: ['recording', 'sound_system'],
    cateringOrders: [{ itemId: menu[0].id, quantity: 10 }],
    promoCode: 'TECHON2026'
  });

  assert(booking.reservation.id.startsWith('RES-'), 'Reservation ID generated');
  assert(booking.reservation.status === ReservationStatus.PENDING_REVIEW, 'Hall event initial status is PENDING_REVIEW');
  assert(booking.invoice.items.length === 4, 'Invoice contains 4 distinct line items');

  // Test double booking prevention
  let doubleBookingBlocked = false;
  try {
    resService.createReservation({
      spaceKey: 'CONFERENCE_HALL',
      bookingType: 'HOURLY',
      duration: 2,
      startTime: start,
      endTime: end,
      customerName: 'کاربر ۲',
      customerPhone: '09129990000'
    });
  } catch (err) {
    doubleBookingBlocked = true;
  }
  assert(doubleBookingBlocked, 'Double booking conflict successfully caught & blocked');

  // Test multi-slot hourly booking (5 hours day 1 + 2 hours day 2 = 7 hours total)
  const multiSlotBooking = resService.createReservation({
    spaceKey: 'SHARED_DESK',
    bookingType: 'HOURLY',
    timeSlots: [
      {
        date: '2026-09-08',
        startTime: '2026-09-08T13:00:00.000Z',
        endTime: '2026-09-08T18:00:00.000Z',
        hours: 5
      },
      {
        date: '2026-09-10',
        startTime: '2026-09-10T12:00:00.000Z',
        endTime: '2026-09-10T14:00:00.000Z',
        hours: 2
      }
    ],
    customerName: 'کاربر ساعتی چندگانه',
    customerPhone: '09125556677'
  });
  assert(multiSlotBooking.reservation.duration === 7, 'Multi-slot hourly booking correctly aggregated 7 total hours');
  assert(multiSlotBooking.reservation.pricing.spaceSubtotal === 40000 * 7, 'Multi-slot subtotal accurately calculated (40,000 * 7 = 280,000)');

  // Test multi-date daily booking (3 custom dates)
  const multiDateBooking = resService.createReservation({
    spaceKey: 'PRIVATE_OFFICE',
    bookingType: 'DAILY',
    dailySchedule: {
      mode: 'CUSTOM_DAYS',
      dates: ['2026-09-08', '2026-09-09', '2026-09-10'],
      daysCount: 3
    },
    customerName: 'کاربر روزانه ۳ روزه',
    customerPhone: '09127778899'
  });
  assert(multiDateBooking.reservation.duration === 3, 'Multi-date daily booking correctly calculated 3 days');
  assert(multiDateBooking.reservation.pricing.spaceSubtotal === 2400000 * 3, 'Multi-date subtotal accurately calculated (2,400,000 * 3 = 7,200,000)');

  // --- 5. Full HTTP REST API Integration Test ---
  console.log('\n--- [5/5] Testing HTTP REST API Server ---');
  const testServer = createServer({ db: testDb });
  const TEST_PORT = 3099;

  await new Promise(resolve => testServer.listen(TEST_PORT, resolve));

  try {
    // 5.1 Health check
    const health = await makeRequest(TEST_PORT, '/api/health');
    assert(health.status === 200 && health.data.status === 'UP', 'GET /api/health returned 200 UP');

    // 5.2 Spaces list
    const spaces = await makeRequest(TEST_PORT, '/api/spaces');
    assert(spaces.status === 200 && spaces.data.spaces.length >= 4, 'GET /api/spaces returned space catalog');

    // 5.3 Promo validation API
    const promoRes = await makeRequest(TEST_PORT, '/api/promo/validate', 'POST', {
      code: 'TECHON2026',
      subtotal: 2000000,
      spaceKey: 'CONFERENCE_HALL'
    });
    assert(promoRes.status === 200 && promoRes.data.valid, 'POST /api/promo/validate returned discount');

    // 5.4 Static file serving
    const staticIndex = await makeRequest(TEST_PORT, '/');
    assert(staticIndex.status === 200 && staticIndex.data.includes('TechOn'), 'Static GET / serves index.html with TechOn branding');

    // 5.5 Create reservation via API
    const createRes = await makeRequest(TEST_PORT, '/api/reservations', 'POST', {
      spaceKey: 'SHARED_DESK',
      bookingType: 'HOURLY',
      duration: 3,
      startTime: '2026-08-20T10:00:00.000Z',
      endTime: '2026-08-20T13:00:00.000Z',
      customerName: 'تست کننده وب',
      customerPhone: '09121234567'
    });
    assert(createRes.status === 201 && createRes.data.success, 'POST /api/reservations created reservation via REST API');

    // 5.6 Auth Login API
    const loginRes = await makeRequest(TEST_PORT, '/api/auth/login', 'POST', {
      username: 'admin',
      password: 'admin123'
    });
    assert(loginRes.status === 200 && loginRes.data.user.role === 'SUPER_ADMIN', 'POST /api/auth/login authenticated admin user');

    // 5.7 Auth Failure
    const badLogin = await makeRequest(TEST_PORT, '/api/auth/login', 'POST', {
      username: 'admin',
      password: 'wrongpassword'
    });
    assert(badLogin.status === 401, 'POST /api/auth/login rejected invalid credentials with 401');

    // 5.8 RBAC Endpoint protection
    const forbiddenRes = await makeRequest(TEST_PORT, '/api/admin/reservations', 'GET', null, {
      'x-user-role': 'CUSTOMER'
    });
    assert(forbiddenRes.status === 403, 'Customer role denied from GET /api/admin/reservations with 403 Forbidden');

    const analyticsForbidden = await makeRequest(TEST_PORT, '/api/admin/analytics', 'GET', null, {
      'x-user-role': 'CUSTOMER'
    });
    assert(analyticsForbidden.status === 403, 'Customer role denied from GET /api/admin/analytics with 403 Forbidden');

    const operatorForbidden = await makeRequest(TEST_PORT, '/api/admin/analytics', 'GET', null, {
      'x-user-role': 'COWORKING_OPERATOR'
    });
    assert(operatorForbidden.status === 403, 'Operator role denied from GET /api/admin/analytics with 403 Forbidden');

    // 5.9 Super Admin Analytics with contractor revenue share
    const analyticsRes = await makeRequest(TEST_PORT, '/api/admin/analytics', 'GET', null, {
      'x-user-role': 'SUPER_ADMIN'
    });
    assert(
      analyticsRes.status === 200 &&
      analyticsRes.data.revenueShare.contractorShare10 >= 0 &&
      analyticsRes.data.revenueShare.contractorShare15 >= 0,
      'SuperAdmin GET /api/admin/analytics calculated contractor revenue share'
    );

  } finally {
    testServer.close();
  }

  console.log('\n====================================================');
  console.log(`🏁 TEST SUITE RESULT: Passed: ${passed} | Failed: ${failed}`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('💥 FATAL ERROR IN TEST SUITE:', err);
  process.exit(1);
});
