# EMAS Boutique — Setup para nueva computadora

## 1. Clonar el repositorio

```bash
git clone https://github.com/gioore/emas-boutique.git
cd emas-boutique
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Variables de entorno

Copia `.env.example` como `.env.local` y llena los valores:

```bash
cp .env.example .env.local
```

Abrí `.env.local` y poné tus valores reales (los mismos que están en Vercel).

### Dónde encontrar cada valor:

| Variable | Dónde obtenerla |
|----------|----------------|
| `DATABASE_URL` | Dashboard de Neon (https://console.neon.tech) → tu proyecto → Connection Details |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Las que hayas configurado |
| `ADMIN_SESSION_SECRET` | `openssl rand -base64 32` en la terminal |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Dashboard de Cloudinary |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary → Settings → API Keys |
| `NEXT_PUBLIC_SITE_URL` | `https://emasboutique.com` |

> **Importante:** Si no tenés los valores de producción, entrá a [Vercel](https://vercel.com/gioores-projects/frontend/settings/environment-variables) y copiálos desde ahí.

## 4. Desarrollo local

```bash
npm run dev
```

Abri http://localhost:3000

## 5. Build y deploy a Vercel

```bash
npm run build
vercel --prod
vercel alias set <deploy-url> emasboutique.com
```

## Archivos importantes

| Ruta | Qué es |
|------|--------|
| `src/lib/config.ts` | Config general (nombre, teléfono, colores) |
| `src/lib/db.ts` | Conexión a Neon PostgreSQL |
| `src/app/` | Páginas del sitio |
| `src/components/` | Componentes React |
| `src/app/api/` | API routes (admin + public) |
| `public/brand/` | Logos del sitio |
| `public/og-image.png` | Imagen para redes sociales (1200×630) |
| `public/favicon.png` | Favicon del sitio |
| `vercel.json` | Config de deploy en Vercel |
