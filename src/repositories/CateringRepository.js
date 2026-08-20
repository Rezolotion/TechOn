import { getDatabase } from '../db/database.js';

export class CateringRepository {
  constructor(db = getDatabase()) {
    this.db = db;
  }

  findAll() {
    return this.db.prepare('SELECT * FROM catering_items WHERE available = 1 ORDER BY category, price ASC').all();
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM catering_items WHERE id = ?').get(id);
  }

  addItem(item) {
    const stmt = this.db.prepare(`
      INSERT INTO catering_items (id, name, category, price, available)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(item.id, item.name, item.category, item.price, item.available !== undefined ? item.available : 1);
    return this.findById(item.id);
  }
}
