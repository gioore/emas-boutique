# EMAS Boutique — Tienda Online

Catálogo web de ropa importada con compra por WhatsApp. Incluye panel de administración privado para gestionar productos.

## Stack

- **Frontend:** Next.js 16 + Tailwind CSS v4 + TypeScript
- **Backend:** Strapi 5 (Headless CMS)
- **Base de datos:** SQLite (dev) → PostgreSQL (prod)
- **Hosting:** Vercel (frontend) + Render (backend)

## Requisitos

- Node.js 22 (usar nvm)
- npm

## Inicio rápido

```bash
# 1. Backend (Strapi)
cd backend
nvm use 22
npm install
npm run develop
# http://localhost:1337/admin

# 2. Frontend (Next.js)
cd frontend
cp .env.example .env.local
# Editar .env.local con STRAPI_API_TOKEN
npm install
npm run dev
# http://localhost:3000
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | URL del backend Strapi |
| `STRAPI_API_TOKEN` | Token full-access de Strapi |
| `ADMIN_USERNAME` | Usuario del panel admin |
| `ADMIN_PASSWORD` | Contraseña del panel admin |

## Panel admin

- URL: `http://localhost:3000/admin`
- Login con usuario/contraseña (definido en `.env.local`)
- Gestionar productos: crear, editar, eliminar, subir imágenes

## Estructura

```
Boutique/
├── backend/          # Strapi CMS
│   ├── config/
│   ├── src/
│   │   └── api/product/   # Content type Producto
│   └── public/uploads/    # Imágenes
├── frontend/         # Next.js + Tailwind
│   ├── src/
│   │   ├── app/
│   │   │   ├── (shop)/    # Páginas públicas
│   │   │   ├── admin/     # Panel admin
│   │   │   └── api/admin/ # API admin
│   │   ├── components/
│   │   └── lib/
│   └── public/brand/
└── README.md
```
