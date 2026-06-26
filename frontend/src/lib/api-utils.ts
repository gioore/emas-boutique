import { NextResponse } from 'next/server';

export function handleApiError(err: unknown): NextResponse {
  const message = err instanceof Error ? err.message : String(err);
  if (message === 'No autorizado') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  console.error('[API Error]', err);
  return NextResponse.json({ error: message }, { status: 500 });
}
