import db from "./db";
import { SystemSetting } from "./types";

/**
 * Adds a log entry to the database if logging is enabled in settings.
 */
export function addLog(action: string, userId: number | null | undefined) {
  const logEnabled = db.prepare('SELECT value FROM settings WHERE key = ?').get('log_enabled') as SystemSetting | undefined;
  
  if (logEnabled?.value === 'true') {
    db.prepare('INSERT INTO logs (action, userId) VALUES (?, ?)').run(action, userId ?? null);
  }
}
