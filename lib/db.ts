import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcrypt';

const dbPath = path.join(process.cwd(), 'sqlite.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'staff'))
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    userId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed default settings
const logSetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('log_enabled');
if (!logSetting) {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('log_enabled', 'true');
}

// Seed default admin user if not exists
const adminUser = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
if (!adminUser) {
  const hashedPassword = bcrypt.hashSync('admin1234', 10);
  db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', hashedPassword, 'admin');
  console.log('Default admin created: admin / admin1234');
}

export default db;
