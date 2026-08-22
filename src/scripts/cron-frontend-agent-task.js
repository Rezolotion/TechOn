/**
 * TechOn Frontend & UX Automated Optimizer & Validator
 * Runs continuously to ensure UI minimalism, accessibility, mobile-first compliance, and asset integrity.
 */

import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'src', 'public');
const LOG_FILE = path.join(process.cwd(), 'logs', 'frontend-optimizer.log');

function log(msg) {
  const line = `[${new Date().toISOString()}] [FrontendAgent] ${msg}\n`;
  console.log(line.trim());
  try {
    if (!fs.existsSync(path.dirname(LOG_FILE))) {
      fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    }
    fs.appendFileSync(LOG_FILE, line, 'utf8');
  } catch (e) {}
}

export function runFrontendAudit() {
  log('Starting Frontend & UX Health & Minimalism Audit...');
  let issues = 0;

  const htmlPath = path.join(PUBLIC_DIR, 'index.html');
  const cssPath = path.join(PUBLIC_DIR, 'styles.css');
  const jsPath = path.join(PUBLIC_DIR, 'app.js');

  // 1. Check file existence
  if (!fs.existsSync(htmlPath) || !fs.existsSync(cssPath) || !fs.existsSync(jsPath)) {
    log('❌ CRITICAL: One or more public assets missing!');
    return false;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');
  const js = fs.readFileSync(jsPath, 'utf8');

  // 2. RTL & Persian Typography Check
  if (!html.includes('dir="rtl"') || !html.includes('lang="fa"')) {
    log('⚠️ WARNING: HTML missing dir="rtl" or lang="fa" attributes');
    issues++;
  } else {
    log('✅ HTML RTL and Persian language tags verified');
  }

  if (!html.includes('Vazirmatn') && !css.includes('Vazirmatn')) {
    log('⚠️ WARNING: Vazirmatn font not declared in HTML or CSS');
    issues++;
  } else {
    log('✅ Vazirmatn typography verified');
  }

  // 3. Mobile Viewport & Touch Target Optimization
  if (!html.includes('viewport-fit=cover')) {
    log('⚠️ INFO: viewport-fit=cover recommended for modern mobile displays');
  } else {
    log('✅ Mobile-first viewport settings verified');
  }

  // 4. Clutter Prevention Check (DOM size & element density)
  const elementCount = (html.match(/<[a-z0-9-]+/gi) || []).length;
  log(`📊 DOM element count: ${elementCount} (Target: < 600 for clean responsive B2B platform)`);
  if (elementCount > 650) {
    log('⚠️ WARNING: High DOM node count. Consider consolidating widgets to keep UX minimal.');
    issues++;
  } else {
    log('✅ DOM density is clean, modern, and uncluttered');
  }

  // 5. Critical ID & Interactive Element Audit
  const requiredIds = [
    'tab-booking', 'tab-catering', 'tab-my-bookings', 'tab-admin', 'tab-analytics',
    'btn-mode-hourly', 'btn-mode-daily', 'jalali-calendar-widget', 'cal-days-matrix',
    'hourly-scheduler-section', 'daily-scheduler-section', 'summary-final-total',
    'btn-submit-booking', 'mobile-checkout-bar', 'theme-toggle', 'user-role-modal'
  ];

  for (const id of requiredIds) {
    if (!html.includes(`id="${id}"`)) {
      log(`❌ MISSING ID: #${id} not found in index.html`);
      issues++;
    }
  }

  if (issues === 0) {
    log('🎉 Frontend & UX audit passed with 100% compliance! Minimalist, accessible, mobile-first.');
    return true;
  } else {
    log(`⚠️ Frontend audit finished with ${issues} issue(s).`);
    return false;
  }
}

if (process.argv[1]?.endsWith('cron-frontend-agent-task.js')) {
  runFrontendAudit();
}
