# 🦛 Hippo Stash

**All your documents, one secure stash.**

A premium document storage, organization, and conversion app. Marketing site +
working product in one: sign in, store files privately, preview & delete them,
and convert between formats — built with Next.js 14, TypeScript, Tailwind,
Framer Motion, and Supabase.

🔗 Live converter (images) runs entirely in the browser; documents convert via
CloudConvert. Storage is private per-user via Supabase.

---

## ✨ Features

- **Split hero** with a live "My Stash" app preview (storage + convert).
- **Auth (Supabase)** — login/register **popup**, plan-aware signup, Google/Apple
  OAuth hooks, signed-in state across the app.
- **Private storage that opens after login** — upload, preview (signed URLs),
  delete; live storage meter. Each user only ever sees their own files.
- **File converter**
  - Images convert **in-browser, dependency-free**: PNG · JPEG · WEBP · PDF · BMP · ICO
  - Documents convert via **CloudConvert**: PDF · DOCX · XLSX · PPTX · and more
- **Marketing sections** — formats grid, features, how-it-works, converter
  console, stats, security, pricing (monthly/yearly), testimonials, FAQ, CTA.
- Glassmorphic dark design system: Bricolage Grotesque + Manrope, folded-corner
  file glyphs, ambient background, smooth scroll reveals. Accessible & responsive.

---

## 🧱 Tech stack

| Layer    | Choice                                            |
| -------- | ------------------------------------------------- |
| Framework| Next.js 14 (App Router, RSC, Route Handlers)      |
| Language | TypeScript (strict)                               |
| Styling  | Tailwind CSS + custom design tokens               |
| Motion   | Framer Motion                                     |
| Backend  | Supabase (Auth + Storage)                         |
| Convert  | In-browser canvas encoders + CloudConvert API     |

---

## 🚀 Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev                  # http://localhost:3000
```

```bash
npm run typecheck
npm run build
```

---

## ⚙️ Environment variables (`.env.local`)

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Anon / publishable key (client-safe) |
| `SUPABASE_SECRET_KEY` | ✅ | **Server only.** Used by `/api/files` & `/api/convert`. Never exposed to the browser. |
| `CLOUDCONVERT_API_KEY` | optional | Enables document conversion. Images work without it. |
| `NEXT_PUBLIC_SITE_URL` | optional | Absolute URL for redirects |

---

## 🛠 Supabase setup

1. **Auth** — Authentication → Sign In / Providers → Email. Toggle
   **Confirm email** ON for production (OFF allows instant login while testing).
2. **Storage bucket** — a private bucket named `user-files` is required. The
   server route auto-creates it on first upload (it has the service key), or
   create it manually under **Storage → New bucket** (Public: off).
   File access is enforced **server-side** in `/api/files` — every operation is
   scoped to the signed-in user's `{user_id}/…` folder, so users can't reach each
   other's files (no public bucket, no client-side keys).

---

## 🔄 Conversion

- **Images** are converted client-side with hand-written encoders (canvas for
  PNG/JPEG/WEBP, custom byte encoders for PDF/BMP/ICO) — no upload, no cost.
- **Documents** post to `/api/convert`, which calls **CloudConvert**, stores the
  result in Supabase Storage, and returns a signed download URL. Add a
  `CLOUDCONVERT_API_KEY` (free tier ~25/day at cloudconvert.com) to enable it.

---

## 🗂 Structure

```
src/
  app/
    page.tsx                 # the single marketing + app page
    layout.tsx               # fonts, metadata, AuthProvider
    api/
      files/route.ts         # per-user storage: list / upload / delete / sign (service key)
      convert/route.ts       # document conversion via CloudConvert + Supabase
  components/
    atoms/                   # Logo, FileGlyph
    molecules/               # Reveal
    organisms/               # Navbar, Hero, HeroApp, FormatsMarquee, FeatureGrid,
                             # StorageSpotlight, StorageDashboard, ConverterSection,
                             # HowItWorks, Stats, Security, PricingSection,
                             # Testimonials, FAQ, CTABanner, Footer, AuthModal
    providers/AuthProvider   # session + login popup
  lib/
    supabase/                # client (browser) + admin (service key)
    hooks/useStorage         # talks to /api/files
    cloudconvert.ts          # CloudConvert v2 client
    config/ types/ utils/
  styles/globals.css         # design tokens & glass system
```

---

## 🚢 Deploy (Vercel)

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Add the env vars above in **Project → Settings → Environment Variables**.
3. Deploy. Every push to `main` redeploys automatically.

> Before going public: **rotate the Supabase secret key**, set `CLOUDCONVERT_API_KEY`,
> and turn **Confirm email** back ON.
