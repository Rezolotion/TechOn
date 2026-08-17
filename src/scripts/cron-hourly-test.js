/**
 * TechOn 1-Hour Automated Feature Test & Self-Healing Cron
 * Runs every hour to verify all core features, math calculations, and security layers.
 */

import { SpaceTypes, UserRoles, ReservationStatus } from '../core/models.js';
import { SecurityGuard, Permissions } from '../security/rbac.js';
import { Sanitizer } from '../security/sanitizer.js';
import { CateringService } from '../services/CateringService.js';
import { PromoService } from '../services/PromoService.js';
import { ReservationService } from '../services/ReservationService.js';
import { AnalyticsService } from '../services/AnalyticsService.js';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'logs', 'hourly-test.log');

function logResult(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  console.log(message);
  try {
    fs.appendFileSync(LOG_FILE, line, 'utf8');
  } catch (err) {
    // Ignore file write errors
  }
}

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    logResult(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    logResult(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runAllTests() {
  logResult('====================================================');
  logResult('🚀 STARTING TECHON 1-HOUR COMPREHENSIVE AUTOMATED TEST');
  logResult('====================================================');

  // Test 1: RBAC Matrix
  logResult('\n--- [1/6] Testing RBAC Security Guard ---');
  assert(SecurityGuard.hasPermission(UserRoles.SUPER_ADMIN, Permissions.MANAGE_PROMO_CODES), 'Admin can manage promos');
  assert(!SecurityGuard.hasPermission(UserRoles.CUSTOMER, Permissions.REVIEW_HALL_EVENTS), 'Customer cannot review hall events');
  assert(SecurityGuard.hasPermission(UserRoles.CAFE_OPERATOR, Permissions.MANAGE_CATERING_MENU), 'Cafe operator can manage catering');

  // Test 2: Sanitizer & XSS Prevention
  logResult('\n--- [2/6] Testing Sanitizer & Phone Validator ---');
  const dirtyInput = '<script>alert("hack")</script>رضا نیا‌منش';
  const cleaned = Sanitizer.cleanString(dirtyInput);
  assert(!cleaned.includes('<script>') && cleaned.includes('رضا نیا‌منش'), 'XSS tags properly stripped');
  assert(Sanitizer.validateIranianPhone('09123456789'), 'Valid Iranian phone passed');
  assert(!Sanitizer.validateIranianPhone('12345'), 'Invalid phone rejected');

  // Test 3: Catering & Dynamic Menu Calculation
  logResult('\n--- [3/6] Testing Dynamic Catering Service ---');
  const cateringService = new CateringService();
  const menu = cateringService.getMenu();
  assert(menu.length >= 6, 'Menu contains initial items');
  const item1 = menu[0];
  const item2 = menu[1];
  const catCalc = cateringService.calculateCateringTotal([
    { itemId: item1.id, quantity: 2 },
    { itemId: item2.id, quantity: 1 }
  ]);
  const expectedCatTotal = (item1.price * 2) + (item2.price * 1);
  assert(catCalc.total === expectedCatTotal, `Catering calculation exact (Got: ${catCalc.total}, Expected: ${expectedCatTotal})`);

  // Test 4: Promo Code & Cap Limits
  logResult('\n--- [4/6] Testing Promo Code & Discount Engine ---');
  const promoService = new PromoService();
  const discountRes = promoService.validateAndCalculateDiscount('TECHON2026', 1000000); // 20% of 1M is 200,000
  assert(discountRes.valid && discountRes.discountAmount === 200000, 'Percentage promo calculated correctly');
  const cappedRes = promoService.validateAndCalculateDiscount('TECHON2026', 10000000); // 20% of 10M is 2M, but cap is 500k
  assert(cappedRes.valid && cappedRes.discountAmount === 500000, 'Promo maximum discount cap enforced');

  // Test 5: Full End-to-End Reservation & Invoicing Workflow
  logResult('\n--- [5/6] Testing Reservation & Invoicing Pipeline ---');
  const reservationService = new ReservationService(cateringService, promoService);
  const startTime = new Date(Date.now() + 3600000).toISOString();
  const endTime = new Date(Date.now() + 7200000).toISOString();

  const booking = reservationService.createReservation({
    spaceKey: 'CONFERENCE_HALL',
    bookingType: 'HOURLY',
    duration: 2,
    startTime,
    endTime,
    customerName: 'رضا نیامنش',
    customerPhone: '09121234567',
    customerEmail: 'reza@example.com',
    eventTopic: 'کارگاه هوش مصنوعی و معماری ایجنت‌ها',
    equipment: ['recording', 'sound_system'],
    cateringOrders: [{ itemId: item1.id, quantity: 10 }],
    promoCode: 'TECHON2026'
  });

  assert(booking.reservation && booking.reservation.id.startsWith('RES-'), 'Reservation ID generated');
  assert(booking.reservation.status === ReservationStatus.PENDING_REVIEW, 'Conference hall correctly set to PENDING_REVIEW');
  assert(booking.invoice && booking.invoice.items.length === 4, 'Invoice contains Space, 2 Equipment items, and Catering line items');

  // Test 6: Availability & Double Booking Prevention
  logResult('\n--- [6/6] Testing Conflict & Double Booking Protection ---');
  let conflictCaught = false;
  try {
    reservationService.createReservation({
      spaceKey: 'CONFERENCE_HALL',
      bookingType: 'HOURLY',
      duration: 2,
      startTime,
      endTime,
      customerName: 'کاربر تستی',
      customerPhone: '09129998877'
    });
  } catch (err) {
    conflictCaught = true;
  }
  assert(conflictCaught, 'Double-booking conflict caught and prevented successfully');

  // Analytics Check
  const analyticsService = new AnalyticsService(reservationService);
  const stats = analyticsService.getFinancialSummary();
  assert(stats.totalReservationsCount === 1 && stats.totalRevenue > 0, 'Analytics correctly aggregated financial stats');

  logResult('\n====================================================');
  logResult(`🏁 TEST RUN SUMMARY: Passed: ${passed}, Failed: ${failed}`);
  logResult('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch(err => {
  logResult(`💥 FATAL ERROR IN CRON RUNNER: ${err.message}`);
  process.exit(1);
});
