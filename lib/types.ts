export type UserRole = 'admin' | 'staff';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  password?: string;
}

export interface SessionPayload {
  userId: number;
  username: string;
  role: UserRole;
  expiresAt: Date | string;
}

export interface GateStatus {
  btn_1: string;
  btn_2: string;
  scrapedAt: string;
  requestedBy: string;
}

export interface LogEntry {
  id: number;
  action: string;
  userId: number | null;
  username?: string;
  createdAt: string;
}

export interface SystemSetting {
  key: string;
  value: string;
}
