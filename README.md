# Cybersecurity Portfolio

Bilingual (EN / ID) portfolio site with an owner-only admin CMS.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Zod · SWR · SimpleWebAuthn

## Requirements

- Node.js 22.x
- pnpm 10.26.0

## Commands

| Command | Purpose |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build / server |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit and integration tests |

## Environment

Copy `.env.example` to `.env.local`. `node scripts/admin-setup.mjs "<password>"` prints `SESSION_SECRET` and `ADMIN_PASSWORD_HASH`.

| Variable | Required | Description |
|---|---|---|
| `SESSION_SECRET` | yes | Session signing key (32+ characters) |
| `ADMIN_PASSWORD_HASH` | yes | Admin password hash |
| `SITE_URL` | yes | Public HTTPS origin (used for passkeys and OAuth) |
| `MYMEMORY_EMAIL` | no | Any email address. Raises the free MyMemory translation quota from ~5,000 to ~50,000 characters/day |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | on Vercel | Upstash Redis REST credentials (`UPSTASH_REDIS_REST_*` also accepted) |
| `DATA_DIR` | no | File store path for local/self-hosted use (default `./.data`) |
| `ADMIN_TOTP_SECRET` | no | Fixed TOTP secret (otherwise managed from Admin → Security) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAILS` | no | Google sign-in |
| `WEBAUTHN_ORIGIN`, `WEBAUTHN_RP_ID` | no | Passkey overrides |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | no | Contact form email delivery |

## Deploy (Vercel)

Framework preset **Next.js**, Node.js **22.x**, package manager **pnpm** (commit `pnpm-lock.yaml`), default build command and output directory. Set the variables above, including Upstash Redis credentials, since the file store is not available on Vercel.

## Structure

```
app/          routes, API handlers, global styles
components/   public sections and admin UI
lib/          content schema, defaults, server logic (auth, storage, passkeys, 2FA)
scripts/      admin setup and 2FA reset utilities
tests/        test suites
```

## License

Apache-2.0
