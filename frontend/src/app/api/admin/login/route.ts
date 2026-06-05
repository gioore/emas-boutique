import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createToken, setSessionCookie } from '@/lib/admin-auth-server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (validateCredentials(username, password)) {
      const token = createToken(username);
      await setSessionCookie(token);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Credenciales inválidas' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
