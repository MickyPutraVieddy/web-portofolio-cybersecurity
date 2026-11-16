# Cybersecurity Portfolio

Bilingual (English / Indonesian) cybersecurity portfolio with an owner-only Admin CMS.

**Live Website:** https://web-portofolio-cybersecurity-three.vercel.app

**Tech Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS · Upstash Redis

## Requirements

- Node.js 22.x
- pnpm 10.26.0

## 1. Local Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>
```

Install dependencies:

```bash
corepack enable
corepack prepare pnpm@10.26.0 --activate
pnpm install
```

Create environment file:

```bash
cp .env.example .env.local
```

Generate admin credentials:

```bash
node scripts/admin-setup.mjs "YOUR_ADMIN_PASSWORD"
```

Copy the generated `SESSION_SECRET` and `ADMIN_PASSWORD_HASH` into `.env.local`.

Configure:

```env
SESSION_SECRET="YOUR_GENERATED_SECRET"
ADMIN_PASSWORD_HASH="YOUR_GENERATED_HASH"
SITE_URL="http://localhost:3000"
DATA_DIR="./.data"
```

Start the development server:

```bash
pnpm dev
```

Open: http://localhost:3000

## 2. Deploy to Vercel

1. Push the project to GitHub.
2. Open [Vercel Dashboard](https://vercel.com/dashboard).
3. Select **Add New → Project**.
4. Import your GitHub repository.
5. Configure:

| Setting | Value |
|---|---|
| Framework | Next.js |
| Node.js | 22.x |
| Install Command | `pnpm install` |
| Build Command | `pnpm build` |
| Output Directory | Default |

### Environment Variables

Go to **Vercel → Settings → Environment Variables** and add:

| Variable | Description |
|---|---|
| `SESSION_SECRET` | Generated session secret |
| `ADMIN_PASSWORD_HASH` | Generated admin password hash |
| `SITE_URL` | `https://web-portofolio-cybersecurity-three.vercel.app` |
| `KV_REST_API_URL` | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Upstash Redis REST token |

### Upstash Redis Setup

1. Open [Vercel Marketplace – Upstash](https://vercel.com/marketplace/upstash).
2. Install the Upstash Redis integration.
3. Create or connect a Redis database.
4. Link it to your Vercel project.
5. Verify the Redis environment variables.
6. Redeploy your application.

**Note:** Upstash Redis is required for persistent application storage on Vercel. Local file storage is used for localhost development.

## 3. Admin Usage

- Open the deployed website.
- Access the Admin login page.
- Sign in using your configured admin credentials.
- Manage portfolio content through the Admin CMS.
- Configure TOTP and Passkeys through **Admin → Security**, where supported.

## 4. Available Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start localhost |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm typecheck` | TypeScript validation |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests |

## 5. License

Apache-2.0 — See [LICENSE](./LICENSE).

---

**Understand the Attack. Strengthen the Defense. Secure the Future.**
