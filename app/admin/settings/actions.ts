import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function toggleLogs(currentValue: string) {
  'use server';
  const newValue = currentValue === 'true' ? 'false' : 'true';
  db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(newValue, 'log_enabled');
  revalidatePath('/admin/settings');
}
