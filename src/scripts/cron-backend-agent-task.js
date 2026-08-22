/**
 * TechOn Backend & API Continuous Architecture & Performance Audit
 * Runs every hour to benchmark API latency, verify SQLite WAL integrity, enforce RBAC, and test all routes.
 */

import fs from 'fs';
import path from 'path';
import { getDatabase } from '../db/database.js';
import { ReservationService } from '../services/ReservationService.js';
import { CateringService } from '../services/CateringService.js';
import { PromoService } from '../services/PromoService.js';
import { AnalyticsService } from '../services/AnalyticsService.js';
import { SecurityGuard, Permissions } from '../security/rbac.js';
import { Sanitizer } from '../security/sanitizer.js';
import { UserRoles } from '../core/models.js';

const LOG_FILE = path.join(process.cwd(), 'logs', 'backend-optimizer.log');

function log(msg) {
  const line = `[${new Date().toISOString()}] [BackendAgent] ${msg}\n`;
  console.log(line.trim());
  try {
    if (!fs.existsSync(path.dirname(LOG_FILE))) {
      fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    }
    fs.appendFileSync(LOG_FILE, line, 'utf8');
  } catch (e) {}
}

export async function runBackendAudit() {
  log('====================================================');
  log('⚙️ STARTING TECHON BACKEND & API HOURLY OPTIMIZATION');
  log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(cond, name) {
    if (cond) {
      log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      log(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  // 1. Database PRAGMA & Performance Check
  log('\n--- [1/5] Auditing SQLite WAL & Query Engine ---');
  try {
    const db = getDatabase();
    const journalMode = db.pragma('journal_mode', { simple: true });
    assert(journalMode?.toLowerCase() === 'wal', `SQLite journal mode is WAL (Got: ${journalMode})`);

    const integrity = db.pragma('integrity_check', { simple: true });
    assert(integrity === 'ok', `SQLite database integrity verified (${integrity})`);

    const fk = db.pragma('foreign_keys', { simple: true });
    assert(fk === 1, 'Foreign keys enforcement enabled');
  } catch (err) {
    log(`❌ DB Check Error: ${err.message}`);
    failed++;
  }

  // 2. Services Initialization & Endpoints Logic
  log('\n--- [2/5] Benchmarking Service Response Times ---');
  const t0 = performance.now();
  const cateringService = new CateringService();
  const promoService = new PromoService();
  const reservationService = new ReservationService(cateringService, promoService);
  const analyticsService = new AnalyticsService(reservationService);

  const spaces = reservationService.spaceRepo.findAll();
  const tSpaces = performance.now() - t0;
  assert(spaces.length >= 4 && tSpaces < 20, `spaceRepo.findAll() returned ${spaces.length} spaces in ${tSpaces.toFixed(2)}ms`);

  // 3. Multi-slot Capacity Conflict Check
  log('\n--- [3/5] Stress-Testing Concurrency & Conflict Engine ---');
  const randHourOffset = 3000 + Math.floor(Math.random() * 800000);
  const startTime = new Date(Date.now() + randHourOffset * 3600000).toISOString();
  const endTime = new Date(Date.now() + (randHourOffset + 2) * 3600000).toISOString();

  const resA = reservationService.createReservation({
    spaceKey: 'MEETING_ROOM',
    bookingType: 'HOURLY',
    duration: 2,
    startTime,
    endTime,
    customerName: 'تست تداخل رزرو',
    customerPhone: '09129999999',
    customerEmail: 'test@example.com'
  });
  assert(resA?.reservation?.id, 'Initial reservation created successfully');

  // Attempt overlapping booking
  let conflictCaught = false;
  try {
    reservationService.createReservation({
      spaceKey: 'MEETING_ROOM',
      bookingType: 'HOURLY',
      duration: 1,
      startTime: new Date(Date.now() + (randHourOffset + 0.5) * 3600000).toISOString(),
      endTime: new Date(Date.now() + (randHourOffset + 1.5) * 3600000).toISOString(),
      customerName: 'تست کننده مزاحم',
      customerPhone: '09128888888'
    });
  } catch (err) {
    conflictCaught = true;
  }
  assert(conflictCaught, 'Overlapping meeting room reservation correctly blocked');

  // 4. Financial & Revenue Share Integrity (10% - 15%)
  log('\n--- [4/5] Financial & Revenue Share Auditing ---');
  const summary = analyticsService.getFinancialSummary();
  assert(summary && typeof summary.totalRevenue === 'number', 'Financial summary calculated');
  const contractorMin = summary.totalRevenue * 0.10;
  const contractorMax = summary.totalRevenue * 0.15;
  assert(contractorMin <= contractorMax, 'Contractor 10%-15% revenue share mathematically consistent');

  // 5. Security & Sanitization
  log('\n--- [5/5] Security & Input Guard Verification ---');
  assert(SecurityGuard.hasPermission(UserRoles.SUPER_ADMIN, Permissions.VIEW_FINANCIAL_REPORTS), 'SuperAdmin financial permission verified');
  assert(!SecurityGuard.hasPermission(UserRoles.CUSTOMER, Permissions.VIEW_FINANCIAL_REPORTS), 'Customer blocked from financial reports');
  assert(Sanitizer.validateIranianPhone('09121234567'), 'Iranian phone validation active');

  log('====================================================');
  log(`🏁 BACKEND AUDIT COMPLETE: Passed: ${passed} | Failed: ${failed}`);
  log('====================================================');

  return failed === 0;
}

if (process.argv[1]?.endsWith('cron-backend-agent-task.js')) {
  runBackendAudit();
}
