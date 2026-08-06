import { execute, queryOne } from './db';

const ALLOWED_TABLES = new Set(['products', 'categories', 'subcategories', 'brands']);

export function slugify(text: string): string {
  const cleaned = text.toLowerCase().trim();
  if (!cleaned) return 'untitled';
  return cleaned
    .replace(/ñ/g, 'n')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    || 'untitled';
}

export function validateProductBody(data: Record<string, unknown>, isUpdate = false): string | null {
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) return 'El nombre del producto es requerido';
  }
  if (!isUpdate || data.price !== undefined) {
    if (data.price === undefined || data.price === null) return 'El precio es requerido';
    const price = Number(data.price);
    if (isNaN(price) || price < 0) return 'El precio debe ser un número válido mayor o igual a 0';
  }
  if (data.sizes !== undefined && (!Array.isArray(data.sizes) || data.sizes.length === 0)) return 'Debes seleccionar al menos una talla';
  if (data.availability !== undefined && !['available', 'low_stock', 'out_of_stock', 'pre_order'].includes(data.availability as string)) return 'Disponibilidad inválida';
  return null;
}

export async function ensureUniqueSlug(slug: string, table: string = 'products', excludeId?: number): Promise<string> {
  if (!ALLOWED_TABLES.has(table)) throw new Error(`Table '${table}' not allowed`);
  let candidate = slug;
  let counter = 0;
  const MAX_ATTEMPTS = 100;
  while (true) {
    if (counter >= MAX_ATTEMPTS) throw new Error(`No se pudo generar un slug único para '${slug}' después de ${MAX_ATTEMPTS} intentos`);
    const existing = excludeId
      ? await queryOne(`SELECT id FROM ${table} WHERE slug = $1 AND id != $2`, [candidate, excludeId])
      : await queryOne(`SELECT id FROM ${table} WHERE slug = $1`, [candidate]);
    if (!existing) return candidate;
    counter++;
    candidate = `${slug}-${counter}`;
  }
}

export function parseImages(p: { images: unknown }): unknown[] {
  if (Array.isArray(p.images)) return p.images;
  if (typeof p.images === 'string') try { return JSON.parse(p.images); } catch { return []; }
  return [];
}

const ALLOWED_SEQUENCE_TABLES = ALLOWED_TABLES;

export async function syncSequence(table: string): Promise<void> {
  if (!ALLOWED_SEQUENCE_TABLES.has(table)) throw new Error(`Table '${table}' not allowed for syncSequence`);
  const row = await queryOne<{ max: number | null }>(`SELECT MAX(id) as max FROM ${table}`);
  if (row && row.max !== null) {
    await execute(`SELECT setval('${table}_id_seq', $1, true)`, [row.max]);
  }
}
