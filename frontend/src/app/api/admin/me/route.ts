import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth-server';
import { handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    const session = await getSession();
    if (!session.authenticated) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, username: session.username });
  } catch (err) {
    return handleApiError(err);
  }
}
