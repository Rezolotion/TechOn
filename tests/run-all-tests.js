/**
 * TechOn Platform - Unified Comprehensive Test Suite
 * Executes unit, service, security, and full HTTP REST API integration tests.
 */

import http from 'http';
import { SpaceTypes, UserRoles, ReservationStatus } from '../src/core/models.js';
import { SecurityGuard, Permissions } from '../src/security/rbac.js';
import { Sanitizer } from '../src/security/sanitizer.js';
import { CateringService } from '../src/services/CateringService.js';
import { PromoService } from '../src/services/PromoService.js';
import { ReservationService } from '../src/services/ReservationService.js';
import { AnalyticsService } from '../src/services/AnalyticsService.js';
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
  console.log('🧪 RUNNING TECHON FULL TEST SUITE');
  console.log('====================================================\n');

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
  const catering = new CateringService();
  const menu = catering.getMenu();
  assert(menu.length >= 6, 'Catering menu contains default packages & items');
  const catRes = catering.calculateCateringTotal([{ itemId: menu[0].id, quantity: 2 }]);
  assert(catRes.total === menu[0].price * 2, 'Catering subtotal exact calculation');

  const promo = new PromoService();
  const validPromo = promo.validateAndCalculateDiscount('TECHON2026', 1000000);
  assert(validPromo.valid && validPromo.discountAmount === 200000, '20% Promo discount calculated (200,000)');
  const cappedPromo = promo.validateAndCalculateDiscount('TECHON2026', 5000000);
  assert(cappedPromo.discountAmount === 500000, 'Promo discount max cap (500,000) enforced');

  // --- 4. Reservation & Invoicing Pipeline ---
  console.log('\n--- [4/5] Testing Reservation & Conflict Prevention ---');
  const resService = new ReservationService(catering, promo);
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

  // --- 5. Full HTTP REST API Integration Test ---
  console.log('\n--- [5/5] Testing HTTP REST API Server ---');
  const testServer = createServer();
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
    assert(promoRes.status === 200 && promoRes.data.discountAmount === 400000, 'POST /api/promo/validate returned discount');

    // 5.4 Public Frontend serving
    const htmlRes = await makeRequest(TEST_PORT, '/');
    assert(htmlRes.status === 200 && htmlRes.data.includes('تکـان'), 'Static GET / serves index.html with TechOn branding');

    // 5.5 Create Reservation API
    const apiBooking = await makeRequest(TEST_PORT, '/api/reservations', 'POST', {
      spaceKey: 'SHARED_DESK',
      bookingType: 'DAILY',
      duration: 1,
      startTime: new Date(Date.now() + 10000000).toISOString(),
      endTime: new Date(Date.now() + 15000000).toISOString(),
      customerName: 'توسعه‌دهنده سیستم',
      customerPhone: '09120001122'
    });
    assert(apiBooking.status === 201 && apiBooking.data.success, 'POST /api/reservations created reservation via REST API');

    // 5.6 Admin Analytics & Revenue Share API
    const analytics = await makeRequest(TEST_PORT, '/api/admin/analytics', 'GET', null, {
      'X-User-Role': 'SUPER_ADMIN'
    });
    assert(analytics.status === 200 && analytics.data.revenueShare.contractorShare10 > 0, 'GET /api/admin/analytics calculated contractor revenue share');

  } finally {
    await new Promise(resolve => testServer.close(resolve));
  }

  console.log('\n====================================================');
  console.log(`🏁 TEST SUITE RESULT: Passed: ${passed} | Failed: ${failed}`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch(err => {
  console.error('💥 FATAL ERROR IN TEST SUITE:', err);
  process.exit(1);
});
