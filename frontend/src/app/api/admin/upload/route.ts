import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const formData = await request.formData();

    const headers: Record<string, string> = {};
    if (API_TOKEN) {
      headers['Authorization'] = `Bearer ${API_TOKEN}`;
    }

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    if (err.message === 'No autorizado') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
