# 🦛 Hippo Stash — Marketing Website

**Manage all your important documents in one secure place.**

A single-page marketing website for Hippo Stash, a premium document storage,
organization, and conversion platform. Built with Next.js 14 (App Router),
TypeScript (strict), Tailwind CSS, and Framer Motion. No backend — it builds to
fully static HTML.

---

## ✨ Sections (one page, top to bottom)

1. **Hero** — headline, CTA buttons, animated file-type showcase
2. **Features** — Store, Convert, Preview, Secure (glassmorphic cards)
3. **Converter** — a **live, in-browser image converter** (PNG ⇄ JPG ⇄ WEBP).
   Drop an image, pick a format, download the result. Runs entirely client-side
   via canvas — no upload, no sign-up.
4. **Pricing** — Free / Pro / Business with a monthly–yearly toggle & savings %
5. **Trust** — security stats and testimonials
6. **CTA banner** — "Ready to Begin?"
7. **Footer** — anchor navigation

Glassmorphic dark UI, ambient glow orbs, staggered scroll reveals, 300ms
transitions, responsive, accessible (ARIA, keyboard nav, reduced-motion), and
SEO + Open Graph metadata.

---

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

### Type-check & build

```bash
npm run typecheck
npm run build      # outputs a fully static, prerendered site
```

No environment variables are required.

---

## 🗂 Structure

```
src/
  app/
    layout.tsx          # root layout, fonts, SEO/OG metadata
    page.tsx            # the single marketing page (composes all sections)
    loading.tsx · error.tsx · not-found.tsx
  components/
    atoms/              # Logo, Button, Badge, GlowOrb, FileTypeIcon
    molecules/          # GlassCard, PricingCard, BillingToggle, Reveal
    organisms/          # Navbar, Hero, FeatureGrid, ConverterSection,
                        # PricingSection, TrustSection, CTABanner, Footer
  lib/
    config/plans.ts     # pricing plan data
    types/ utils/
  styles/globals.css    # design tokens & glassmorphism
  assets/               # brand logo SVG
```

---

## 🎨 Design tokens

Defined in `tailwind.config.ts` + `globals.css`:

- **Background** `#0B0B14` / `#0E0F1A`
- **Accent gradient** cyan `#4ECDC4` → violet `#9B59B6`
- **File types** PDF `#E74C3C`, Image `#2ECC71`, DOC `#3498DB`
- **Radii** 16px cards, 12px buttons, 24px pill inputs · **Font** Inter · Dark mode only
