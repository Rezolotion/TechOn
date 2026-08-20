import Database from 'better-sqlite3';
import { Config } from '../config/config.js';
import { SpaceTypes, DemoUsers } from '../core/models.js';

let dbInstance = null;

export function getDatabase(dbPath = Config.DB_PATH) {
  if (dbInstance) return dbInstance;

  dbInstance = new Database(dbPath, {
    verbose: Config.ENV === 'development' ? console.log : null
  });

  // Enable WAL mode for high performance concurrency & enforce foreign keys
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.pragma('foreign_keys = ON');

  initSchema(dbInstance);
  seedInitialData(dbInstance);

  return dbInstance;
}

export function closeDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS spaces (
      key TEXT PRIMARY KEY,
      id TEXT NOT NULL,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      count INTEGER NOT NULL DEFAULT 1,
      hourly_rate INTEGER NOT NULL,
      daily_rate INTEGER NOT NULL,
      features TEXT NOT NULL, -- JSON array
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS catering_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      available INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS promo_codes (
      code TEXT PRIMARY KEY,
      discount_type TEXT NOT NULL, -- 'PERCENTAGE' or 'FIXED'
      discount_value INTEGER NOT NULL,
      max_discount INTEGER,
      valid_spaces TEXT, -- JSON array of space keys or NULL for all
      used_count INTEGER NOT NULL DEFAULT 0,
      max_uses INTEGER,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      space_key TEXT NOT NULL REFERENCES spaces(key),
      space_name TEXT NOT NULL,
      booking_type TEXT NOT NULL, -- 'HOURLY' or 'DAILY'
      duration REAL NOT NULL,
      schedule_description TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      status TEXT NOT NULL, -- 'CONFIRMED', 'PENDING_REVIEW', 'CANCELLED'
      cancellation_reason TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      event_topic TEXT,
      target_audience_count INTEGER,
      space_subtotal INTEGER NOT NULL,
      equipment_fee INTEGER NOT NULL DEFAULT 0,
      catering_fee INTEGER NOT NULL DEFAULT 0,
      subtotal INTEGER NOT NULL,
      discount_amount INTEGER NOT NULL DEFAULT 0,
      promo_code TEXT,
      final_total INTEGER NOT NULL,
      invoice_number TEXT NOT NULL,
      equipment_json TEXT,
      catering_json TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reservation_time_slots (
      id TEXT PRIMARY KEY,
      reservation_id TEXT NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
      slot_date TEXT NOT NULL,
      date_label TEXT,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      start_time_str TEXT,
      end_time_str TEXT,
      hours REAL NOT NULL,
      slot_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS reservation_daily_dates (
      id TEXT PRIMARY KEY,
      reservation_id TEXT NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
      date_str TEXT NOT NULL,
      date_label TEXT,
      date_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      details_json TEXT
    );

    -- Performance Indexes
    CREATE INDEX IF NOT EXISTS idx_reservations_space_status ON reservations(space_key, status);
    CREATE INDEX IF NOT EXISTS idx_reservations_phone ON reservations(customer_phone);
    CREATE INDEX IF NOT EXISTS idx_slots_res_id ON reservation_time_slots(reservation_id);
    CREATE INDEX IF NOT EXISTS idx_daily_res_id ON reservation_daily_dates(reservation_id);
  `);
}

function seedInitialData(db) {
  // 1. Seed Spaces
  const spaceCount = db.prepare('SELECT COUNT(*) as count FROM spaces').get().count;
  if (spaceCount === 0) {
    const insertSpace = db.prepare(`
      INSERT INTO spaces (key, id, name, capacity, count, hourly_rate, daily_rate, features)
      VALUES (@key, @id, @name, @capacity, @count, @hourlyRate, @dailyRate, @features)
    `);

    const insertMany = db.transaction((spaces) => {
      for (const space of spaces) {
        insertSpace.run({
          key: space.key,
          id: space.id,
          name: space.name,
          capacity: space.capacity,
          count: space.count,
          hourlyRate: space.hourlyRate,
          dailyRate: space.dailyRate,
          features: JSON.stringify(space.features)
        });
      }
    });

    insertMany(Object.values(SpaceTypes));
  }

  // 2. Seed Users
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, username, password_hash, name, phone, role)
      VALUES (@id, @username, @password_hash, @name, @phone, @role)
    `);

    const insertUsersTx = db.transaction((users) => {
      for (const u of users) {
        insertUser.run({
          id: u.id,
          username: u.username,
          password_hash: u.password, // In real app, bcrypt hash
          name: u.name,
          phone: u.phone,
          role: u.role
        });
      }
    });

    insertUsersTx(Object.values(DemoUsers));
  }

  // 3. Seed Catering Menu
  const catCount = db.prepare('SELECT COUNT(*) as count FROM catering_items').get().count;
  if (catCount === 0) {
    const defaultCatering = [
      { id: 'cat-pkg-vip', name: 'پکیج پذیرایی VIP همایش (نوشیدنی گرم و سرد + ۳ نوع اسنک و میوه)', category: 'PACKAGE', price: 95000 },
      { id: 'cat-pkg-standard', name: 'پکیج استاندارد جلسات (چای دمی/قهوه + بیسکویت و کیک روز)', category: 'PACKAGE', price: 45000 },
      { id: 'cat-drink-espresso', name: 'اسپرسو دوبل تخصصی (۱۰۰٪ عربیکا)', category: 'BEVERAGE_HOT', price: 40000 },
      { id: 'cat-drink-latte', name: 'کافه لاته با شیر تازه باریستا', category: 'BEVERAGE_HOT', price: 55000 },
      { id: 'cat-drink-tea', name: 'چای دمی درجه یک لاهیجان با دارچین و نبات', category: 'BEVERAGE_HOT', price: 25000 },
      { id: 'cat-drink-coldbrew', name: 'کلد برو (دم‌آوری سرد ۱۲ ساعته)', category: 'BEVERAGE_COLD', price: 60000 },
      { id: 'cat-drink-juice', name: 'آبمیوه طبیعی فصل (پرتقال / انار / سیب)', category: 'BEVERAGE_COLD', price: 50000 },
      { id: 'cat-snack-croissant', name: 'کروسان فرانسوی کره و شکلات', category: 'SNACK', price: 45000 },
      { id: 'cat-snack-sandwich', name: 'کلاب ساندویچ بوقلمون و پنیر گودا', category: 'SNACK', price: 65000 }
    ];

    const insertCat = db.prepare(`
      INSERT INTO catering_items (id, name, category, price)
      VALUES (@id, @name, @category, @price)
    `);

    const insertCatTx = db.transaction((items) => {
      for (const item of items) {
        insertCat.run(item);
      }
    });

    insertCatTx(defaultCatering);
  }

  // 4. Seed Promo Codes
  const promoCount = db.prepare('SELECT COUNT(*) as count FROM promo_codes').get().count;
  if (promoCount === 0) {
    const defaultPromos = [
      { code: 'TECHON2026', discount_type: 'PERCENTAGE', discount_value: 20, max_discount: 500000, valid_spaces: null, max_uses: 100 },
      { code: 'COWORK50', discount_type: 'FIXED', discount_value: 50000, max_discount: null, valid_spaces: JSON.stringify(['SHARED_DESK', 'DEDICATED_DESK']), max_uses: 50 },
      { code: 'HALLVIP', discount_type: 'PERCENTAGE', discount_value: 15, max_discount: 1500000, valid_spaces: JSON.stringify(['CONFERENCE_HALL']), max_uses: 20 }
    ];

    const insertPromo = db.prepare(`
      INSERT INTO promo_codes (code, discount_type, discount_value, max_discount, valid_spaces, max_uses)
      VALUES (@code, @discount_type, @discount_value, @max_discount, @valid_spaces, @max_uses)
    `);

    const insertPromoTx = db.transaction((promos) => {
      for (const p of promos) {
        insertPromo.run(p);
      }
    });

    insertPromoTx(defaultPromos);
  }
}
