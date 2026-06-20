#!/usr/bin/env node

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'boutique2025';

let cookies = '';
let passed = 0;
let failed = 0;

function log(label, ok, detail) {
  if (ok) { passed++; console.log(`  ✅ ${label}`); }
  else { failed++; console.log(`  ❌ ${label} — ${detail}`); }
}

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) cookies = setCookie.split(';')[0];
  const text = await res.text();
  try { return { status: res.status, data: JSON.parse(text) }; }
  catch { return { status: res.status, data: text }; }
}

async function run() {
  console.log(`\n🔍 QA Admin CRUD — ${BASE}\n`);

  // 1. Login
  console.log('🔐 Auth');
  const login = await api('POST', '/api/admin/login', { username: ADMIN_USER, password: ADMIN_PASS });
  log('Login exitoso', login.status === 200, `status ${login.status}`);

  const me = await api('GET', '/api/admin/me');
  log('Session válida', me.status === 200 && me.data.authenticated, JSON.stringify(me.data));

  // 2. Categories
  console.log('\n📁 Categories');
  const cat = await api('POST', '/api/admin/categories', { data: { name: `QA Test Cat ${Date.now()}`, description: 'Creado por QA', order: 99 } });
  log('Crear categoría', cat.status === 201, JSON.stringify(cat.data));
  const catId = cat.data?.data?.id;

    let cats = await api('GET', '/api/admin/categories');
  log('Listar categorías', cats.status === 200 && cats.data?.data?.length > 0, `${cats.data?.data?.length ?? 0} categorías`);

  if (catId) {
    const edit = await api('PUT', `/api/admin/categories/${catId}`, { data: { name: `QA Edit Cat ${Date.now()}` } });
    log('Editar categoría', edit.status === 200, JSON.stringify(edit.data));
    const del = await api('DELETE', `/api/admin/categories/${catId}`);
    log('Eliminar categoría', del.status === 200, JSON.stringify(del.data));
  }

  // 3. Brands
  console.log('\n🏷️ Brands');
  const brand = await api('POST', '/api/admin/brands', { data: { name: `QA Test Brand ${Date.now()}`, active: true } });
  log('Crear marca', brand.status === 201, JSON.stringify(brand.data));
  const brandId = brand.data?.data?.id;

  let brands = await api('GET', '/api/admin/brands');
  log('Listar marcas', brands.status === 200 && brands.data?.data?.length > 0, `${brands.data?.data?.length ?? 0} marcas`);

  if (brandId) {
    const edit = await api('PUT', `/api/admin/brands/${brandId}`, { data: { name: `QA Edit Brand ${Date.now()}` } });
    log('Editar marca', edit.status === 200, JSON.stringify(edit.data));
    const del = await api('DELETE', `/api/admin/brands/${brandId}`);
    log('Eliminar marca', del.status === 200, JSON.stringify(del.data));
  }

  // 4. Subcategories
  console.log('\n📂 Subcategories');
  const sub = await api('POST', '/api/admin/subcategories', { data: { name: `QA Test Sub ${Date.now()}`, category_id: 1, active: true, order: 99 } });
  log('Crear subcategoría', sub.status === 201, JSON.stringify(sub.data));
  const subId = sub.data?.data?.id;

  let subs = await api('GET', '/api/admin/subcategories');
  log('Listar subcategorías', subs.status === 200 && subs.data?.data?.length > 0, `${subs.data?.data?.length ?? 0} subcategorías`);

  if (subId) {
    const edit = await api('PUT', `/api/admin/subcategories/${subId}`, { data: { name: `QA Edit Sub ${Date.now()}` } });
    log('Editar subcategoría', edit.status === 200, JSON.stringify(edit.data));
    const del = await api('DELETE', `/api/admin/subcategories/${subId}`);
    log('Eliminar subcategoría', del.status === 200, JSON.stringify(del.data));
  }

  // 5. Products (the critical one — tests syncSequence)
  console.log('\n👗 Products');
  const prodName = `QA Test Product ${Date.now()}`;
  const prod = await api('POST', '/api/admin/products', {
    data: {
      name: prodName,
      price: 99.99,
      category: 'mujer',
      subcategory: 'Vestidos',
      category_id: 1,
      subcategory_id: 1,
      sizes: ['S', 'M', 'L'],
      availability: 'available',
      images: [],
      colors: ['Negro'],
      tags: ['qa-test'],
    },
  });
  log('Crear producto (sin imagen)', prod.status === 201, JSON.stringify(prod.data));
  const prodId = prod.data?.data?.id;
  const prodSlug = prod.data?.data?.slug;

  // Create a second product to verify sequence fix works for multi-insert
  const prod2 = await api('POST', '/api/admin/products', {
    data: {
      name: `QA Test Product 2 ${Date.now()}`,
      price: 49.99,
      category: 'hombre',
      subcategory: 'Camisas',
      category_id: 2,
      subcategory_id: 10,
      sizes: ['M', 'L', 'XL'],
      availability: 'available',
      images: [],
    },
  });
  log('Crear segundo producto (verificar secuencia)', prod2.status === 201, JSON.stringify(prod2.data));
  const prodId2 = prod2.data?.data?.id;

  // Create a third with explicit characteristics to test edge cases
  const prod3 = await api('POST', '/api/admin/products', {
    data: {
      name: `QA Test Sale ${Date.now()}`,
      price: 199.99,
      oldPrice: 299.99,
      category: 'mujer',
      subcategory: 'Bolsos',
      category_id: 1,
      subcategory_id: 3,
      sizes: ['Única'],
      availability: 'low_stock',
      featured: true,
      newArrival: true,
      onSale: true,
      sku: `QA-SKU-${Date.now()}`,
    },
  });
  log('Crear producto con todos los campos', prod3.status === 201, JSON.stringify(prod3.data));

  let products = await api('GET', '/api/admin/products');
  log('Listar productos', products.status === 200 && products.data?.data?.length > 0, `${products.data?.data?.length ?? 0} productos`);

  // Test duplicate slug handling
  const dup = await api('POST', '/api/admin/products', {
    data: {
      name: prodName, // same name = same slug
      price: 49.99,
      category: 'mujer',
      subcategory: 'Vestidos',
      category_id: 1,
      subcategory_id: 1,
      sizes: ['S'],
      availability: 'available',
    },
  });
  log('Slug duplicado auto-generado', dup.status === 201 && dup.data?.data?.slug !== prodSlug,
    `slug original: ${prodSlug}, nuevo: ${dup.data?.data?.slug}`);

  if (prodId) {
    const edit = await api('PUT', `/api/admin/products/${prodId}`, { data: { name: `QA Edit ${Date.now()}`, price: 79.99 } });
    log('Editar producto', edit.status === 200, JSON.stringify(edit.data));

    const del = await api('DELETE', `/api/admin/products/${prodId}`);
    log('Eliminar producto', del.status === 200, JSON.stringify(del.data));
  }

  // Cleanup remaining test products
  for (const id of [prodId2, prod3.data?.data?.id, dup.data?.data?.id]) {
    if (id) await api('DELETE', `/api/admin/products/${id}`);
  }

  // 6. Validation tests
  console.log('\n⚠️ Validaciones');
  const noName = await api('POST', '/api/admin/categories', { data: { name: '' } });
  log('Rechazar categoría sin nombre', noName.status === 400 && noName.data.error, noName.data.error);

  const noPrice = await api('POST', '/api/admin/products', { data: { name: 'Test', sizes: ['M'], category: 'mujer', subcategory: 'Vestidos' } });
  log('Rechazar producto sin precio', noPrice.status === 400, JSON.stringify(noPrice.data));

  const badPrice = await api('POST', '/api/admin/products', { data: { name: 'Test', price: -5, sizes: ['M'], category: 'mujer', subcategory: 'Vestidos' } });
  log('Rechazar precio negativo', badPrice.status === 400, JSON.stringify(badPrice.data));

  const noSizes = await api('POST', '/api/admin/products', { data: { name: 'Test', price: 100, sizes: [], category: 'mujer', subcategory: 'Vestidos' } });
  log('Rechazar producto sin tallas', noSizes.status === 400, JSON.stringify(noSizes.data));

  const noCat = await api('POST', '/api/admin/subcategories', { data: { name: 'Test Sub' } });
  log('Rechazar subcat sin categoría', noCat.status === 400, JSON.stringify(noCat.data));

  // 7. Auth tests
  console.log('\n🔒 Auth');
  cookies = '';
  const noAuth = await api('GET', '/api/admin/categories');
  log('Rechazar sin cookie', noAuth.status === 401, `status ${noAuth.status}`);

  // Re-login for logout test
  await api('POST', '/api/admin/login', { username: ADMIN_USER, password: ADMIN_PASS });

  const logout = await api('POST', '/api/admin/logout');
  log('Logout', logout.status === 200, JSON.stringify(logout.data));

  const afterLogout = await api('GET', '/api/admin/me');
  log('Session inválida tras logout', afterLogout.status === 401 || !afterLogout.data.authenticated, JSON.stringify(afterLogout.data));

  // Summary
  console.log(`\n${'='.repeat(40)}`);
  console.log(`Resultados:  ✅ ${passed}  ❌ ${failed}  Total: ${passed + failed}`);
  console.log(`${'='.repeat(40)}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error('FATAL:', e); process.exit(1); });
