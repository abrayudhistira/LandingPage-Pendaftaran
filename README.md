# Ambarsan Legal Registration & Data Collection

Landing page for the official registration and re-data collection of Ambarsan legal education programs.

## Getting Started

```bash
npm install
# copy env template (see below)
npm run dev
# → http://localhost:3000
```

## Environment

Copy `.env.example` to `.env.local` and fill in values for your environment.

### MySQL (required for admin content management & auth)

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=ambarsan
DB_PASSWORD=your-password
DB_NAME=ambarsan_legal
```

When MySQL env vars are **absent**, the public landing page falls back to the
seed array in `app/data/programs.ts` (read-only). Admin login and content
editing require a live MySQL connection.

### Admin session secret

```
ADMIN_SESSION_SECRET=replace-with-a-long-random-secret
```

Set this to a long random value in production. It signs the admin session
cookie (`ambarsan_admin_session`, HttpOnly, SameSite=Lax, Secure in prod).

## Database Setup

1. Create a database and user:

   ```sql
   CREATE DATABASE ambarsan_legal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'ambarsan'@'%' IDENTIFIED BY 'your-password';
   GRANT ALL PRIVILEGES ON ambarsan_legal.* TO 'ambarsan'@'%';
   FLUSH PRIVILEGES;
   ```

2. Run the schema (creates `categories`, `programs`, `admin_accounts` tables):

   ```bash
   mysql -u ambarsan -p ambarsan_legal < lib/migrations/schema.sql
   ```

3. Seed initial program data from `app/data/programs.ts`:

   ```bash
   node scripts/seed-programs.js
   ```

## Admin Dashboard

1. Navigate to `/admin/login`.
2. Sign in with the configured admin email and password (credentials are stored
   in the `admin_accounts` table with scrypt-hashed passwords).
3. From the dashboard at `/admin` you can:
   - Edit any program's name, summary, detail, audience, category, and
     redirect URL.
   - Add a new program (slug must be lowercase alphanumeric + hyphens).
   - Delete a program (with confirmation).
4. Changes are written to MySQL and reflected on the public landing page
   immediately (no rebuild required).

## Architecture Notes

- **`lib/mysql.ts`** — server-only MySQL connection pool. Never imported by
  client components.
- **`lib/program-store.ts`** — MySQL-backed program CRUD with local seed
  fallback (`app/data/programs.ts`) when the DB is unavailable.
- **`lib/admin-auth.ts`** — scrypt password verification against `admin_accounts`
  table; HMAC-based session tokens.
- **`app/page.tsx`** — server component that reads live programs from MySQL.
- **`app/page-content.tsx`** — the interactive client component (theme toggle,
  category tabs, detail panel).

## Scripts

| Command         | Description                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Start Next.js dev server               |
| `npm run build` | Production build                       |
| `npm run lint`  | Run ESLint                             |
| `node scripts/seed-programs.js` | Seed MySQL from local seed |

## Build & Deploy

```bash
npm run build
npm start
```
