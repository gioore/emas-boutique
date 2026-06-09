import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth-server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session.authenticated) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, username: session.username });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
