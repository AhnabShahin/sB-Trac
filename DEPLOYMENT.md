# Deployment — B-TEL Engineering (Hostinger hPanel)

Two subdomains, independent (Bearer-token auth, so only CORS links them):

| Part | Stack | Subdomain |
| --- | --- | --- |
| Backend API | Laravel 11 / PHP 8.2+ | `api-btrac.missandmrselegancebd.com` (live) |
| Frontend | Next 16 SSR / Node 20 | `btrac.missandmrselegancebd.com` |

The frontend is **SSR, not static export** — it runs `node server.js`, so it needs
hPanel's **Node.js application** manager (Business / Cloud / VPS plans).

---

## Frontend — hPanel Node.js app

### 1. Create the subdomain
hPanel → **Domains → Subdomains** → `btrac.missandmrselegancebd.com`.

### 2. Set the API URL (build-time — must be correct before building)
`NEXT_PUBLIC_API_URL` is inlined into the bundle at build time. `frontend/.env.production`:

```
NEXT_PUBLIC_API_URL=https://api-btrac.missandmrselegancebd.com/api
```

### 3. Build locally (not on the server — avoids shared-host memory limits)

```
cd frontend
npm install
npm run build
```

### 4. Create the Node.js application (hPanel → Advanced → Node.js)
- **Node version:** 20 (18.18+ minimum)
- **Application root:** the subdomain's folder (e.g. `domains/btrac.missandmrselegancebd.com`)
- **Application startup file:** `server.js`
- **Application URL:** the subdomain

hPanel assigns an internal port and proxies the subdomain to it; `server.js` reads
`process.env.PORT`, so no port config is needed.

### 5. Upload
Upload everything **except `node_modules`**:
`.next/`, `public/`, `server.js`, `package.json`, `package-lock.json`,
`.env.production`, `next.config.mjs`.

(`@next/swc-wasm-nodejs` is a dependency, so Next runs without a native binary on the host.)

### 6. Install deps on the host and start
In the Node.js app panel:
1. **Run NPM Install** (installs runtime deps against the uploaded `.next` build).
2. Add `NEXT_PUBLIC_API_URL` under **Environment variables** (belt-and-suspenders).
3. **Start / Restart** the app.

---

## Backend — CORS
The frontend calls the API from a different origin, so the backend must allow it.
`backend/.env`:

```
CORS_ALLOWED_ORIGINS=https://btrac.missandmrselegancebd.com
```

Then: `php artisan config:clear`.

---

## Redeploy (after a code change)
1. `npm run build` locally.
2. Re-upload `.next/` (and any changed `public/`, `server.js`, `next.config.mjs`).
3. **Restart** the Node.js app in hPanel.

## Notes
- Any new media host (if the API origin changes) must be added to
  `next.config.mjs` → `images.remotePatterns`, or `next/image` will reject it.
- `.env.production` is gitignored; `.env.production.example` is the committed template.
- **Env-file precedence trap:** the local dev URL lives in `.env.development.local`
  (loaded only by `next dev`), NOT in `.env.local`. `.env.local` outranks
  `.env.production`, so a localhost value there silently bakes into the production
  bundle at `npm run build`. Verify after building:
  `grep -rl localhost:8000 .next/static` should return nothing.
