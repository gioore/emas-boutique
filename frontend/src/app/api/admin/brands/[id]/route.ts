import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

async function fetchStrapi(endpoint: string, options: RequestInit = {}) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = await fetchStrapi(`/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (err: any) {
    if (err.message === 'No autorizado') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const data = await fetchStrapi(`/brands/${id}`, { method: 'DELETE' });
    return NextResponse.json(data);
  } catch (err: any) {
    if (err.message === 'No autorizado') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
