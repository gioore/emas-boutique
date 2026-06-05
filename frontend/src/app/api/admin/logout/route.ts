import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/admin-auth-server';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
