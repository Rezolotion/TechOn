import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { SpaceTypes, UserRoles, ReservationStatus, DemoUsers } from './core/models.js';
import { SecurityGuard, Permissions } from './security/rbac.js';
import { Sanitizer } from './security/sanitizer.js';
import { CateringService } from './services/CateringService.js';
import { PromoService } from './services/PromoService.js';
import { ReservationService } from './services/ReservationService.js';
import { AnalyticsService } from './services/AnalyticsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');

// Initialize Services
export const cateringService = new CateringService();
export const promoService = new PromoService();
export const reservationService = new ReservationService(cateringService, promoService);
export const analyticsService = new AnalyticsService(reservationService);

// Helper for JSON responses
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Role'
  });
  res.end(JSON.stringify(data));
}

// Parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({});
      }
    });
  });
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function serveStatic(req, res, pathname) {
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA if not found
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
}

export function createServer() {
  return http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Role'
      });
      res.end();
      return;
    }

    // Role detection from header
    const userRole = req.headers['x-user-role'] || UserRoles.CUSTOMER;

    try {
      // 1. Healthcheck
      if (pathname === '/api/health' && method === 'GET') {
        return sendJSON(res, 200, {
          status: 'UP',
          platform: 'TechOn',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          totalReservations: reservationService.reservations.length
        });
      }

      // 1.1 Auth Login
      if (pathname === '/api/auth/login' && method === 'POST') {
        const body = await parseBody(req);
        const { username, password } = body;
        const user = DemoUsers.find(u => u.username === (username || '').trim().toLowerCase());
        if (!user || user.password !== password) {
          return sendJSON(res, 401, {
            success: false,
            error: 'INVALID_CREDENTIALS',
            message: 'نام کاربری یا کلمه عبور وارد شده نادرست است.'
          });
        }
        const { password: _, ...userSafe } = user;
        return sendJSON(res, 200, {
          success: true,
          user: userSafe,
          token: `techon-token-${user.id}-${Date.now()}`
        });
      }

      // 1.2 Auth Users List (for fast demo switching)
      if (pathname === '/api/auth/users' && method === 'GET') {
        return sendJSON(res, 200, {
          success: true,
          users: DemoUsers.map(({ password, ...safe }) => safe)
        });
      }

      // 1.3 Customer: My Bookings
      if (pathname === '/api/my-reservations' && method === 'GET') {
        const phone = parsedUrl.searchParams.get('phone');
        const list = phone
          ? reservationService.reservations.filter(r => r.customer?.phone === phone)
          : reservationService.reservations;
        return sendJSON(res, 200, {
          success: true,
          reservations: list
        });
      }

      // 2. Spaces Catalog
      if (pathname === '/api/spaces' && method === 'GET') {
        return sendJSON(res, 200, {
          success: true,
          spaces: Object.entries(SpaceTypes).map(([key, space]) => ({
            key,
            ...space
          }))
        });
      }

      // 3. Catering Menu
      if (pathname === '/api/catering/menu' && method === 'GET') {
        return sendJSON(res, 200, {
          success: true,
          menu: cateringService.getMenu()
        });
      }

      // 4. Validate Promo Code
      if (pathname === '/api/promo/validate' && method === 'POST') {
        const body = await parseBody(req);
        const { code, subtotal, spaceKey } = body;
        const result = promoService.validateAndCalculateDiscount(code, Number(subtotal) || 0, spaceKey);
        return sendJSON(res, result.valid ? 200 : 400, result);
      }

      // 5. Create Reservation
      if (pathname === '/api/reservations' && method === 'POST') {
        const body = await parseBody(req);
        try {
          const result = reservationService.createReservation(body);
          return sendJSON(res, 201, {
            success: true,
            reservation: result.reservation,
            invoice: result.invoice
          });
        } catch (err) {
          return sendJSON(res, 400, {
            success: false,
            error: err.message
          });
        }
      }

      // 6. Admin / Operator: List Reservations with Role-Based Scoping
      if (pathname === '/api/admin/reservations' && method === 'GET') {
        if (!SecurityGuard.hasPermission(userRole, Permissions.VIEW_ALL_RESERVATIONS)) {
          return sendJSON(res, 403, {
            success: false,
            error: 'ACCESS_DENIED',
            message: 'دسترسی مشاهده تمام رزروها برای این نقش مجاز نیست.'
          });
        }

        let filtered = reservationService.reservations;
        if (userRole === UserRoles.COWORKING_OPERATOR) {
          // Coworking operator only manages desks & private rooms
          filtered = filtered.filter(r => r.spaceKey !== 'CONFERENCE_HALL');
        } else if (userRole === UserRoles.CAFE_OPERATOR) {
          // Cafe & Hall operator only manages halls and catering
          filtered = filtered.filter(r => r.spaceKey === 'CONFERENCE_HALL' || (r.catering && r.catering.length > 0));
        }

        return sendJSON(res, 200, {
          success: true,
          reservations: filtered,
          invoices: reservationService.invoices
        });
      }

      // 7. Admin / Operator: Approve Conference Hall Event
      if (pathname.startsWith('/api/admin/reservations/') && pathname.endsWith('/approve') && method === 'POST') {
        if (!SecurityGuard.hasPermission(userRole, Permissions.APPROVE_REJECT_HALL_RESERVATION)) {
          return sendJSON(res, 403, {
            success: false,
            error: 'ACCESS_DENIED',
            message: 'تنها اپراتور سالن و ادمین امکان تأیید رویدادهای همایش را دارند.'
          });
        }
        const idMatch = pathname.match(/\/api\/admin\/reservations\/([^/]+)\/approve/);
        const resId = idMatch ? idMatch[1] : null;
        try {
          const updated = reservationService.approveHallEvent(resId, userRole);
          return sendJSON(res, 200, { success: true, reservation: updated });
        } catch (err) {
          return sendJSON(res, 400, { success: false, error: err.message });
        }
      }

      // 8. Admin / Operator: Cancel Reservation
      if (pathname.startsWith('/api/admin/reservations/') && pathname.endsWith('/cancel') && method === 'POST') {
        const idMatch = pathname.match(/\/api\/admin\/reservations\/([^/]+)\/cancel/);
        const resId = idMatch ? idMatch[1] : null;
        const body = await parseBody(req);
        try {
          const updated = reservationService.cancelReservation(resId, body.reason, userRole);
          return sendJSON(res, 200, { success: true, reservation: updated });
        } catch (err) {
          return sendJSON(res, 400, { success: false, error: err.message });
        }
      }

      // 9. Admin / Operator: Add or update Catering Menu Item
      if (pathname === '/api/admin/catering/items' && method === 'POST') {
        if (!SecurityGuard.hasPermission(userRole, Permissions.MANAGE_CATERING_MENU)) {
          return sendJSON(res, 403, {
            success: false,
            error: 'ACCESS_DENIED',
            message: 'دسترسی مدیریت منوی کافه برای این نقش مجاز نیست.'
          });
        }
        const body = await parseBody(req);
        try {
          const item = body.id 
            ? cateringService.updateItem(body.id, body)
            : cateringService.addItem(body);
          return sendJSON(res, 200, { success: true, item });
        } catch (err) {
          return sendJSON(res, 400, { success: false, error: err.message });
        }
      }

      // 10. Super Admin: Create Promo Code
      if (pathname === '/api/admin/promos' && method === 'POST') {
        if (!SecurityGuard.hasPermission(userRole, Permissions.MANAGE_PROMO_CODES)) {
          return sendJSON(res, 403, {
            success: false,
            error: 'ACCESS_DENIED',
            message: 'فقط سوپرادمین امکان ایجاد کدهای تخفیف را دارد.'
          });
        }
        const body = await parseBody(req);
        try {
          const promo = promoService.createPromoCode(body);
          return sendJSON(res, 201, { success: true, promo });
        } catch (err) {
          return sendJSON(res, 400, { success: false, error: err.message });
        }
      }

      // 11. Super Admin / Financial Analytics & Revenue Share Report
      if (pathname === '/api/admin/analytics' && method === 'GET') {
        if (!SecurityGuard.hasPermission(userRole, Permissions.VIEW_FINANCIAL_REPORTS)) {
          return sendJSON(res, 403, {
            success: false,
            error: 'ACCESS_DENIED',
            message: 'دسترسی مشاهده گزارشات مالی مجاز نمی‌باشد.'
          });
        }
        const summary = analyticsService.getFinancialSummary();
        // Calculate Revenue Share (10% and 15%)
        const contractorShare10 = Math.round(summary.totalRevenue * 0.10);
        const contractorShare15 = Math.round(summary.totalRevenue * 0.15);
        return sendJSON(res, 200, {
          success: true,
          financials: summary,
          revenueShare: {
            rateMinPercentage: 10,
            rateMaxPercentage: 15,
            contractorShare10,
            contractorShare15,
            clientShare85: summary.totalRevenue - contractorShare15,
            clientShare90: summary.totalRevenue - contractorShare10
          },
          auditLogs: reservationService.auditLogs.slice(-20)
        });
      }

      // Serve static frontend files if not an API route
      if (!pathname.startsWith('/api/')) {
        return serveStatic(req, res, pathname);
      }

      // 404 for unknown API routes
      return sendJSON(res, 404, { success: false, error: 'API route not found' });

    } catch (fatalErr) {
      console.error('[Server Error]:', fatalErr);
      return sendJSON(res, 500, { success: false, error: 'Internal Server Error' });
    }
  });
}

// Start server when run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT || 3000;
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`🚀 TechOn Platform Server running at http://localhost:${PORT}`);
    console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
  });
}
