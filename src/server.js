import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Config } from './config/config.js';
import { getDatabase } from './db/database.js';
import { SpaceRepository } from './repositories/SpaceRepository.js';
import { ReservationRepository } from './repositories/ReservationRepository.js';
import { CateringRepository } from './repositories/CateringRepository.js';
import { PromoRepository } from './repositories/PromoRepository.js';
import { UserRepository } from './repositories/UserRepository.js';
import { AuditRepository } from './repositories/AuditRepository.js';
import { CateringService } from './services/CateringService.js';
import { PromoService } from './services/PromoService.js';
import { ReservationService } from './services/ReservationService.js';
import { SpaceController } from './controllers/SpaceController.js';
import { ReservationController } from './controllers/ReservationController.js';
import { CateringController } from './controllers/CateringController.js';
import { PromoController } from './controllers/PromoController.js';
import { AdminController } from './controllers/AdminController.js';
import { AuthController } from './controllers/AuthController.js';
import { UserRoles } from './core/models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer(options = {}) {
  const db = options.db || getDatabase(options.dbPath || Config.DB_PATH);

  // Initialize Repositories
  const spaceRepo = new SpaceRepository(db);
  const cateringRepo = new CateringRepository(db);
  const promoRepo = new PromoRepository(db);
  const userRepo = new UserRepository(db);
  const auditRepo = new AuditRepository(db);
  const resRepo = new ReservationRepository(db);

  // Initialize Services
  const cateringService = new CateringService(cateringRepo);
  const promoService = new PromoService(promoRepo);
  const resService = new ReservationService(cateringService, promoService, spaceRepo, resRepo, auditRepo);

  // Initialize Controllers
  const spaceController = new SpaceController(spaceRepo);
  const resController = new ReservationController(resService);
  const cateringController = new CateringController(cateringService);
  const promoController = new PromoController(promoService);
  const adminController = new AdminController(resService);
  const authController = new AuthController();

  const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const server = http.createServer(async (req, res) => {
    // Security & CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Role, Authorization');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    const userRole = req.headers['x-user-role'] || UserRoles.CUSTOMER;

    // Helper to send JSON responses
    const sendJson = (status, payload) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify(payload));
    };

    // Helper to read JSON request body
    const parseBody = () => {
      return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
          if (body.length > 2 * 1024 * 1024) { // 2MB Limit
            reject(new Error('حجم درخواست بیش از حد مجاز است.'));
          }
        });
        req.on('end', () => {
          if (!body) return resolve({});
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error('فرمت JSON درخواست نامعتبر است.'));
          }
        });
        req.on('error', reject);
      });
    };

    try {
      // -------------------------------------------------------------
      // API ROUTES
      // -------------------------------------------------------------

      // 1. Health check
      if (pathname === '/api/health' && req.method === 'GET') {
        const stats = db.prepare('SELECT COUNT(*) as c FROM reservations').get();
        return sendJson(200, {
          status: 'UP',
          platform: 'TechOn',
          env: Config.ENV,
          database: 'SQLite (WAL Mode)',
          timestamp: new Date().toISOString(),
          version: '2.0.0-production',
          totalReservations: stats.c
        });
      }

      // 2. Spaces catalog
      if (pathname === '/api/spaces' && req.method === 'GET') {
        return sendJson(200, spaceController.getAllSpaces());
      }

      // 3. Catering menu
      if (pathname === '/api/catering/menu' && req.method === 'GET') {
        return sendJson(200, cateringController.getMenu());
      }

      // 4. Promo validation
      if (pathname === '/api/promo/validate' && req.method === 'POST') {
        const body = await parseBody();
        const result = promoController.validatePromo(body);
        return sendJson(200, result);
      }

      // 5. Auth Login
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const body = await parseBody();
        try {
          const authResult = authController.login(body);
          return sendJson(200, authResult);
        } catch (authErr) {
          return sendJson(401, { success: false, error: authErr.message });
        }
      }

      // 6. Create Reservation
      if (pathname === '/api/reservations' && req.method === 'POST') {
        const body = await parseBody();
        const result = resController.createReservation(body);
        return sendJson(201, { success: true, ...result });
      }

      // 7. Customer My Reservations
      if (pathname === '/api/my-reservations' && req.method === 'GET') {
        const phone = url.searchParams.get('phone');
        return sendJson(200, resController.getMyReservations(phone));
      }

      // 8. Admin: List All Reservations
      if (pathname === '/api/admin/reservations' && req.method === 'GET') {
        if (userRole === UserRoles.CUSTOMER) {
          return sendJson(403, { success: false, error: 'دسترسی غیرمجاز (نیازمند نقش اپراتور یا سوپرادمین)' });
        }
        return sendJson(200, adminController.getAllReservations(userRole));
      }

      // 9. Admin: Approve Hall Reservation
      const approveMatch = pathname.match(/^\/api\/admin\/reservations\/([A-Za-z0-9_-]+)\/approve$/);
      if (approveMatch && req.method === 'POST') {
        const resId = approveMatch[1];
        if (userRole !== UserRoles.SUPER_ADMIN && userRole !== UserRoles.CAFE_OPERATOR) {
          return sendJson(403, { success: false, error: 'عدم دسترسی به تأیید رویدادهای سالن' });
        }
        const result = adminController.approveHall(resId, userRole, req.headers['x-user-name']);
        return sendJson(200, result);
      }

      // 10. Admin: Cancel Reservation
      const cancelMatch = pathname.match(/^\/api\/admin\/reservations\/([A-Za-z0-9_-]+)\/cancel$/);
      if (cancelMatch && req.method === 'POST') {
        const resId = cancelMatch[1];
        const body = await parseBody();
        const result = adminController.cancel(resId, body, userRole, req.headers['x-user-name']);
        return sendJson(200, result);
      }

      // 11. Admin: Add Catering Item
      if (pathname === '/api/admin/catering/items' && req.method === 'POST') {
        if (userRole !== UserRoles.SUPER_ADMIN && userRole !== UserRoles.CAFE_OPERATOR) {
          return sendJson(403, { success: false, error: 'عدم دسترسی به ویرایش منوی کافه' });
        }
        const body = await parseBody();
        return sendJson(201, cateringController.addItem(body));
      }

      // 12. Admin: Add Promo Code
      if (pathname === '/api/admin/promos' && req.method === 'POST') {
        if (userRole !== UserRoles.SUPER_ADMIN) {
          return sendJson(403, { success: false, error: 'فقط سوپرادمین مجاز به ساخت کدهای تخفیف است.' });
        }
        const body = await parseBody();
        return sendJson(201, promoController.createPromo(body));
      }

      // 13. Admin: Analytics & Revenue Share
      if (pathname === '/api/admin/analytics' && req.method === 'GET') {
        if (userRole !== UserRoles.SUPER_ADMIN) {
          return sendJson(403, { success: false, error: 'مشاهده گزارشات مالی و سهم درآمد تنها مخصوص سوپرادمین است.' });
        }
        return sendJson(200, adminController.getAnalytics(userRole));
      }

      // -------------------------------------------------------------
      // STATIC FILE SERVING
      // -------------------------------------------------------------
      let safePath = pathname === '/' ? '/index.html' : pathname;
      safePath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
      const filePath = path.join(Config.PUBLIC_DIR, safePath);

      if (!filePath.startsWith(Config.PUBLIC_DIR)) {
        return sendJson(403, { error: 'دسترسی به فایل خارج از روت مجاز نیست' });
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      // 404 Fallback
      return sendJson(404, { error: 'مسیر یا صفحه درخواستی یافت نشد.' });

    } catch (err) {
      console.error('Server Internal Error:', err);
      return sendJson(500, { success: false, error: err.message || 'خطای داخلی سرور' });
    }
  });

  return server;
}

// Auto-start when executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createServer();
  server.listen(Config.PORT, Config.HOST, () => {
    console.log(`
======================================================
🚀 TECHON PRODUCTION PLATFORM STARTED
📡 HTTP Server: http://${Config.HOST}:${Config.PORT}
🗄️ Database: SQLite (WAL Mode) at ${Config.DB_PATH}
======================================================
    `);
  });
}
