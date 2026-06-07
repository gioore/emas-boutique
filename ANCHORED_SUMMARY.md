## Goal
Build and deploy a boutique catalog website (EMAS Boutique) with public product browsing, search, filters, dynamic categories/subcategories, brand management, WhatsApp ordering, and a private Spanish-language admin panel.

## Constraints & Preferences
- Owner manages everything herself via `/admin`.
- No cart/checkout — all orders go to WhatsApp `+502 4763-3183`.
- Admin is HTTPS-cookie authenticated (httpOnly, sameSite:strict).
- Design: beige/black/gold/terracotta, elegant, "mercadería importada 100% original".
- Categories/subcategories are dynamic (created in admin).
- "#1 priority: "que la cliente diga que se ve bonita"" — frontend visual quality is top priority.

## Progress
### Done
- **Frontend deployed**: Vercel → `https://frontend-eight-alpha-17.vercel.app`
- **Backend Strapi deployed**: Render → `https://emas-boutique-backend.onrender.com`
- **Database**: Supabase PostgreSQL (us-east-2)
- **Images**: Cloudinary (cloud `dt9ad6ovb`)
- **GitHub**: `gioore/emas-boutique`, master branch
- **Strapi production**: PostgreSQL, Cloudinary, CORS/CSP for Vercel+Cloudinary
- **Public permissions** on all content types
- **Data migrated**: 6 brands, 2 categories, 15 subcategories, 21 products, 15 Cloudinary images
- **Env vars set** on Vercel + Render
- **Bug fixes deployed**:
  - Admin dashboard images: uses `getImageUrl()` (handles Cloudinary URLs)
  - Admin edit product: passes `cat`/`subcat` relations + all fields
  - ProductForm: sends `category`/`subcategory` strings + slug (not display name) for Strapi enum
- **Visual redesign (high priority)**:
  - Hero.tsx: premium gradient, grain texture, animated CTA, scroll indicator, WhatsApp button
  - ProductCard.tsx: refined hover scale+overlay, better badges, brand+subcat labels, gold accent
  - New `ProductBuyClient.tsx`: size selector + WhatsApp with talla+price+URL in message
  - globals.css: animations (fade-in-down, scale-in, float, shimmer)
  - Home page: Instagram section with gradient button
- **SEO**:
  - sitemap.ts: dynamic product pages from Strapi (with 10s timeout fallback)
  - layout.tsx: default OG metadata (es_GT)
  - Product page: `generateMetadata()` with OG image, description, URL
- **Security**: `ADMIN_PASSWORD` set in Vercel env
- **Credentials**:
  - Frontend admin: `admin` / `boutique2025` (fallback; Vercel env overrides)
  - Strapi admin: `boutique@admin.com` / `Boutique2025!`
  - Strapi API token: `71fcf9f738f9618bb9893c17b6219ad55a104c81752e45697c1249f4cb286985d26caf704742ac8ec4f61c97de67b07c3fb95f5cdb1b6ecd8b7b9c6d34620c1b9b751b32a3e2cb0609419c4515c899f2cc2b1d01f9bb3b48ac17de8be7166264369c7a3a643bdf3bfc1a0f8c2c8c9f2749661720c6f36b9448651b9e675de3fb`
- **All changes committed and pushed** to GitHub
- **"Search returns 0 results" was NOT a bug**: pages are `'use client'` — curl can't exec JS. Real browser works.

### In Progress
- **Vercel deploy stuck**: latest build(s) stuck at Queued/Initializing (free tier concurrency limit). Fix committed: sitemap timeout reduced to 10s with AbortController.

### Blocked
- (none)

## Key Decisions
- Visual redesign has been the primary focus (Hero, ProductCard, animations, Instagram section).
- WhatsApp now includes size selection before sending message.
- SEO metadata uses server components (generateMetadata) + openGraph tags.
- Sitemap has a 10s timeout fallback so it doesn't block builds when Render is cold-starting.
- Distinct auth systems: Strapi admin vs frontend admin, different credentials.

## Next Steps
1. Wait for Vercel build queue to clear — the working deployment is still live.
2. Set up Vercel GitHub auto-deploy.
3. Test full flow: browse → select size → WhatsApp with talla+URL.
4. Test mobile responsiveness.
5. Verify OG tags on social share previews.
6. Confirm admin CRUD against production Strapi.

## Critical Context
- **Frontend**: `https://frontend-eight-alpha-17.vercel.app`
- **Backend Strapi**: `https://emas-boutique-backend.onrender.com`
- **Strapi admin**: `https://emas-boutique-backend.onrender.com/admin`
- **Cloudinary**: `https://console.cloudinary.com/console/dt9ad6ovb`
- **Supabase**: project `xyjfrchczlyomomczjki` (us-east-2)
- **Render**: `https://dashboard.render.com/web/srv-d8hhimq8pkls73cesf8g`
- **GitHub**: `https://github.com/gioore/emas-boutique`
- Render free tier spins down after inactivity — first request can be slow (cold start).
- Vercel free tier has build concurrency limits — only one build at a time.
- Latest commit: `d6c7335` — "fix: sitemap timeout for slow Render backend"

## Relevant Files
- `frontend/src/components/Hero.tsx` — Premium hero with gradient, grain, animations
- `frontend/src/components/ProductCard.tsx` — Refined card with badges, hover effects
- `frontend/src/components/ProductBuyClient.tsx` — Size selector + WhatsApp client component
- `frontend/src/app/(shop)/producto/[slug]/page.tsx` — OG metadata + ProductBuyClient
- `frontend/src/app/(shop)/page.tsx` — Home page with Instagram section
- `frontend/src/app/layout.tsx` — Root layout default OG metadata
- `frontend/src/app/sitemap.ts` — Dynamic sitemap with product pages (10s timeout)
- `frontend/src/app/globals.css` — Animations (fade-in-down, scale-in, float, shimmer)
- `frontend/src/lib/config.ts` — Site config, colors, WhatsApp template
- `frontend/src/lib/strapi.ts` — API helpers, getImageUrl() for Cloudinary
- `frontend/src/components/admin/ProductForm.tsx` — Category slug fix
- `frontend/src/app/admin/productos/[id]/editar/page.tsx` — Relations fix
- `frontend/src/app/admin/page.tsx` — Image URL fix
- `backend/config/plugins.ts` — Cloudinary provider
- `backend/config/middlewares.ts` — CORS + CSP
- `backend/config/database.ts` — PostgreSQL config
