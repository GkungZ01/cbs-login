'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { encrypt } from '@/lib/auth';
import { addLog } from '@/lib/logs';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  }

  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  const session = await encrypt({
    userId: user.id,
    username: user.username,
    role: user.role,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  addLog(`User ${username} logged in`, user.id);

  redirect('/');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}
