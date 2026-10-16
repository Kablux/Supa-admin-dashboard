# Ops admin dashboard — VPS deploy (no Vercel)

## Branches

| Branch | GitHub environment | Public URL | API baked into build |
| --- | --- | --- | --- |
| `test` | `test` | https://staging-admin.kabluxe.com | https://staging-api.kabluxe.com/api/v1 |
| `main` | `production` | https://admin.kabluxe.com | https://api.kabluxe.com/api/v1 |

Push (or merge) to `test` / `main` runs [.github/workflows/deploy.yml](../.github/workflows/deploy.yml): `npm ci` → `npm run build` → rsync `dist/` to `/var/www/kabluxe-admin` on the API droplet. Docker nginx serves that directory (see `kabluxe_backend_op` `admin-vhosts.conf`).

## One-time cutover

1. **DNS**
   - `staging-admin.kabluxe.com` → test droplet (same A record as `staging-api.kabluxe.com`)
   - `admin.kabluxe.com` → production VPS (same A record as `api.kabluxe.com`)

2. **GitHub environments** on `Kablux/Supa-admin-dashboard`
   - Environments `test` and `Production` (GitHub may normalize `production` → `Production`)
   - Already set: `VITE_API_BASE_URL`, `SSH_HOST`, `SSH_USER` for both
   - Still required: `SSH_PRIVATE_KEY` on both environments (copy the same deploy keys used by `kabluxe_backend_op` — values cannot be read back from GitHub)
     ```bash
     gh secret set SSH_PRIVATE_KEY --env test --repo Kablux/Supa-admin-dashboard < deploy-test.pem
     gh secret set SSH_PRIVATE_KEY --env production --repo Kablux/Supa-admin-dashboard < deploy-prod.pem
     ```
   - DNS A records still required (see step 1); as of setup they were not yet resolving

3. **Backend nginx**
   - Merge/deploy `kabluxe_backend_op` changes that add `admin-vhosts.conf` and the `/var/www/kabluxe-admin` volume
   - On each droplet, create the host dir if missing: `mkdir -p /var/www/kabluxe-admin`
   - After DNS propagates, issue certs (example on the droplet, from the compose project directory):

     ```bash
     docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
       -d staging-admin.kabluxe.com --agree-tos -m YOUR@EMAIL --non-interactive
     # production:
     docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
       -d admin.kabluxe.com --agree-tos -m YOUR@EMAIL --non-interactive
     docker compose exec nginx nginx -s reload
     ```

4. **CORS / CSRF** on the backend environments
   - test: allow `https://staging-admin.kabluxe.com`
   - production: allow `https://admin.kabluxe.com` in `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`
   - Remove old `*.vercel.app` origins after cutover

5. **First dashboard deploy**
   - Merge the deploy workflow to `test`, confirm https://staging-admin.kabluxe.com loads and login works
   - Promote `test` → `main` the usual way; confirm https://admin.kabluxe.com

6. **Disconnect Vercel**
   - In project `codewithgodstimes-projects/kabluxe-dashboard`, disconnect the GitHub repo and disable production deploys so merges to `main` no longer publish there
   - Until disconnected, merges to `main`/`test` may still trigger a Vercel build in parallel with the VPS deploy

## Smoke checks

- Staging: open https://staging-admin.kabluxe.com, log in against staging API
- Production: open https://admin.kabluxe.com, log in against production API
- Confirm the site is no longer served only from `kabluxe-dashboard.vercel.app`

## Status after initial land

| Item | Status |
| --- | --- |
| Backend nginx vhosts + volume | Merged to `development` and `test` |
| Dashboard deploy workflow | Merged to `development` and `test` |
| `VITE_API_BASE_URL` / `SSH_HOST` / `SSH_USER` | Set on test + production environments |
| `SSH_PRIVATE_KEY` | **Not set** — first test deploy failed waiting for this |
| DNS `staging-admin` / `admin` | **Not resolving yet** — add A records |
| Certbot for admin hosts | Blocked on DNS |
| Vercel disconnect | Manual in Vercel dashboard |
