import { getDatabase } from '../db/database.js';

export class AuditRepository {
  constructor(db = getDatabase()) {
    this.db = db;
  }

  log(userId, action, resource, details = {}) {
    const id = `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const stmt = this.db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, resource, details_json)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, userId || 'anonymous', action, resource, JSON.stringify(details));
    return { id, userId, action, resource, details, timestamp: new Date().toISOString() };
  }

  getRecentLogs(limit = 50) {
    const rows = this.db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?').all(limit);
    return rows.map(r => ({
      id: r.id,
      timestamp: r.timestamp,
      userId: r.user_id,
      action: r.action,
      resource: r.resource,
      details: JSON.parse(r.details_json || '{}')
    }));
  }
}
