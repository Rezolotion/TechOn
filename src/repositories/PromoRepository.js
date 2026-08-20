import { getDatabase } from '../db/database.js';

export class PromoRepository {
  constructor(db = getDatabase()) {
    this.db = db;
  }

  findByCode(code) {
    const row = this.db.prepare('SELECT * FROM promo_codes WHERE code = ? AND active = 1').get(code);
    if (!row) return null;
    return {
      ...row,
      discountType: row.discount_type,
      discountValue: row.discount_value,
      maxDiscount: row.max_discount,
      validSpaces: row.valid_spaces ? JSON.parse(row.valid_spaces) : null
    };
  }

  incrementUsage(code) {
    this.db.prepare('UPDATE promo_codes SET used_count = used_count + 1 WHERE code = ?').run(code);
  }

  createPromo(promo) {
    const stmt = this.db.prepare(`
      INSERT INTO promo_codes (code, discount_type, discount_value, max_discount, valid_spaces, max_uses)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      promo.code,
      promo.discountType || 'PERCENTAGE',
      promo.discountValue,
      promo.maxDiscount || null,
      promo.validSpaces ? JSON.stringify(promo.validSpaces) : null,
      promo.maxUses || null
    );
    return this.findByCode(promo.code);
  }
}
