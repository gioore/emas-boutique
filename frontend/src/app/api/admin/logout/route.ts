import { NextResponse } from 'next/server';
import { requireAuth, clearSessionCookie } from '@/lib/admin-auth-server';

export async function POST() {
  try {
    await requireAuth();
    await clearSessionCookie();
    return NextResponse.json({ data: null });
  } catch (err: any) {
    if (err.message === 'No autorizado') return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
