# Kablux Ops Admin Dashboard

React + Vite + TypeScript ops dashboard (riders, drivers, trips, banners, promotions).

## Local development

```bash
cp .env.development.example .env
npm ci
npm run dev
```

`VITE_API_BASE_URL` is required. Use the staging API for local/test work; never hardcode the production API as a fallback.

## Deploy

GitHub Actions builds and rsyncs the SPA to the API VPS:

| Branch | URL |
| --- | --- |
| `test` | https://staging-admin.kabluxe.com |
| `main` | https://admin.kabluxe.com |

See [docs/VPS_DEPLOY.md](docs/VPS_DEPLOY.md) for secrets, DNS, TLS, and Vercel cutover.
