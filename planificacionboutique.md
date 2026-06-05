# Boutique Web — Plan Final

## Stack
- **Frontend:** Next.js 16 + Tailwind CSS v4 + TypeScript
- **Backend/Admin:** Strapi 5 (Headless CMS)
- **Base de datos:** SQLite (dev) → PostgreSQL (prod con Supabase)
- **Hosting frontend:** Vercel (gratis)
- **Hosting backend:** Render o Railway (gratis)
- **Dominio:** .com (~Q120/año)

## Arquitectura
```
Next.js (Frontend) ─── API REST ───→ Strapi (Backend)
         │                                   │
    ┌────┴────┐                         Base de Datos
    │         │                      (SQLite/Postgres)
  Público    Admin
 (/mujer,   (/admin)
  /hombre,   Login con
  /producto) usuario/contraseña
```

## URLs
| Sitio | URL |
|---|---|
| **Tienda (frontend)** | `http://localhost:3000` |
| **Admin panel** | `http://localhost:3000/admin` |
| **Admin de Strapi** | `http://localhost:1337/admin` |

## Credenciales

### Admin del panel (Next.js)
- **Usuario:** `admin`
- **Contraseña:** `boutique2025`
- **Cambiar en:** `.env.local` → `ADMIN_USERNAME` / `ADMIN_PASSWORD`

### Admin de Strapi (solo para desarrollador)
- **Email:** `boutique@admin.com`
- **Contraseña:** `Boutique2025!`
- **URL:** `http://localhost:1337/admin`
- **Usar solo para:** configuraciones técnicas, respaldos, migraciones

## Modelo Producto
| Campo | Tipo | Descripción |
|---|---|---|
| name | string | Nombre del producto |
| slug | uid | URL amigable (autogenerado) |
| price | decimal | Precio en Quetzales |
| category | enum | mujer / hombre |
| subcategory | enum | Blusas, Vestidos, Pantalones, Playeras, Camisas |
| description | richtext | Descripción del producto |
| sizes | json | Array de tallas disponibles |
| images | media | Fotos del producto |
| featured | boolean | Mostrar en página principal |
| whatsapp | string | Número de WhatsApp |

## Páginas Públicas
| Ruta | Descripción |
|---|---|
| `/` | Inicio: hero + productos destacados + categorías |
| `/mujer` | Catálogo completo de mujer |
| `/hombre` | Catálogo completo de hombre |
| `/producto/[slug]` | Detalle con foto, precio, tallas, botón WhatsApp |

## Panel Admin (`/admin`)
### Funcionalidades
- **Dashboard** — Lista de todos los productos con foto, precio, categoría
- **Nuevo Producto** — Formulario completo con subida de imágenes drag & drop
- **Editar Producto** — Modificar cualquier producto existente
- **Eliminar Producto** — Con confirmación antes de borrar
- **Cerrar Sesión** — Botón en el menú lateral

### Campos del formulario
1. **Nombre del producto** — Texto
2. **Precio** — Número (Q)
3. **Categoría** — Select (Mujer / Hombre)
4. **Subcategoría** — Select (se actualiza según categoría)
5. **Descripción** — Textarea
6. **Tallas** — JSON array (ej: `["Ch", "M", "G", "XG"]`)
7. **WhatsApp** — Número de contacto
8. **Destacado** — Checkbox (aparece en la página de inicio)
9. **Imágenes** — Arrastrar y soltar o seleccionar archivos

## Flujo de la Cliente (Dueña)
1. Abre `https://tuboutique.com/admin`
2. Ingresa con usuario y contraseña
3. Presiona **"+ Nuevo Producto"**
4. Llena los campos (nombre, precio, foto, tallas, etc.)
5. Los productos aparecen automáticamente en la tienda
6. Si se equivoca, puede editar o eliminar desde el Dashboard

## Flujo del Comprador
```
Web → Navega categorías → Abre producto
  → Ve precio, fotos, tallas disponibles
  → Presiona "Comprar por WhatsApp"
  → Mensaje automático con producto y precio
  → Cliente deposita → envía comprobante → Boutique despacha
```

## Instalación Local

### Requisitos
- Node.js 22 (usar nvm)
- npm

### 1. Clonar e instalar dependencias
```bash
git clone <repo-url>
cd Boutique

# Backend
cd backend
nvm use 22
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar variables de entorno

**Frontend** — `frontend/.env.local`:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=<token_generado_en_strapi>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<contraseña_segura>
```

**Backend** — `backend/.env`:
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generado_por_strapi>
API_TOKEN_SALT=<generado_por_strapi>
ADMIN_JWT_SECRET=<generado_por_strapi>
TRANSFER_TOKEN_SALT=<generado_por_strapi>
```

### 3. Iniciar servidores
```bash
# Terminal 1 - Backend (Strapi)
cd backend
nvm use 22
npm run develop

# Terminal 2 - Frontend (Next.js)
cd frontend
nvm use 22
npm run dev
```

### 4. Abrir en el navegador
- **Tienda:** `http://localhost:3000`
- **Admin panel:** `http://localhost:3000/admin`
- **Admin Strapi:** `http://localhost:1337/admin`

## Despliegue a Producción

### Opción 1: Vercel + Render (Recomendado, $0/mes)

**Backend (Strapi) en Render:**
1. Crear cuenta en https://render.com
2. Conectar repositorio de GitHub
3. Crear nuevo **Web Service**
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Plan: Free ($0/mes)
4. Agregar variables de entorno desde `.env`
5. Usar **PostgreSQL externo** (Supabase gratis o Neon)
   - Crear DB en https://supabase.com
   - Configurar `DATABASE_URL` y `DATABASE_SSL` en Render

**Frontend (Next.js) en Vercel:**
1. Crear cuenta en https://vercel.com
2. Importar repositorio de GitHub
3. Root Directory: `frontend`
4. Framework: Next.js (se detecta automático)
5. Variables de entorno:
   ```env
   NEXT_PUBLIC_STRAPI_URL=https://<tu-backend>.onrender.com
   STRAPI_API_TOKEN=<token_de_strapi>
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<contraseña_segura>
   ```
6. Desplegar

**Dominio personalizado:**
- Comprar dominio (.com ~Q120/año en Namecheap o GoDaddy)
- Configurar DNS en Vercel: Settings → Domains
- Configurar subdominio para Strapi API si es necesario

### Opción 2: Todo en Vercel (Más fácil, backend serverless)

Alternativa usando SQLite en Vercel con Turso o Neon:
1. Backend desplegado como función serverless
2. Base de datos externa (Turso/Neon)
3. Misma configuración de frontend

### Opción 3: Servidor VPS (Más control)
- DigitalOcean ($6/mes), Hostinger, o cualquier VPS
- Instalar Node.js 22, PM2, Nginx
- Clonar repo, construir y servir con PM2
- Usar Nginx como reverse proxy para Strapi y Next.js

## Migrar de SQLite a PostgreSQL (producción)

Cuando despliegues a producción:
1. Crear base de datos PostgreSQL en Supabase (gratis)
2. Instalar driver de PostgreSQL en Strapi:
   ```bash
   cd backend
   npm install pg
   ```
3. Configurar `database.ts` en Strapi para usar PostgreSQL
4. Migrar datos con el comando de Strapi:
   ```bash
   npm run strapi configuration:dump
   # Configurar nueva DB y luego
   npm run strapi configuration:restore
   ```

## Costos
| Concepto | Precio |
|---|---|
| Dominio .com (año) | ~Q120 |
| Desarrollo frontend + backend | Q2,000 - Q2,500 |
| Hosting (Vercel + Render) | $0/mes |
| Base de datos (Supabase) | $0/mes |
| **Total primer año** | **~Q2,500** |
| Mantenimiento opcional/mes | Q100-150 |

## No incluye
- Pagos en línea (tarjeta, depósito automático)
- Carrito de compras
- Registro de usuarios
- Facturación electrónica (FEL)
- Gestión de envíos
- Notificaciones por correo

## Estructura del Proyecto
```
Boutique/
├── backend/                    # Strapi CMS
│   ├── config/
│   ├── src/
│   │   ├── api/
│   │   │   └── product/       # Content type Producto
│   │   └── index.ts
│   ├── .env
│   └── package.json
│
├── frontend/                   # Next.js + Tailwind
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/         # Panel admin custom
│   │   │   ├── api/           # API routes (proxy a Strapi)
│   │   │   ├── mujer/
│   │   │   ├── hombre/
│   │   │   ├── producto/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── admin/         # Admin components
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── WhatsAppButton.tsx
│   │   ├── lib/
│   │   │   ├── admin-auth.ts  # Auth utilities
│   │   │   └── strapi.ts      # API client
│   │   └── types/
│   │       └── product.ts
│   ├── .env.local
│   ├── next.config.ts
│   └── package.json
│
└── planificacionboutique.md
```
