import { getDatabase } from '../db/database.js';

export class UserRepository {
  constructor(db = getDatabase()) {
    this.db = db;
  }

  findByUsername(username) {
    return this.db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }
}
