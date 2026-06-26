import { NextResponse } from 'next/server';
import { requireAuth, clearSessionCookie } from '@/lib/admin-auth-server';
import { handleApiError } from '@/lib/api-utils';

export async function POST() {
  try {
    await requireAuth();
    await clearSessionCookie();
    return NextResponse.json({ data: null });
  } catch (err) {
    return handleApiError(err);
  }
}
