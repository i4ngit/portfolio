# Portfolio Setup Guide — Ian Ocampo

## Prerequisites

Install Node.js (v18+): https://nodejs.org  
Then run:

```bash
cd portfolio_website_ocampo
npm install
```

---

## Local Development

1. Copy the env template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Generate a bcrypt password hash for your admin panel:
   ```bash
   node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('yourpassword', 12).then(console.log)"
   ```
   Paste the result into `.env.local` as `ADMIN_PASSWORD_HASH=`.

3. Set a session secret (any long random string):
   ```bash
   openssl rand -base64 32
   ```
   Paste it as `SESSION_SECRET=` in `.env.local`.

4. For local development, skip Vercel KV — the app falls back to seed data automatically.  
   To use KV locally, install the Vercel CLI (`npm i -g vercel`), link your project (`vercel link`), and run `vercel env pull .env.local`.

5. Start the dev server:
   ```bash
   npm run dev
   ```
   Site: http://localhost:3000  
   Admin: http://localhost:3000/admin/login  
   Default dev password (no hash set): `admin`

---

## Adding Your Photo & CV

- Drop your headshot at `public/photo.jpg` and update the Photo URL in Admin → About/Hero to `/photo.jpg`
- Drop your CV PDF at `public/cv.pdf` and update the CV URL to `/cv.pdf`

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Import it at vercel.com → New Project
3. Add environment variables in Vercel dashboard:
   - `ADMIN_PASSWORD_HASH` — your bcrypt hash
   - `SESSION_SECRET` — your random secret
4. Add Vercel KV: Dashboard → Storage → Create KV Database → link to project
5. The KV env vars (`KV_URL`, `KV_REST_API_URL`, etc.) are auto-added

Content saved via the admin panel persists in Vercel KV and appears on the live site within ~60 seconds (ISR revalidation).

---

## Admin Panel Usage

- Navigate to `/admin/login` and enter your password
- Edit content via the sidebar sections
- All changes are saved immediately to Vercel KV
- Use "View Site" in the sidebar to preview changes

---

## Customizing Colors / Fonts

Edit `tailwind.config.ts` — all brand colors are in `theme.extend.colors`.  
Fonts are configured in `app/layout.tsx` via `next/font/google`.
