# EMAS Boutique — Plan del Proyecto

## Stack Actual
- **Frontend:** Next.js 16.2.7 (Turbopack), React 19.2.4, TypeScript, Tailwind CSS v4
- **Base de datos:** Supabase PostgreSQL (`us-east-2`, pooler `aws-1-us-east-2.pooler.supabase.com:6543`, proyecto `xyjfrchczlyomomczjki`)
- **Imágenes:** Cloudinary (`dt9ad6ovb`)
- **Hosting:** Vercel (proyecto `frontend` bajo `gioores-projects`, root dir `frontend/`)
- **Costo:** $0/mes (Vercel free + Supabase free + Cloudinary free + dominio ~$10/año)

## URLs
| Sitio | URL |
|---|---|
| **Tienda (producción)** | `https://frontend-eight-alpha-17.vercel.app` |
| **Admin panel** | `https://frontend-eight-alpha-17.vercel.app/admin` |
| **Local** | `http://localhost:3000` |

## Credenciales Admin
- **Usuario:** `admin`
- **Contraseña (dev):** `boutique2025`
- **Cambiar en:** Variables de entorno de Vercel → `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- **Advertencia:** En development se logea un warning si se usan credenciales default

## Arquitectura (sin Strapi)
```
Next.js (serverless en Vercel)
├── Páginas públicas  → consultan DB directo (pg)
├── Panel admin       → API routes internas → DB
└── Uploads           → Cloudinary (firma HMAC-SHA1)
```

No hay backend separado. Todo es Next.js API routes + PostgreSQL directo.

## Variables de Entorno (Vercel)
| Variable | Propósito |
|---|---|
| `DATABASE_URL` | Supabase pg connection string |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name |
| `CLOUDINARY_API_KEY` | API key |
| `CLOUDINARY_API_SECRET` | API secret |
| `ADMIN_USERNAME` | Usuario admin |
| `ADMIN_PASSWORD` | Contraseña admin |
| `ADMIN_SESSION_SECRET` | HMAC secret para sesiones |
| `NEXT_PUBLIC_SITE_URL` | URL canónica (fallback a Vercel URL o emasboutique.com) |

## Estructura del Proyecto (actual)
```
Boutique/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (shop)/            # Páginas públicas
│   │   │   │   ├── page.tsx       # Home (hero, destacados, novedades)
│   │   │   │   ├── catalogo/      # Catálogo completo con filtros
│   │   │   │   ├── mujer/         # Catálogo filtrado mujer
│   │   │   │   ├── hombre/        # Catálogo filtrado hombre
│   │   │   │   ├── producto/[slug]/ # Detalle de producto
│   │   │   │   └── ...            # FAQ, envíos, términos, privacidad
│   │   │   ├── admin/             # Panel admin
│   │   │   │   ├── page.tsx       # Dashboard (CRUD productos)
│   │   │   │   ├── login/         # Login
│   │   │   │   ├── categorias/    # CRUD categorías
│   │   │   │   ├── subcategorias/ # CRUD subcategorías
│   │   │   │   ├── marcas/        # CRUD marcas
│   │   │   │   ├── productos/     # Nuevo/editar producto
│   │   │   │   └── configuracion/ # Config del sitio
│   │   │   └── api/admin/         # REST APIs
│   │   │       ├── products/      # CRUD productos
│   │   │       ├── categories/    # CRUD categorías
│   │   │       ├── subcategories/ # CRUD subcategorías
│   │   │       ├── brands/        # CRUD marcas
│   │   │       ├── upload/        # Subida a Cloudinary
│   │   │       ├── config/        # Config del sitio (DB)
│   │   │       ├── login/         # Auth con rate limiter
│   │   │       ├── logout/        # Cerrar sesión
│   │   │       └── me/            # Verificar sesión
│   │   ├── components/
│   │   │   ├── admin/             # Admin components
│   │   │   ├── catalog/           # CatalogView con filtros
│   │   │   ├── Header.tsx         # Nav con drawer mobile
│   │   │   ├── Hero.tsx           # Hero animado
│   │   │   ├── ProductCard.tsx    # Card con overlay
│   │   │   ├── ProductBuyClient.tsx # Botón WhatsApp colores/tallas
│   │   │   ├── Footer.tsx         # Footer completo
│   │   │   └── ErrorFallback.tsx  # Error boundary compartido
│   │   └── lib/
│   │       ├── db.ts              # pg Pool + helpers
│   │       ├── config.ts          # SITE_CONFIG + SITE_URL
│   │       ├── queries.ts         # Home queries (JOIN con brands)
│   │       ├── catalog.ts         # Catalog queries (JOIN completo)
│   │       ├── format-product.ts   # Formateador compartido
│   │       ├── images.ts          # getImageUrl()
│   │       └── admin-auth-server.ts # Sesiones HMAC + cookies httpOnly
│   └── migrations/                # SQL migrations
├── test-results/                  # Playwright logs
└── planificacionboutique.md
```

## Modelo Producto (DB)
| Campo | Tipo | Descripción |
|---|---|---|
| id | serial | PK |
| name | text | Nombre |
| slug | text | URL única |
| price | numeric | Precio en GTQ |
| old_price | numeric | Precio anterior (oferta) |
| description | text | HTML |
| category | text | 'mujer' / 'hombre' |
| subcategory | text | Nombre |
| category_id | int | FK a categories |
| subcategory_id | int | FK a subcategories |
| brand_id | int | FK a brands |
| sizes | jsonb | Array de tallas |
| images | jsonb | Array `{url, width, height, public_id}` |
| colors | jsonb | Array de strings (nombre o `#hex`) |
| tags | jsonb | Array de strings |
| featured | boolean | Destacado en home |
| new_arrival | boolean | Novedad |
| on_sale | boolean | En oferta |
| availability | text | available / low_stock / out_of_stock / pre_order |
| sku | text | Código interno |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## Páginas Públicas
| Ruta | Descripción |
|---|---|
| `/` | Hero animado + stats + productos destacados + novedades + ofertas + marcas + Why EMAS + Testimonios |
| `/catalogo` | Catálogo completo con filtros (categoría, subcategoría, marca, talla, precio, disponibilidad, búsqueda) |
| `/mujer` | Catálogo filtrado mujer |
| `/hombre` | Catálogo filtrado hombre |
| `/producto/[slug]` | Galería de imágenes, precio, colores, tallas, descripción, productos relacionados, WhatsApp |
| `/quienes-somos` | Información |
| `/contacto` | Contacto |
| `/faq` | Preguntas frecuentes |
| `/envios` | Política de envíos |
| `/cambios-devoluciones` | Cambios y devoluciones |
| `/guia-de-tallas` | Guía de tallas |
| `/privacidad` | Privacidad |
| `/terminos` | Términos |

## Panel Admin (`/admin`)
### Funcionalidades
- **Dashboard** — Lista + búsqueda + eliminar productos
- **Categorías** — CRUD con slug único
- **Subcategorías** — CRUD con slug único
- **Marcas** — CRUD con slug único
- **Productos** — Crear/editar con subida de imágenes drag & drop, colores, tallas, tags
- **Configuración** — Nombre, tagline, descripción, WhatsApp, Instagram, hero, footer (guardado en DB)
- **Login** — Con rate limiter (8 intentos/15min)

### Campos del formulario de producto
1. **Nombre** — Texto
2. **Precio** — Número
3. **Categoría** — Select dinámico
4. **Subcategoría** — Select (filtrado por categoría)
5. **Marca** — Select
6. **SKU** — Texto
7. **Descripción** — Textarea (HTML)
8. **Tallas** — Checkboxes (ropa + zapatos)
9. **Colores** — Texto separado por comas (nombre o `#hex`)
10. **Tags** — Texto separado por comas
11. **Disponibilidad** — Select
12. **Destacado / Novedad / Oferta** — Checkboxes
13. **Precio anterior** — Número (solo si oferta activa)
14. **Imágenes** — Drag & drop con previsualización

## APIs Internas
| Ruta | Métodos | Auth |
|---|---|---|
| `/api/admin/products` | GET, POST | Sí |
| `/api/admin/products/[id]` | GET, PUT, DELETE | Sí |
| `/api/admin/categories` | GET, POST | Sí |
| `/api/admin/categories/[id]` | GET, PUT, DELETE | Sí |
| `/api/admin/subcategories` | GET, POST | Sí |
| `/api/admin/subcategories/[id]` | GET, PUT, DELETE | Sí |
| `/api/admin/brands` | GET, POST | Sí |
| `/api/admin/brands/[id]` | GET, PUT, DELETE | Sí |
| `/api/admin/upload` | POST | Sí |
| `/api/admin/config` | GET, POST | Sí |
| `/api/admin/login` | POST | No |
| `/api/admin/logout` | POST | No |
| `/api/admin/me` | GET | No (retorna 401 si no auth) |

## Flujo de la Cliente (Dueña)
1. Abre `https://<site>/admin` → login
2. Dashboard ve todos los productos
3. "+ Nuevo Producto" → llena formulario → sube fotos → guarda
4. Producto aparece automáticamente en la tienda
5. Puede editar o eliminar desde el Dashboard
6. Puede configurar nombre del sitio, WhatsApp, etc. en Configuración

## Flujo del Comprador
```
Web → Navega (home / catálogo / mujer / hombre)
  → Filtra por categoría, marca, talla, precio
  → Abre producto → ve fotos, precio, colores, tallas
  → Presiona "Comprar por WhatsApp"
  → Mensaje automático con producto, precio, talla y enlace
  → Cliente deposita → envía comprobante → Boutique despacha
```

## Convenciones Técnicas
- `revalidateTag(tag, profile)` — requiere 2 args en Next.js 16 (ej: `revalidateTag('catalog', 'max')`)
- `requireAuth()` — usado en todas las API routes admin, lanza `'No autorizado'` si falla
- `formatProduct()` — función compartida en `lib/format-product.ts`, usada por queries.ts, catalog.ts y producto/[slug]/page.tsx
- Colores — aceptan nombre (`negro`) o hex (`#1c1917`) en el array de colores del producto
- `site_config` — tabla auto-creada en DB al primer acceso a `/api/admin/config`
- Rate limiter — cleanup lazy de expirados (no setInterval)

## Instalación Local
```bash
git clone <repo-url>
cd Boutique/frontend
npm install
cp .env.local.example .env.local  # configurar DATABASE_URL etc.
npm run dev
```

## Despliegue
```bash
cd frontend
git add -A && git commit -m "mensaje" && git push
# Vercel deploy automático desde master
```

## Costos
| Concepto | Precio |
|---|---|
| Dominio .com (año) | ~Q120 |
| Desarrollo | Q2,000 - Q2,500 |
| Hosting (Vercel) | $0/mes |
| Base de datos (Supabase) | $0/mes |
| Imágenes (Cloudinary) | $0/mes |
| **Total primer año** | **~Q2,500** |

## No incluye (deliberadamente)
- Pagos en línea (tarjeta, depósito automático)
- Carrito de compras
- Registro de usuarios
- Facturación electrónica (FEL)
- Gestión de envíos
- Notificaciones por correo
- Todo va por WhatsApp

## Historial de Cambios Recientes
| Fecha | Cambios |
|---|---|
| Jun 2026 | QA completo: ~35 bugs/mejoras (XSS, Cloudinary secret, rate limiter, a11y, formatProduct compartido, colores hex, config DB, etc.) |
| Jun 2026 | UI redesign: Hero animado, Header drawer, Footer, home stats/Why EMAS/Testimonios, filtros slide-in, sticky WhatsApp bar |
| Jun 2026 | Migración de Strapi a Next.js serverless + PostgreSQL directo |
