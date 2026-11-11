# How to build the Hostinger deploy zip (frontend)

Hostinger's **"Deployment from source files"** builds the app **on the server** — it
runs `npm install` + `next build` itself. So the zip must contain **SOURCE ONLY**.

> ⚠️ **Never put a pre-built `.next/` in the zip.** If you do, the server's own build
> fails with `EACCES: permission denied` while scanning the uploaded `.next/static/...`.
> (That is exactly why the first zip failed — see the build log.)

This is different from the manual hPanel **Node.js app** method in [`../DEPLOYMENT.md`],
which uploads a *pre-built* `.next`. Use that doc only if you deploy that way instead.

---

## 1. Pre-build check

- `frontend/.env.production` must point at the live API:
  ```
  NEXT_PUBLIC_API_URL=https://api-btrac.missandmrselegancebd.com/api
  ```
- The dev `localhost:8000` URL must live in `frontend/.env.development.local`
  (loaded only by `next dev`) — **never** in `.env.local`, which would bake
  `localhost` into the production bundle (env-precedence trap).

## 2. What the zip MUST contain (source only)

```
src/  public/
package.json  package-lock.json
next.config.mjs  tsconfig.json  next-env.d.ts
postcss.config.mjs  eslint.config.mjs
.env.production  server.js
```

## 3. What to EXCLUDE

- `.next/` — the server builds its own; including it causes the EACCES failure
- `node_modules/` — the server runs `npm install`
- `.env.development.local` — has `localhost:8000`, would poison the prod build
- `*.zip`, `*.log`, `tsconfig.tsbuildinfo`, `scripts/` (dev-only tooling)

## 4. Build the zip (PowerShell, from anywhere)

```powershell
$src = "F:\Project\sB-Trac\frontend"
$zip = "F:\Project\sB-Trac\btrac-frontend-source.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Set-Location $src
$items = @(
  "src","public",
  "package.json","package-lock.json",
  "next.config.mjs","tsconfig.json","next-env.d.ts",
  "postcss.config.mjs","eslint.config.mjs",
  ".env.production","server.js"
)
Compress-Archive -Path $items -DestinationPath $zip -CompressionLevel Optimal -Force
```

> If `node_modules`/`.next` ever lock a file, this won't matter here because neither
> is in the list. Only exclude-nothing approaches (e.g. zipping the whole folder)
> hit the `.next/dev/lock` held by a running `next dev`.

## 5. Verify before uploading (these must all be 0)

```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
$a = [System.IO.Compression.ZipFile]::OpenRead($zip)
($a.Entries | Where-Object { $_.FullName -match '^\.next[\\/]|^node_modules[\\/]|development\.local' }).Count
$a.Dispose()
```

## 6. Deploy on Hostinger

1. Deployment panel → **Redeploy** → upload `btrac-frontend-source.zip`.
2. Root directory `./`, Framework **Next.js**, Node **20/22**.
3. Hostinger runs `npm install` → `next build` → `npm start` (= `node server.js`).
4. `.env.production` is in the zip, so `NEXT_PUBLIC_API_URL` bakes in at build time.
   (You can also set it in Hostinger's Environment variables as a belt-and-suspenders.)

## 7. Backend CORS (once)

`backend/.env`:
```
CORS_ALLOWED_ORIGINS=https://btrac.missandmrselegancebd.com
```
then `php artisan config:clear`.

---

**Note:** the generated `*.zip` is git-ignored — it's a build artifact, don't commit it.
