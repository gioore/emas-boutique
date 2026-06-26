# Plan Maestro de Pruebas — EMAS Boutique

| Campo | Valor |
|---|---|
| **Proyecto** | EMAS Boutique — Catálogo Web |
| **Documento** | Plan Maestro de Pruebas (Master Test Plan) |
| **Versión** | 1.0 |
| **Fecha** | 26 Junio 2026 |
| **Basado en** | Auditoría Técnica v3 (Post R1–R8) |

---

## Fase 1 — Definición del Alcance

### 1.1 Qué será probado

| Módulo | Funcionalidades |
|---|---|
| **Página principal** | Carga, visualización de secciones (Hero, Nuevos Ingresos, Categorías, Ofertas, Marcas, Testimonios, CTA), navegación a catálogo y categorías |
| **Catálogo de productos** | Listado completo, filtro por categoría (Mujer/Hombre/Todo), filtro por marca, búsqueda, ordenamiento, paginación (si aplica), carga de imágenes |
| **Página de producto** | Información del producto, imágenes (galería), precio, tallas/disponibilidad, colores, descripción, productos relacionados, botón "Agregar al carrito" |
| **Carrito de compras** | Agregar producto, modificar cantidades, eliminar producto, persistencia, calcular total, actualización de contador |
| **Pedido por WhatsApp** | Generación de mensaje, formato correcto, datos del pedido, apertura de WhatsApp, enlace funcional |
| **Panel administrativo — Login** | Autenticación, validación de credenciales, rate limiting, cambio de contraseña, cierre de sesión |
| **Panel administrativo — Productos** | CRUD: crear, editar, eliminar; validaciones, imágenes, precios, slugs, disponibilidad, sync de secuencias |
| **Panel administrativo — Categorías** | CRUD: crear, editar, eliminar; validación de dependencias (subcategorías, productos), slugs únicos |
| **Panel administrativo — Subcategorías** | CRUD: crear, editar, eliminar; validación de dependencias (productos), slugs únicos |
| **Panel administrativo — Marcas** | CRUD: crear, editar, eliminar; validación de dependencias (productos), slugs únicos |
| **Panel administrativo — Imágenes** | Subida a Cloudinary, formatos permitidos, límite de tamaño, validación de tipos |
| **Panel administrativo — Sidebar** | Navegación, cambio de contraseña (modal con validación) |
| **Integraciones** | Frontend ↔ API Routes ↔ PostgreSQL Neon, Cloudinary, WhatsApp |

### 1.2 Qué NO será probado

- Funcionalidades inexistentes (pagos online, registro de usuarios, favoritos, historial de pedidos, dashboards, reportes)
- Carga masiva (stress testing) fuera del alcance del proyecto
- Pruebas de accesibilidad (WCAG) completas
- Pruebas de seguridad avanzadas (penetration testing)
- Compatibilidad con navegadores antiguos (IE11, etc.)

### 1.3 Riesgos conocidos (de la auditoría)

| Riesgo | Severidad | Impacto en pruebas |
|---|---|---|
| **Cold start Neon (~500ms)** | Alto | Primer request tras inactividad puede ser lento. Considerar en criterios de aceptación |
| **Sin paginación server-side en admin** | Medio | Probar con volúmenes grandes de productos; la carga completa puede degradar UX |
| **`use cache` no utilizado** | Bajo | Las consultas del home page dependen de ISR de 60s; puede haber datos ligeramente desactualizados |
| **Imágenes Cloudinary sin fallback local** | Bajo | Si Cloudinary falla, las imágenes no se muestran |

---

## Fase 2 — Estrategia de Pruebas

| Tipo de prueba | Enfoque | Prioridad |
|---|---|---|
| **Funcionales** | Validar cada flujo de usuario y administrador según casos de prueba | Crítica |
| **Integración** | Verificar comunicación correcta entre frontend, API, DB, Cloudinary y WhatsApp | Alta |
| **UI/UX** | Verificar visualización correcta, mensajes de error, estados vacíos, feedback al usuario | Alta |
| **Validación de formularios** | Probar entradas válidas, inválidas, límites, campos requeridos | Alta |
| **Navegación** | Enlaces, breadcrumbs, redirecciones, páginas 404 | Media |
| **Permisos/Autorización** | Acceso a rutas admin sin sesión, expiración de token, rutas públicas | Alta |
| **Consistencia de datos** | Verificar que cambios en admin se reflejan en el catálogo público | Alta |
| **Regresión** | Repetir casos críticos tras cada cambio para asegurar estabilidad | Alta |
| **Exploratorias** | Navegación libre para detectar comportamientos inesperados | Media |
| **Responsivas** | Pruebas en móvil (320px–428px), tablet (768px–1024px), escritorio (1280px+) | Alta |
| **Rendimiento** | Tiempos de carga de página, consultas DB, carga de imágenes | Media |
| **Seguridad básica** | XSS, SQL injection indirecto, acceso directo a rutas protegidas, exposición de errores | Alta |

---

## Fase 3 — Casos de Prueba Funcionales

### 3.1 Página Principal

| ID | Caso | Prioridad |
|---|---|---|
| WEB-HOME-001 | Carga correcta de la página principal con todas las secciones | Alta |
| WEB-HOME-002 | Hero section se renderiza con imagen de fondo y llamado a la acción | Alta |
| WEB-HOME-003 | Sección "Nuevos Ingresos" muestra hasta 8 productos con datos correctos | Media |
| WEB-HOME-004 | Sección "Categorías" muestra enlaces funcionales a /mujer y /hombre | Alta |
| WEB-HOME-005 | Sección "Ofertas Especiales" muestra productos con on_sale=true | Media |
| WEB-HOME-006 | Sección "Marcas" lista marcas activas (filtradas por active=true) | Baja |
| WEB-HOME-007 | Sección "Testimonios" renderiza testimonios desde config.ts | Baja |
| WEB-HOME-008 | Enlace "Ver Catálogo Completo" navega a /catalogo | Media |
| WEB-HOME-009 | Botón "Pedir por WhatsApp" abre WhatsApp con mensaje predeterminado | Alta |
| WEB-HOME-010 | Las secciones se ocultan cuando no hay datos (ej: sin ofertas, sin destacados) | Media |

### 3.2 Catálogo de Productos

| ID | Caso | Prioridad |
|---|---|---|
| WEB-CAT-001 | Carga de /catalogo lista todos los productos disponibles | Alta |
| WEB-CAT-002 | /mujer lista solo productos de la categoría "Mujer" | Alta |
| WEB-CAT-003 | /hombre lista solo productos de la categoría "Hombre" | Alta |
| WEB-CAT-004 | Filtro por marca (?marca=ID) filtra productos correctamente | Alta |
| WEB-CAT-005 | Búsqueda por texto encuentra productos por nombre | Alta |
| WEB-CAT-006 | Ordenamiento por precio (asc/desc) funciona correctamente | Media |
| WEB-CAT-007 | Ordenamiento por novedad (más recientes primero) funciona | Media |
| WEB-CAT-008 | Cada tarjeta de producto muestra: imagen, nombre, precio, marca | Alta |
| WEB-CAT-009 | Precio en oferta muestra tachado + precio actual + porcentaje descuento | Alta |
| WEB-CAT-010 | Producto agotado muestra indicador visual "Agotado" | Media |
| WEB-CAT-011 | Click en tarjeta navega a /producto/[slug] | Alta |
| WEB-CAT-012 | Las categorías y subcategorías se listan correctamente en el sidebar/filtro | Alta |
| WEB-CAT-013 | Productos sin stock no se muestran (según disponibilidad) | Media |

### 3.3 Página de Producto

| ID | Caso | Prioridad |
|---|---|---|
| WEB-PROD-001 | Carga de /producto/[slug] muestra datos completos del producto | Alta |
| WEB-PROD-002 | Galería de imágenes muestra todas las imágenes del producto | Alta |
| WEB-PROD-003 | Click en imagen de galería la expande/cambia la imagen principal | Media |
| WEB-PROD-004 | Precio, nombre, marca y SKU se muestran correctamente | Alta |
| WEB-PROD-005 | Precio en oferta muestra oldPrice tachado y badge de descuento | Alta |
| WEB-PROD-006 | Disponibilidad se muestra con etiqueta y color correctos | Alta |
| WEB-PROD-007 | Tallas disponibles se muestran como opciones seleccionables | Alta |
| WEB-PROD-008 | Colores disponibles se muestran (si aplica) | Baja |
| WEB-PROD-009 | Descripción del producto renderiza texto plano seguro (sin HTML) | Alta |
| WEB-PROD-010 | Productos relacionados se muestran si existen en la misma subcategoría | Media |
| WEB-PROD-011 | Breadcrumb muestra navegación correcta: Inicio > Catálogo > Categoría > Producto | Baja |
| WEB-PROD-012 | Botón "Agregar al carrito" agrega el producto al carrito | Alta |
| WEB-PROD-013 | Meta tags y Open Graph se generan correctamente | Media |
| WEB-PROD-014 | Producto no existente (slug inválido) muestra página 404 | Alta |

### 3.4 Carrito de Compras

| ID | Caso | Prioridad |
|---|---|---|
| WEB-CART-001 | Agregar producto al carrito incrementa el contador | Alta |
| WEB-CART-002 | Agregar producto con talla seleccionada la registra en el carrito | Alta |
| WEB-CART-003 | Agregar producto sin talla (si es requerida) muestra validación | Alta |
| WEB-CART-004 | Modificar cantidad de un producto en el carrito actualiza subtotal | Alta |
| WEB-CART-005 | Eliminar un producto del carrito lo remueve y actualiza el contador | Alta |
| WEB-CART-006 | El carrito persiste al navegar entre páginas (localStorage/sessionStorage) | Alta |
| WEB-CART-007 | El carrito muestra resumen: productos, cantidades, total | Alta |
| WEB-CART-008 | Carrito vacío muestra estado vacío con mensaje y enlace al catálogo | Media |
| WEB-CART-009 | Agregar el mismo producto dos veces incrementa cantidad (no duplica) | Alta |
| WEB-CART-010 | Modificar cantidad a 0 elimina el producto del carrito | Alta |
| WEB-CART-011 | El total se calcula correctamente (precio × cantidad para cada item) | Alta |

### 3.5 Pedido por WhatsApp

| ID | Caso | Prioridad |
|---|---|---|
| WEB-WHATS-001 | Botón "Enviar por WhatsApp" genera enlace con número correcto | Alta |
| WEB-WHATS-002 | El mensaje incluye todos los productos del carrito con cantidades | Alta |
| WEB-WHATS-003 | El mensaje incluye el subtotal | Alta |
| WEB-WHATS-004 | El mensaje incluye observaciones si el usuario ingresó alguna | Baja |
| WEB-WHATS-005 | El enlace abre WhatsApp Web o app correctamente | Alta |
| WEB-WHATS-006 | El número de WhatsApp proviene de SITE_CONFIG.whatsapp | Alta |
| WEB-WHATS-007 | Carrito vacío no permite enviar pedido | Alta |
| WEB-WHATS-008 | El formato del mensaje es legible y profesional | Media |

### 3.6 Panel Administrativo — Login

| ID | Caso | Prioridad |
|---|---|---|
| ADM-LOGIN-001 | Login con credenciales correctas inicia sesión y redirige al panel | Alta |
| ADM-LOGIN-002 | Login con credenciales incorrectas muestra error "Credenciales inválidas" | Alta |
| ADM-LOGIN-003 | 8 intentos fallidos bloquea por 15 minutos (rate limiting) | Alta |
| ADM-LOGIN-004 | Sesión expirada redirige al login | Alta |
| ADM-LOGIN-005 | Cerrar sesión invalida la cookie y redirige al login | Alta |
| ADM-LOGIN-006 | Acceder a ruta admin sin sesión redirige al login | Alta |
| ADM-LOGIN-007 | Cambio de contraseña desde el sidebar funciona con validación | Alta |
| ADM-LOGIN-008 | Cambio de contraseña con contraseña actual incorrecta rechaza | Alta |
| ADM-LOGIN-009 | Nueva contraseña con menos de 6 caracteres rechaza | Alta |

### 3.7 Panel Administrativo — Productos

| ID | Caso | Prioridad |
|---|---|---|
| ADM-PROD-001 | Listado de productos carga con todos los campos | Alta |
| ADM-PROD-002 | Crear producto con datos válidos guarda correctamente | Alta |
| ADM-PROD-003 | Slug se genera automáticamente desde el nombre si no se provee | Alta |
| ADM-PROD-004 | Slug duplicado genera slug único con sufijo numérico | Alta |
| ADM-PROD-005 | Editar producto actualiza datos y slug se regenera si cambia nombre | Alta |
| ADM-PROD-006 | Eliminar producto lo borra de la DB y limpia imágenes en Cloudinary | Alta |
| ADM-PROD-007 | Validación: nombre requerido | Alta |
| ADM-PROD-008 | Validación: precio requerido y debe ser número ≥ 0 | Alta |
| ADM-PROD-009 | Validación: al menos una talla requerida si se envían sizes | Media |
| ADM-PROD-010 | Validación: availability debe ser un valor válido de la lista | Media |
| ADM-PROD-011 | Imágenes se guardan como JSON array en la DB | Alta |
| ADM-PROD-012 | Producto creado dispara revalidateTag('catalog', 'max') | Alta |
| ADM-PROD-013 | Producto con featured=true aparece en sección "Destacados" del home | Alta |
| ADM-PROD-014 | Producto con new_arrival=true aparece en "Nuevos Ingresos" | Alta |
| ADM-PROD-015 | Producto con on_sale=true aparece en "Ofertas Especiales" | Alta |
| ADM-PROD-016 | Editar sube imagen a Cloudinary y asigna public_id | Alta |
| ADM-PROD-017 | Eliminar producto con imágenes las borra de Cloudinary | Alta |
| ADM-PROD-018 | syncSequence se ejecuta tras crear producto | Baja |

### 3.8 Panel Administrativo — Categorías

| ID | Caso | Prioridad |
|---|---|---|
| ADM-CAT-001 | Listado de categorías carga con orden correcto | Alta |
| ADM-CAT-002 | Crear categoría con nombre y slug válido | Alta |
| ADM-CAT-003 | Slug se genera automáticamente usando slugify() | Alta |
| ADM-CAT-004 | Slug duplicado genera slug único con sufijo numérico | Alta |
| ADM-CAT-005 | Editar categoría actualiza nombre, slug, descripción, orden, activo | Alta |
| ADM-CAT-006 | Eliminar categoría sin productos ni subcategorías funciona | Alta |
| ADM-CAT-007 | Eliminar categoría con productos asociados rechaza con mensaje claro | Alta |
| ADM-CAT-008 | Eliminar categoría con subcategorías asociadas rechaza con mensaje claro | Alta |
| ADM-CAT-009 | Validación: nombre requerido | Alta |
| ADM-CAT-010 | Crear/editar dispara revalidateTag('catalog', 'max') | Media |
| ADM-CAT-011 | Categoría inactiva no aparece en el catálogo público | Alta |

### 3.9 Panel Administrativo — Subcategorías

| ID | Caso | Prioridad |
|---|---|---|
| ADM-SUBCAT-001 | Listado de subcategorías incluye nombre de categoría padre | Alta |
| ADM-SUBCAT-002 | Crear subcategoría con nombre, slug y categoría padre válida | Alta |
| ADM-SUBCAT-003 | Slug duplicado genera slug único | Alta |
| ADM-SUBCAT-004 | Editar subcategoría actualiza datos correctamente | Alta |
| ADM-SUBCAT-005 | Eliminar subcategoría sin productos asociados funciona | Alta |
| ADM-SUBCAT-006 | Eliminar subcategoría con productos asociados rechaza | Alta |
| ADM-SUBCAT-007 | Validación: nombre requerido | Alta |
| ADM-SUBCAT-008 | Validación: categoría padre requerida | Alta |
| ADM-SUBCAT-009 | Crear/editar/eliminar dispara revalidateTag('catalog', 'max') | Media |

### 3.10 Panel Administrativo — Marcas

| ID | Caso | Prioridad |
|---|---|---|
| ADM-BRAND-001 | Listado de marcas carga en orden alfabético | Alta |
| ADM-BRAND-002 | Crear marca con nombre, slug y logo | Alta |
| ADM-BRAND-003 | Slug duplicado genera slug único | Alta |
| ADM-BRAND-004 | Editar marca actualiza datos correctamente | Alta |
| ADM-BRAND-005 | Eliminar marca sin productos asociados funciona | Alta |
| ADM-BRAND-006 | Eliminar marca con productos asociados rechaza | Alta |
| ADM-BRAND-007 | Validación: nombre requerido | Alta |
| ADM-BRAND-008 | Marca inactiva no aparece en home ni filtros | Alta |
| ADM-BRAND-009 | Crear/editar/eliminar dispara revalidateTag('catalog', 'max') | Media |

### 3.11 Panel Administrativo — Imágenes (Subida)

| ID | Caso | Prioridad |
|---|---|---|
| ADM-IMG-001 | Subir imagen JPEG válida (<10MB) a Cloudinary retorna URL y public_id | Alta |
| ADM-IMG-002 | Subir imagen PNG válida funciona | Alta |
| ADM-IMG-003 | Subir imagen WebP válida funciona | Alta |
| ADM-IMG-004 | Subir archivo >10MB rechaza con mensaje claro | Alta |
| ADM-IMG-005 | Subir tipo no permitido (GIF, SVG, PDF) rechaza | Alta |
| ADM-IMG-006 | Subir múltiples archivos (hasta 8) funciona | Alta |
| ADM-IMG-007 | Subir más de 8 archivos rechaza | Media |
| ADM-IMG-008 | Error de Cloudinary se maneja y muestra mensaje al usuario | Alta |

---

## Fase 4 — Casos Negativos

| ID | Módulo | Caso | Prioridad |
|---|---|---|---|
| NEG-001 | General | Navegar a URL inexistente muestra página 404 personalizada | Alta |
| NEG-002 | General | Enviar request malformado a API devuelve error 400/500 manejado | Alta |
| NEG-003 | General | Caracteres especiales en búsqueda (SQL injection attempt) no rompen el sistema | Alta |
| NEG-004 | General | Script injection en campos de texto (XSS attempt) no se ejecuta | Alta |
| NEG-005 | Producto | Slug inválido en URL devuelve 404 | Alta |
| NEG-006 | Producto | Precio negativo en API rechazado | Alta |
| NEG-007 | Admin | Token de sesión inválido/expirado devuelve 401 | Alta |
| NEG-008 | Admin | Modificar producto con ID inexistente devuelve 404 | Alta |
| NEG-009 | Admin | Eliminar categoría con productos activos rechaza | Alta |
| NEG-010 | Admin | Eliminar subcategoría con productos activos rechaza | Alta |
| NEG-011 | Admin | Eliminar marca con productos activos rechaza | Alta |
| NEG-012 | Admin | Subir archivo vacío a Cloudinary rechaza | Media |
| NEG-013 | Admin | Login con usuario vacío rechaza | Alta |
| NEG-014 | Admin | Login con contraseña vacía rechaza | Alta |
| NEG-015 | Admin | Rate limiting: 9+ intentos fallidos bloquean | Alta |
| NEG-016 | Carrito | Agregar producto sin existencias (out_of_stock) muestra mensaje | Media |
| NEG-017 | Catálogo | Filtro con marca inexistente no rompe la página | Media |

---

## Fase 5 — Pruebas de Integración

| ID | Caso | Objetivo | Prioridad |
|---|---|---|---|
| INT-001 | Crear producto en admin → visible en catálogo público | Verificar flujo completo DB → API → Frontend | Alta |
| INT-002 | Editar producto en admin → cambios reflejados en público tras revalidate | Verificar revalidateTag funciona | Alta |
| INT-003 | Eliminar producto en admin → desaparece del catálogo | Verificar DELETE + cache invalidation | Alta |
| INT-004 | Crear categoría → visible en admin y catálogo | Verificar consistencia | Alta |
| INT-005 | Desactivar categoría → no visible en catálogo | Verificar filtro active=true | Alta |
| INT-006 | Subir imagen a Cloudinary desde admin → URL usable en producto | Verificar integración Cloudinary | Alta |
| INT-007 | Agregar producto al carrito → datos correctos en WhatsApp | Verificar flujo carrito → WhatsApp | Alta |
| INT-008 | Login admin → cookie de sesión → acceso a rutas protegidas | Verificar auth HMAC + cookie | Alta |
| INT-009 | Cambiar contraseña → nuevo login funciona, viejo rechaza | Verificar hash update | Alta |
| INT-010 | syncSequence tras INSERT → próximo INSERT usa ID correcto | Verificar consistencia de secuencias | Baja |

---

## Fase 6 — Pruebas de Rendimiento

| ID | Caso | Criterio |
|---|---|---|
| PERF-001 | Carga de página principal | <2s en primera visita (con cold start), <500ms en visitas posteriores (con ISR) |
| PERF-002 | Carga de catálogo completo | <3s con cold start, <800ms con caché activa |
| PERF-003 | Carga de página de producto | <2s con cold start, <500ms en adelante |
| PERF-004 | Subida de imagen a Cloudinary | <5s para imagen de 2MB |
| PERF-005 | Consulta de listado de productos (admin) | <1s para 100 productos |
| PERF-006 | Login | <1s en respuesta (scrypt <50ms, query DB <100ms) |

Nota: Los tiempos incluyen cold start de Neon (~500ms) en el primer query tras inactividad. Estos tiempos son aceptables para el tráfico esperado de una boutique.

---

## Fase 7 — Pruebas de Seguridad Básica

| ID | Caso | Prioridad |
|---|---|---|
| SEC-001 | Acceso directo a /admin sin sesión redirige a /admin/login | Alta |
| SEC-002 | Acceso directo a API route admin sin token devuelve 401 | Alta |
| SEC-003 | Inyección SQL en parámetros de búsqueda no afecta la DB | Alta |
| SEC-004 | Script injection en nombre de producto no se ejecuta en frontend | Alta |
| SEC-005 | Script injection en descripción no se ejecuta (whitespace-pre-line) | Alta |
| SEC-006 | Token de sesión HMAC no puede ser falsificado sin secret | Alta |
| SEC-007 | Cookie de sesión tiene flags httpOnly, sameSite, secure | Alta |
| SEC-008 | Rate limiting en login previene fuerza bruta | Alta |
| SEC-009 | syncSequence solo permite tablas de whitelist | Alta |
| SEC-010 | Error del servidor no expone stack trace al cliente | Media |
| SEC-011 | .env* y node_modules no son accesibles públicamente | Alta |

---

## Fase 8 — Matriz de Casos de Prueba

### Convención de IDs

| Prefijo | Módulo |
|---|---|
| WEB-HOME | Página principal |
| WEB-CAT | Catálogo |
| WEB-PROD | Producto |
| WEB-CART | Carrito |
| WEB-WHATS | WhatsApp |
| ADM-LOGIN | Admin — Login |
| ADM-PROD | Admin — Productos |
| ADM-CAT | Admin — Categorías |
| ADM-SUBCAT | Admin — Subcategorías |
| ADM-BRAND | Admin — Marcas |
| ADM-IMG | Admin — Imágenes |
| ADM-SIDEBAR | Admin — Sidebar |
| NEG | Casos negativos |
| INT | Integración |
| PERF | Rendimiento |
| SEC | Seguridad |

### Matriz completa

| ID | Módulo | Caso | Prioridad |
|---|---|---|---|
| WEB-HOME-001 | Home | Carga correcta con todas las secciones | Alta |
| WEB-HOME-002 | Home | Hero section visible con CTA | Alta |
| WEB-HOME-003 | Home | Nuevos Ingresos: hasta 8 productos | Media |
| WEB-HOME-004 | Home | Categorías: enlaces a /mujer y /hombre | Alta |
| WEB-HOME-005 | Home | Ofertas: productos on_sale=true | Media |
| WEB-HOME-006 | Home | Marcas: solo activas | Baja |
| WEB-HOME-007 | Home | Testimonios desde config.ts | Baja |
| WEB-HOME-008 | Home | Enlace "Ver Catálogo Completo" → /catalogo | Media |
| WEB-HOME-009 | Home | Botón WhatsApp abre app con mensaje | Alta |
| WEB-HOME-010 | Home | Secciones ocultas cuando no hay datos | Media |
| WEB-CAT-001 | Catálogo | Lista todos los productos | Alta |
| WEB-CAT-002 | Catálogo | /mujer filtra por mujer (ruta directa, no /categoria/mujer) | Alta |
| WEB-CAT-003 | Catálogo | /hombre filtra por hombre (ruta directa, no /categoria/hombre) | Alta |
| WEB-CAT-004 | Catálogo | Filtro por marca funcional | Alta |
| WEB-CAT-005 | Catálogo | Búsqueda por texto funcional | Alta |
| WEB-CAT-006 | Catálogo | Orden por precio ascendente | Media |
| WEB-CAT-007 | Catálogo | Orden por precio descendente | Media |
| WEB-CAT-008 | Catálogo | Tarjeta: imagen, nombre, precio, marca | Alta |
| WEB-CAT-009 | Catálogo | Precio en oferta con tachado + badge | Alta |
| WEB-CAT-010 | Catálogo | Indicador "Agotado" visible | Media |
| WEB-CAT-011 | Catálogo | Click → /producto/[slug] | Alta |
| WEB-CAT-012 | Catálogo | Sidebar con categorías/subcategorías | Alta |
| WEB-CAT-013 | Catálogo | Productos sin stock no visibles | Media |
| WEB-PROD-001 | Producto | Carga con datos completos | Alta |
| WEB-PROD-002 | Producto | Galería muestra todas las imágenes | Alta |
| WEB-PROD-003 | Producto | Click en imagen la expande | Media |
| WEB-PROD-004 | Producto | Precio, nombre, marca, SKU visibles | Alta |
| WEB-PROD-005 | Producto | OldPrice + descuento en oferta | Alta |
| WEB-PROD-006 | Producto | Etiqueta de disponibilidad correcta | Alta |
| WEB-PROD-007 | Producto | Tallas seleccionables | Alta |
| WEB-PROD-008 | Producto | Colores visibles (si aplica) | Baja |
| WEB-PROD-009 | Producto | Descripción en texto plano (sin HTML) | Alta |
| WEB-PROD-010 | Producto | Productos relacionados (misma subcat) | Media |
| WEB-PROD-011 | Producto | Breadcrumb correcto | Baja |
| WEB-PROD-012 | Producto | Botón agregar al carrito funcional | Alta |
| WEB-PROD-013 | Producto | Meta tags + Open Graph generados | Media |
| WEB-PROD-014 | Producto | Slug inválido → 404 | Alta |
| WEB-CART-001 | Carrito | Agregar incrementa contador | Alta |
| WEB-CART-002 | Carrito | Talla seleccionada registrada | Alta |
| WEB-CART-003 | Carrito | Sin talla muestra validación | Alta |
| WEB-CART-004 | Carrito | Modificar cantidad actualiza subtotal | Alta |
| WEB-CART-005 | Carrito | Eliminar producto actualiza contador | Alta |
| WEB-CART-006 | Carrito | Persiste entre páginas | Alta |
| WEB-CART-007 | Carrito | Resumen con productos y total | Alta |
| WEB-CART-008 | Carrito | Vacío muestra estado vacío | Media |
| WEB-CART-009 | Carrito | Mismo producto incrementa cantidad | Alta |
| WEB-CART-010 | Carrito | Cantidad=0 elimina producto | Alta |
| WEB-CART-011 | Carrito | Cálculo de total correcto | Alta |
| WEB-WHATS-001 | WhatsApp | Enlace con número correcto | Alta |
| WEB-WHATS-002 | WhatsApp | Mensaje incluye productos + cantidades | Alta |
| WEB-WHATS-003 | WhatsApp | Mensaje incluye subtotal | Alta |
| WEB-WHATS-004 | WhatsApp | Mensaje incluye observaciones | Baja |
| WEB-WHATS-005 | WhatsApp | Abre WhatsApp Web/app | Alta |
| WEB-WHATS-006 | WhatsApp | Número de SITE_CONFIG | Alta |
| WEB-WHATS-007 | WhatsApp | Carrito vacío bloquea envío | Alta |
| WEB-WHATS-008 | WhatsApp | Formato legible del mensaje | Media |
| ADM-LOGIN-001 | Admin Login | Credenciales correctas → acceso | Alta |
| ADM-LOGIN-002 | Admin Login | Credenciales incorrectas → error | Alta |
| ADM-LOGIN-003 | Admin Login | 8 intentos fallidos → bloqueo 15min | Alta |
| ADM-LOGIN-004 | Admin Login | Sesión expirada → redirige al login | Alta |
| ADM-LOGIN-005 | Admin Login | Cerrar sesión → invalida cookie | Alta |
| ADM-LOGIN-006 | Admin Login | Ruta admin sin sesión → redirige | Alta |
| ADM-LOGIN-007 | Admin Login | Cambiar contraseña válido | Alta |
| ADM-LOGIN-008 | Admin Login | Cambiar contraseña con actual incorrecta | Alta |
| ADM-LOGIN-009 | Admin Login | Nueva contraseña <6 chars rechazada | Alta |
| ADM-PROD-001 | Admin Prod | Listado carga con todos los campos | Alta |
| ADM-PROD-002 | Admin Prod | Crear con datos válidos | Alta |
| ADM-PROD-003 | Admin Prod | Slug auto-generado desde nombre | Alta |
| ADM-PROD-004 | Admin Prod | Slug duplicado → slug único | Alta |
| ADM-PROD-005 | Admin Prod | Editar actualiza datos | Alta |
| ADM-PROD-006 | Admin Prod | Eliminar borra producto + imágenes Cloudinary | Alta |
| ADM-PROD-007 | Admin Prod | Validación: nombre requerido | Alta |
| ADM-PROD-008 | Admin Prod | Validación: precio ≥ 0 | Alta |
| ADM-PROD-009 | Admin Prod | Validación: sizes array válido | Media |
| ADM-PROD-010 | Admin Prod | Validación: availability lista cerrada | Media |
| ADM-PROD-011 | Admin Prod | Imágenes guardadas como JSON | Alta |
| ADM-PROD-012 | Admin Prod | Crear dispara revalidateTag | Alta |
| ADM-PROD-013 | Admin Prod | featured=true → visible en home | Alta |
| ADM-PROD-014 | Admin Prod | new_arrival=true → en Nuevos Ingresos | Alta |
| ADM-PROD-015 | Admin Prod | on_sale=true → en Ofertas | Alta |
| ADM-PROD-016 | Admin Prod | Subir imagen a Cloudinary desde producto | Alta |
| ADM-PROD-017 | Admin Prod | Eliminar producto limpia Cloudinary | Alta |
| ADM-CAT-001 | Admin Cat | Listado ordenado | Alta |
| ADM-CAT-002 | Admin Cat | Crear con nombre y slug | Alta |
| ADM-CAT-003 | Admin Cat | Slug auto-generado con slugify() | Alta |
| ADM-CAT-004 | Admin Cat | Slug duplicado → slug único | Alta |
| ADM-CAT-005 | Admin Cat | Editar actualiza datos | Alta |
| ADM-CAT-006 | Admin Cat | Eliminar sin dependencias | Alta |
| ADM-CAT-007 | Admin Cat | Eliminar con productos → rechaza | Alta |
| ADM-CAT-008 | Admin Cat | Eliminar con subcats → rechaza | Alta |
| ADM-CAT-009 | Admin Cat | Validación: nombre requerido | Alta |
| ADM-CAT-010 | Admin Cat | CRUD dispara revalidateTag | Media |
| ADM-CAT-011 | Admin Cat | Inactiva no visible en público | Alta |
| ADM-SUBCAT-001 | Admin Subcat | Listado con categoría padre | Alta |
| ADM-SUBCAT-002 | Admin Subcat | Crear con datos válidos | Alta |
| ADM-SUBCAT-003 | Admin Subcat | Slug duplicado → slug único | Alta |
| ADM-SUBCAT-004 | Admin Subcat | Editar actualiza datos | Alta |
| ADM-SUBCAT-005 | Admin Subcat | Eliminar sin productos | Alta |
| ADM-SUBCAT-006 | Admin Subcat | Eliminar con productos → rechaza | Alta |
| ADM-SUBCAT-007 | Admin Subcat | Validación: nombre requerido | Alta |
| ADM-SUBCAT-008 | Admin Subcat | Validación: categoría requerida | Alta |
| ADM-SUBCAT-009 | Admin Subcat | CRUD dispara revalidateTag | Media |
| ADM-BRAND-001 | Admin Brand | Listado alfabético | Alta |
| ADM-BRAND-002 | Admin Brand | Crear con datos válidos | Alta |
| ADM-BRAND-003 | Admin Brand | Slug duplicado → slug único | Alta |
| ADM-BRAND-004 | Admin Brand | Editar actualiza datos | Alta |
| ADM-BRAND-005 | Admin Brand | Eliminar sin productos | Alta |
| ADM-BRAND-006 | Admin Brand | Eliminar con productos → rechaza | Alta |
| ADM-BRAND-007 | Admin Brand | Validación: nombre requerido | Alta |
| ADM-BRAND-008 | Admin Brand | Inactiva no visible en público | Alta |
| ADM-BRAND-009 | Admin Brand | CRUD dispara revalidateTag | Media |
| ADM-IMG-001 | Admin Img | Subir JPEG válido | Alta |
| ADM-IMG-002 | Admin Img | Subir PNG válido | Alta |
| ADM-IMG-003 | Admin Img | Subir WebP válido | Alta |
| ADM-IMG-004 | Admin Img | Archivo >10MB rechazado | Alta |
| ADM-IMG-005 | Admin Img | Tipo no permitido rechazado | Alta |
| ADM-IMG-006 | Admin Img | Múltiples archivos (hasta 8) | Alta |
| ADM-IMG-007 | Admin Img | Más de 8 archivos rechazado | Media |
| ADM-IMG-008 | Admin Img | Error Cloudinary manejado | Alta |
| NEG-001 | Negativos | URL inexistente → 404 | Alta |
| NEG-002 | Negativos | Request malformado → error manejado | Alta |
| NEG-003 | Negativos | SQL injection intent no rompe | Alta |
| NEG-004 | Negativos | XSS intent no se ejecuta | Alta |
| NEG-005 | Negativos | Slug inválido → 404 | Alta |
| NEG-006 | Negativos | Precio negativo rechazado | Alta |
| NEG-007 | Negativos | Token inválido → 401 | Alta |
| NEG-008 | Negativos | Producto ID inexistente → 404 | Alta |
| NEG-009 | Negativos | Eliminar cat con productos → rechazo | Alta |
| NEG-010 | Negativos | Eliminar subcat con productos → rechazo | Alta |
| NEG-011 | Negativos | Eliminar brand con productos → rechazo | Alta |
| NEG-012 | Negativos | Archivo vacío → rechazo | Media |
| NEG-013 | Negativos | Usuario vacío en login → rechazo | Alta |
| NEG-014 | Negativos | Password vacío en login → rechazo | Alta |
| NEG-015 | Negativos | 9+ intentos fallidos → bloqueo | Alta |
| NEG-016 | Negativos | Producto out_of_stock → mensaje | Media |
| NEG-017 | Negativos | Marca inexistente en filtro → no rompe | Media |
| INT-001 | Integración | Crear producto → visible en catálogo | Alta |
| INT-002 | Integración | Editar producto → reflejado tras revalidate | Alta |
| INT-003 | Integración | Eliminar producto → desaparece | Alta |
| INT-004 | Integración | Crear categoría → visible en ambos lados | Alta |
| INT-005 | Integración | Desactivar categoría → oculta en público | Alta |
| INT-006 | Integración | Subir imagen Cloudinary → URL usable | Alta |
| INT-007 | Integración | Carrito → WhatsApp con datos correctos | Alta |
| INT-008 | Integración | Login → cookie → acceso rutas protegidas | Alta |
| INT-009 | Integración | Cambiar password → nuevo login funciona | Alta |
| PERF-001 | Rendimiento | Home <2s (cold) / <500ms (cached) | Media |
| PERF-002 | Rendimiento | Catálogo <3s (cold) / <800ms | Media |
| PERF-003 | Rendimiento | Producto <2s (cold) / <500ms | Media |
| PERF-004 | Rendimiento | Subida Cloudinary <5s (2MB) | Media |
| PERF-005 | Rendimiento | Admin listado <1s (100 prod) | Media |
| SEC-001 | Seguridad | /admin sin sesión → /admin/login | Alta |
| SEC-002 | Seguridad | API route sin token → 401 | Alta |
| SEC-003 | Seguridad | SQL injection en búsqueda | Alta |
| SEC-004 | Seguridad | XSS en nombre de producto | Alta |
| SEC-005 | Seguridad | XSS en descripción de producto | Alta |
| SEC-006 | Seguridad | Token HMAC no falsificable | Alta |
| SEC-007 | Seguridad | Cookie httpOnly + sameSite | Alta |
| SEC-008 | Seguridad | Rate limiting activo | Alta |
| SEC-009 | Seguridad | syncSequence whitelist respetada | Alta |
| SEC-010 | Seguridad | Error sin stack trace al cliente | Media |

**Total de casos: 140**

---

## Fase 9 — Priorización

| Prioridad | Cantidad | % | Acción si falla |
|---|---|---|---|
| **Crítica** | 0 | 0% | — |
| **Alta** | 112 | 80% | Debe corregirse antes de producción |
| **Media** | 24 | 17% | Afecta UX pero no bloquea |
| **Baja** | 4 | 3% | Mejora menor |

No hay casos críticos porque no hay funcionalidades que bloqueen completamente el sistema (no hay pagos, ni registro, ni funcionalidades transaccionales críticas).

---

## Fase 10 — Criterios de Aceptación

El sistema se considera apto para producción cuando:

1. **100% de pruebas de prioridad Alta** (112 casos) aprobadas sin errores
2. **0 errores de seguridad** (SEC-001 a SEC-010 aprobados)
3. **0 errores de integración** (INT-001 a INT-009 aprobados)
4. **Flujo de compra por WhatsApp** funciona correctamente (WEB-WHATS-001 a WEB-WHATS-008)
5. **Panel administrativo** permite crear, editar y eliminar productos/categorías/subcategorías/marcas sin errores
6. **Consistencia**: Los cambios realizados en el panel se reflejan en el catálogo público (INT-001 a INT-005)
7. **Tolerancia**: Máximo 3 fallos en pruebas de prioridad Media, ninguno en Alta

---

## Estimación del Esfuerzo de Pruebas

### Resumen

| Métrica | Valor |
|---|---|
| **Total casos de prueba** | 140 |
| **Módulos cubiertos** | 12 (Home, Catálogo, Producto, Carrito, WhatsApp, Login, Productos Admin, Categorías Admin, Subcategorías Admin, Marcas Admin, Imágenes Admin, más generales) |
| **Casos manuales** | 140 (100%) |
| **Casos automatizables** | ~80 (57%) — principalmente API (CRUD admin) + formularios |
| **Esfuerzo estimado (manual)** | 3–4 días / 1 tester |
| **Esfuerzo estimado (automatización)** | 5–7 días adicionales |
| **Orden recomendado de ejecución** | Ver sección "Orden de ejecución" |

### Orden de ejecución recomendado

```
Fase 1: Seguridad (SEC) + Casos negativos (NEG)
Fase 2: Login Admin (ADM-LOGIN) + Autorización
Fase 3: CRUD Admin (ADM-PROD → ADM-CAT → ADM-SUBCAT → ADM-BRAND → ADM-IMG)
Fase 4: Integración (INT)
Fase 5: Catálogo público (WEB-CAT)
Fase 6: Producto (WEB-PROD)
Fase 7: Carrito (WEB-CART) + WhatsApp (WEB-WHATS)
Fase 8: Home (WEB-HOME)
Fase 9: Rendimiento (PERF)
Fase 10: Regresión completa + pruebas exploratorias
```

### Riesgos más importantes para la ejecución

1. **Cold start Neon**: Las pruebas de rendimiento pueden dar falsos negativos en el primer query tras inactividad (>5min). Realizar un warm-up request antes de medir.
2. **Dependencia de Cloudinary**: Las pruebas de imágenes requieren conectividad a Cloudinary. Sin internet, ADM-IMG-001 a ADM-IMG-008 no pueden ejecutarse.
3. **Estado compartido del carrito**: Las pruebas del carrito (WEB-CART) deben ejecutarse en sesiones de navegador limpias para evitar interferencias.
4. **Rate limiting**: Las pruebas ADM-LOGIN-003 y NEG-015 pueden bloquear la IP de pruebas por 15 minutos. Ejecutarlas al final o usar una IP de prueba excluida.

### Recomendaciones antes de ejecutar

1. **Seed de datos**: Ejecutar `npx tsx scripts/seed-recovery.ts` para tener datos de prueba consistentes
2. **QA script disponible**: Usar `node scripts/qa-admin.mjs` para validación automatizada básica del CRUD admin
3. **Limpiar carrito**: Antes de pruebas de carrito, asegurar localStorage vacío
4. **Warm-up DB**: Hacer un request a `/api/public/categories` para evitar cold start en las primeras pruebas
5. **Entorno**: Preferir ejecutar en producción (Vercel) o en un entorno de preview con la misma DB Neon

### Notas de ejecución (descubiertas durante pruebas)

1. **Rutas de categorías**: Las categorías usan rutas directas (`/mujer`, `/hombre`), NO `/categoria/[slug]`. NO existe ruta `/categoria/`.
2. **API pública de productos**: NO existe `/api/public/products`. Los productos se cargan server-side desde los Server Components. Solo existe `/api/public/categories`.
3. **API de carrito**: NO existe `/api/cart/*`. El carrito es 100% client-side (localStorage). No tiene endpoints REST.
4. **Seed endpoint**: `/api/admin/seed` no tiene implementación (directorio vacío removido).
5. **Warm-up URL**: Usar `/api/public/categories` en vez de `/api/public/products`.
6. **HTTP 200 vs 404 (notFound)**: Next.js 16.2.7 renderiza el contenido 404 correctamente pero el status HTTP es 200 cuando `notFound()` se llama en una página dinámica después de `generateMetadata`. Solución: llamar `notFound()` también en `generateMetadata` para que el status se setee antes de renderizar.
