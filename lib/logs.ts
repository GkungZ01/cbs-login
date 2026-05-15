import db from './db';

export function addLog(action: string, userId: number | null) {
  const logEnabled = db.prepare('SELECT value FROM settings WHERE key = ?').get('log_enabled') as { value: string };
  
  if (logEnabled?.value === 'true') {
    db.prepare('INSERT INTO logs (action, userId) VALUES (?, ?)').run(action, userId);
  }
}
