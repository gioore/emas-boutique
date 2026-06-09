import { queryOne } from './db';

export function validateProductBody(data: Record<string, unknown>, isUpdate = false): string | null {
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) return 'El nombre del producto es requerido';
  }
  if (data.price !== undefined && data.price !== null) {
    const price = Number(data.price);
    if (isNaN(price) || price < 0) return 'El precio debe ser un número válido mayor o igual a 0';
  }
  if (data.sizes !== undefined && (!Array.isArray(data.sizes) || data.sizes.length === 0)) return 'Debes seleccionar al menos una talla';
  if (data.availability !== undefined && !['available', 'low_stock', 'out_of_stock', 'pre_order'].includes(data.availability as string)) return 'Disponibilidad inválida';
  return null;
}

export async function ensureUniqueSlug(slug: string, excludeId?: number): Promise<string> {
  let candidate = slug;
  let counter = 0;
  while (true) {
    const existing = excludeId
      ? await queryOne('SELECT id FROM products WHERE slug = $1 AND id != $2', [candidate, excludeId])
      : await queryOne('SELECT id FROM products WHERE slug = $1', [candidate]);
    if (!existing) return candidate;
    counter++;
    candidate = `${slug}-${counter}`;
  }
}
