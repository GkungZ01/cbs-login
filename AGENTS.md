# Agent Instructions & Project Overview (Clean Version)

This document provides context and instructions for AI agents working on the **cbs-login** project.

## Project Architecture
A Next.js 16 (App Router) application with a centralized logic structure.

## Core Tech Stack
- **Framework**: Next.js 16.2.6
- **Database**: SQLite (`better-sqlite3`)
- **Authentication**: JWT (`jose`) with HTTP-only Cookies
- **Scraping**: `cheerio` for HTML parsing
- **Styling**: Tailwind CSS 4

## Key Directory Structure
- `app/`: Next.js App Router pages and API routes.
- `lib/`: Centralized business logic, database, and utilities.
- `lib/types.ts`: **Shared TypeScript interfaces** for consistency.
- `proxy.ts`: **Next.js 16 Proxy** (formerly middleware.ts) for route protection.

## Authentication & Security
- **Proxy**: Protects `/admin` and authenticated routes.
- **Session**: Signed JWT stored in a `session` cookie.
- **Secret**: Managed via `JWT_SECRET` environment variable.

## Data Persistence
- **Database**: `sqlite.db` (SQLite).
- **ORM**: Raw SQL via `better-sqlite3` prepared statements.
- **Tables**: `users`, `logs`, `settings`.

## External Integration (Gate API)
- **Target**: PHP-based gate control system.
- **Mechanism**: Server-side scraping and form-data submission.
- **Security**: Access restricted to authenticated users via internal API routes.

## Development Standards
1. **Types**: Always use interfaces from `lib/types.ts`.
2. **Logic**: Keep UI components lean; move logic to `lib/` utilities.
3. **API Routes**: Secure all sensitive API routes by checking `getSession()`.
4. **Environment**: Ensure `API_GATE` and `JWT_SECRET` are configured.

## Seed Access
- **Admin**: `admin` / `admin1234`
