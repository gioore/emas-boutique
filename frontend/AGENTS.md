<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# EMAS Boutique — Full Project Reference

## Domain
EMAS Boutique — Guatemalan clothing/fashion e-commerce (imported original merchandise). Single-owner business. All orders via WhatsApp `+502 4763-3183`. No cart/checkout/payments on site.

## Stack
- **Frontend**: Next.js 16.2.7 (Turbopack), React 19.2.4, TypeScript, Tailwind CSS v4
- **Database**: Supabase (PostgreSQL) on `us-east-2`, pooler at `aws-1-us-east-2.pooler.supabase.com:6543`, project `xyjfrchczlyomomczjki`
- **Images**: Cloudinary (`dt9ad6ovb`)
- **Hosting**: Vercel (project `frontend` under `gioores-projects`, root dir `frontend/`)
- **Cost**: $0/mo (Vercel free + Supabase free + Cloudinary free + domain ~$10/yr)

## Key Conventions
- `revalidateTag(tag, profile)` requires 2 arguments in Next.js 16 (e.g., `revalidateTag('catalog', 'max')`)
- No cart/checkout — all purchases redirect to WhatsApp
- Admin credentials default: `admin` / `boutique2025` (dev only — warning logged if no env vars set)
- All admin API routes require `requireAuth()` — throws `'No autorizado'` on failure
- `formatProduct()` is duplicated in `lib/queries.ts`, `lib/catalog.ts`, and `producto/[slug]/page.tsx`
- Site config stored in `site_config` DB table (auto-created on first access)

## Env Vars (Vercel)
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Supabase pg connection string |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_SESSION_SECRET` | HMAC secret for session tokens |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (falls back to Vercel URL or emasboutique.com) |

## Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── (shop)/         # Public-facing pages (home, catalog, product, policies)
│   │   ├── admin/           # Admin panel (dashboard, CRUD, config)
│   │   └── api/admin/       # Admin REST APIs (products, categories, subcategories, brands, upload, config, auth)
│   ├── components/
│   │   ├── admin/           # Admin-specific (ProductForm, ImageUpload, AdminSidebar, SidebarIcon)
│   │   ├── catalog/         # CatalogView
│   │   └── *.tsx            # Shared (Header, Footer, Hero, ProductCard, ProductBuyClient, etc.)
│   └── lib/
│       ├── db.ts            # pg Pool + query/queryOne/execute
│       ├── config.ts        # Static defaults + SITE_URL
│       ├── queries.ts       # Home page queries (featured, new, on-sale)
│       ├── catalog.ts       # Catalog page queries with JOINs
│       ├── images.ts        # Cloudinary URL helpers
│       └── admin-auth-server.ts  # Session token + cookie management
└── migrations/              # SQL migration files
```

## Known Issues / Tech Debt
- `formatProduct()` duplicated across 3 files — extract shared utility
- Color map in ProductBuyClient limited to 19 named colors — admin should store hex values
- Admin sidebar SVGs now extracted to `SidebarIcon` component but "Ver Tienda" / "Cerrar Sesión" remain inline
- ErrorFallback component now shared across 3 error pages
- Config page saves via API to `site_config` DB table (auto-creates table on first access)
- Rate limiter uses in-memory Map (not persisted across cold starts) — suitable for single-instance
- `getImageUrl` returns placeholder for non-http URLs
