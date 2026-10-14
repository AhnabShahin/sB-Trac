# B-TEL Engineering — Monorepo

Marketing/corporate site for **B-TEL Engineering Ltd** plus a Laravel API and admin panel.

```
sB-Trac/
├── frontend/   # Next.js 16 app (public marketing site + admin panel + signup)
└── backend/    # Laravel 11 API (Sanctum token auth)
```

## Prerequisites

- Node 20+, npm
- PHP 8.2+, Composer

## Backend — Laravel API (`/backend`)

```bash
cd backend
# .env already created by composer; APP_KEY is set.
php artisan migrate                 # SQLite (database/database.sqlite) by default
php artisan admin:create            # create the admin (prompts for name/email/password)
php artisan serve --port=8000
```

`admin:create` can also run non-interactively:

```bash
php artisan admin:create --name="Your Name" --email=you@example.com --password=secret123
```

API is now at `http://localhost:8000/api`. It is **API-only** — `/` returns a
small JSON health response, there is no Blade UI.

| Method | Endpoint      | Auth           | Purpose                     |
| ------ | ------------- | -------------- | --------------------------- |
| POST   | `/api/login`  | public         | Sign in, returns a token    |
| GET    | `/api/user`   | `auth:sanctum` | Current user (Bearer token) |
| POST   | `/api/logout` | `auth:sanctum` | Revoke the current token    |

- There is **no public registration** — the admin is created from the CLI.
- Auth: **Laravel Sanctum personal access tokens** (Bearer). The `users` table
  has a `role` column (default `admin`).
- CORS: `config/cors.php` allows `http://localhost:3000`.

## Frontend — Next.js app (`/frontend`)

```bash
cd frontend
npm install           # if node_modules is not present
npm run dev           # http://localhost:3000
```

`.env.local` sets the API host:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Routes & route groups

- `(public)/` — the existing marketing site (`/`, `/clients`, `/projects`, …),
  wrapped in the Lenis smooth-scroll + site header chrome.
- `(auth)/login` — `/login`, admin sign-in. Matches the root dark-navy theme.
- `(admin)/dashboard` — `/dashboard`, protected admin panel (blank for now).

### Auth flow

1. Create the admin once from the CLI (`php artisan admin:create`).
2. Visit `/login` and sign in.
3. On success the token is stored in the `btel_token` cookie and you're sent to
   `/dashboard`.
4. `src/proxy.ts` (Next.js 16's renamed middleware) guards `/dashboard`:
   no cookie → redirect to `/login`; already signed in → `/login` redirects to
   `/dashboard`.

> **Token storage note:** the token is in a JS-readable cookie so the proxy can
> see it. To harden later, register via a Next.js Route Handler that sets an
> **HttpOnly** cookie, and read it the same way in `proxy.ts`. The API boundary
> lives entirely in `src/services/auth.ts`.

## Run both (two terminals)

```bash
# terminal 1
cd backend && php artisan serve --port=8000
# terminal 2
cd frontend && npm run dev
```
