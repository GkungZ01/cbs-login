# Agent Instructions & Project Overview

This document provides context and instructions for AI agents working on the **cbs-login** project.

## Project Overview
A Next.js 16 (App Router) application featuring a robust Authentication and Admin system using SQLite.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via `better-sqlite3`)
- **Authentication**: Custom JWT (via `jose`) with HTTP-only Cookies
- **Password Hashing**: `bcrypt`
- **Styling**: Tailwind CSS 4

## Database Schema (`sqlite.db`)
Direct access via `lib/db.ts`.

### Tables:
1. **`users`**:
   - `id`: Integer (PK)
   - `username`: Text (Unique)
   - `password`: Text (Hashed)
   - `role`: Text ('admin', 'staff')

2. **`logs`**:
   - `id`: Integer (PK)
   - `action`: Text
   - `userId`: Integer (FK)
   - `createdAt`: Datetime

3. **`settings`**:
   - `key`: Text (PK)
   - `value`: Text

## Authentication Flow
- **Middleware**: `middleware.ts` protects all routes except `/login` and static assets.
- **Session**: Stored in a `session` cookie (JWT).
- **Utilities**: `lib/auth.ts` for encrypting/decrypting sessions and `getSession()`.
- **Role-Based Access**: 
  - Admin: Full access to `/admin` and all features.
  - Staff: Access to home page only; restricted from `/admin`.

## Logging System
- Utility: `addLog(action, userId)` in `lib/logs.ts`.
- Condition: Only logs if `log_enabled` in `settings` table is `'true'`.
- Toggle: Managed in Admin Settings.

## Development Rules
- **Direct SQL**: Use `better-sqlite3` prepared statements to prevent SQL injection.
- **Server Actions**: Use Server Actions for all data mutations and authentication logic.
- **UI Consistency**: Use Tailwind CSS for styling, adhering to the existing clean/modern aesthetic.
- **Security**: Never expose hashed passwords or JWT secrets in client-side components.

## Credentials (Dev/Seed)
- **Admin**: `admin` / `admin1234`
