import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/producto/:slug',
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const slug = pathname.replace('/producto/', '');

  if (!slug) return;

  try {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 5000 });
    const result = await pool.query('SELECT 1 FROM products WHERE slug = $1', [slug]);
    await pool.end();

    if (result.rows.length === 0) {
      return new NextResponse(
        '<!DOCTYPE html><html lang="es"><head><title>404 - Página no encontrada</title><meta name="robots" content="noindex"/></head><body><div style="min-height:100vh;display:flex;align-items:center;justify-content:center"><div style="text-align:center"><h1 style="font-size:6rem;font-weight:bold;margin-bottom:1rem;color:#000">404</h1><h2 style="font-size:1.5rem;margin-bottom:0.5rem;color:#000">Página no encontrada</h2><p style="margin-bottom:2rem;color:#666">La página que buscas no existe o ha sido movida.</p><a href="/" style="padding:0.75rem 2rem;background:#000;color:#fff;border-radius:9999px;text-decoration:none;font-weight:600">Ir al Inicio</a></div></div></body></html>',
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }
  } catch {
    // If DB check fails, let the page render normally
    // notFound() in the page will still show correct content with noindex
  }
}
