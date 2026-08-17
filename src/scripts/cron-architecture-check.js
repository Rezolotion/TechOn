/**
 * TechOn Architectural Compliance & Integrity Guardian Cron
 * Runs periodically to ensure the project never drifts from clean architecture,
 * domain separation, security constraints, and foundational principles.
 */

import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'logs', 'architecture-audit.log');
const PROJECT_ROOT = process.cwd();

function logAudit(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  console.log(message);
  try {
    fs.appendFileSync(LOG_FILE, line, 'utf8');
  } catch (err) {}
}

const REQUIRED_DIRS = [
  'src/core',
  'src/services',
  'src/security',
  'src/scripts',
  'src/public',
  'docs',
  'logs'
];

const REQUIRED_DOCS = [
  'GEMINI.md',
  'README.md',
  'package.json',
  'docs/business-contract.md',
  'docs/ecosystem-tools.md'
];

const REQUIRED_CODE_FILES = [
  'src/core/models.js',
  'src/security/rbac.js',
  'src/security/sanitizer.js',
  'src/services/ReservationService.js',
  'src/services/CateringService.js',
  'src/services/PromoService.js',
  'src/services/AnalyticsService.js'
];

let checksTotal = 0;
let checksPassed = 0;

function evaluateCheck(condition, description) {
  checksTotal++;
  if (condition) {
    logAudit(`  🛡️ [VALID]: ${description}`);
    checksPassed++;
  } else {
    logAudit(`  ⚠️ [VIOLATION]: ${description}`);
  }
}

async function runArchitecturalAudit() {
  logAudit('====================================================');
  logAudit('🔍 STARTING TECHON ARCHITECTURAL INTEGRITY AUDIT');
  logAudit('====================================================');

  // Rule 1: Scaffolding Directory Structure
  logAudit('\n--- [1/4] Auditing Scaffolding & Directory Integrity ---');
  for (const dir of REQUIRED_DIRS) {
    const fullPath = path.join(PROJECT_ROOT, dir);
    const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
    evaluateCheck(exists, `Directory structure present: ${dir}`);
  }

  // Rule 2: Core Documentation & Contract Files
  logAudit('\n--- [2/4] Auditing Foundation Specs & Business Documents ---');
  for (const doc of REQUIRED_DOCS) {
    const fullPath = path.join(PROJECT_ROOT, doc);
    const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
    evaluateCheck(exists, `Essential specification file present: ${doc}`);
  }

  // Rule 3: Clean Architecture Modules & Separation of Concerns
  logAudit('\n--- [3/4] Auditing Clean Architecture & Service Layer ---');
  for (const file of REQUIRED_CODE_FILES) {
    const fullPath = path.join(PROJECT_ROOT, file);
    const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
    evaluateCheck(exists, `Service/Core module exists: ${file}`);
  }

  // Rule 4: Security & Domain Coupling Verification
  logAudit('\n--- [4/4] Auditing Security Rules & Sanitization Enforcement ---');
  const resServiceContent = fs.readFileSync(path.join(PROJECT_ROOT, 'src/services/ReservationService.js'), 'utf8');
  const sanitizerContent = fs.readFileSync(path.join(PROJECT_ROOT, 'src/security/sanitizer.js'), 'utf8');
  const rbacContent = fs.readFileSync(path.join(PROJECT_ROOT, 'src/security/rbac.js'), 'utf8');

  evaluateCheck(resServiceContent.includes('Sanitizer.sanitizeObject'), 'ReservationService enforces input sanitization');
  evaluateCheck(resServiceContent.includes('checkAvailability'), 'ReservationService enforces capacity conflict checking');
  evaluateCheck(sanitizerContent.includes('validateIranianPhone'), 'Security layer validates Iranian phone formats');
  evaluateCheck(rbacContent.includes('MANAGE_PROMO_CODES'), 'RBAC permissions matrix strictly defined');

  const complianceScore = Math.round((checksPassed / checksTotal) * 100);
  logAudit('\n====================================================');
  logAudit(`📊 AUDIT SUMMARY: Passed: ${checksPassed}/${checksTotal} | Architectural Compliance: ${complianceScore}%`);
  logAudit('====================================================\n');

  if (complianceScore < 100) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runArchitecturalAudit().catch(err => {
  logAudit(`💥 FATAL AUDIT ERROR: ${err.message}`);
  process.exit(1);
});
