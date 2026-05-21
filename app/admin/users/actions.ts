'use server';

import db from '@/lib/db';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { addLog } from '@/lib/logs';
import { getSession } from '@/lib/auth';

export async function addUser(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  if (!username || !password || !role) {
    return { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(username, hashedPassword, role);
    
    const session = await getSession();
    addLog(`Created user ${username} with role ${role}`, session?.userId);
    
    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return { error: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว' };
    }
    return { error: 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้' };
  }
}

export async function deleteUser(userId: number) {
  const session = await getSession();
  
  if (session?.userId === userId) {
    return { error: 'ไม่สามารถลบตัวเองได้' };
  }

  const user = db.prepare('SELECT username FROM users WHERE id = ?').get(userId) as { username: string };
  
  db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  addLog(`Deleted user ${user?.username}`, session?.userId);
  
  revalidatePath('/admin/users');
}

export async function updateUser(formData: FormData) {
  const userId = parseInt(formData.get('userId') as string);
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  if (!userId || !role) {
    return { error: 'ข้อมูลไม่ครบถ้วน' };
  }

  try {
    const session = await getSession();
    const user = db.prepare('SELECT username FROM users WHERE id = ?').get(userId) as { username: string };
    
    if (!user) {
      return { error: 'ไม่พบผู้ใช้งาน' };
    }

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.prepare('UPDATE users SET password = ?, role = ? WHERE id = ?').run(hashedPassword, role, userId);
      addLog(`Updated user ${user.username} (Password changed)`, session?.userId);
    } else {
      db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, userId);
      addLog(`Updated user ${user.username} (Role changed to ${role})`, session?.userId);
    }

    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: any) {
    return { error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' };
  }
}
