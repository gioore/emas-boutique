import { NextResponse } from 'next/server';

export function handleApiError(err: unknown): NextResponse {
  const message = err instanceof Error ? err.message : String(err);
  if (message === 'No autorizado') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  console.error('[API Error]', err);
  const isProduction = process.env.NODE_ENV === 'production';
  return NextResponse.json({ error: isProduction ? 'Error interno del servidor' : message }, { status: 500 });
}
