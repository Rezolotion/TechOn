import { getDatabase } from '../db/database.js';

export class SpaceRepository {
  constructor(db = getDatabase()) {
    this.db = db;
  }

  findAll() {
    const rows = this.db.prepare('SELECT * FROM spaces ORDER BY hourly_rate ASC').all();
    return rows.map(r => ({
      ...r,
      hourlyRate: r.hourly_rate,
      dailyRate: r.daily_rate,
      features: JSON.parse(r.features || '[]')
    }));
  }

  findByKey(key) {
    const row = this.db.prepare('SELECT * FROM spaces WHERE key = ?').get(key);
    if (!row) return null;
    return {
      ...row,
      hourlyRate: row.hourly_rate,
      dailyRate: row.daily_rate,
      features: JSON.parse(row.features || '[]')
    };
  }
}
