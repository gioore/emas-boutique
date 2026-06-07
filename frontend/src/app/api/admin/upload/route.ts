import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';
const MAX_FILES = 8;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Error al subir imagenes';
}

function isFile(value: FormDataEntryValue): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const incomingFormData = await request.formData();
    const files = incomingFormData.getAll('files').filter(isFile);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No se recibieron imagenes' }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximo ${MAX_FILES} imagenes por subida` }, { status: 400 });
    }

    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Formato no permitido: ${file.name}` }, { status: 400 });
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `La imagen ${file.name} supera 10MB` }, { status: 400 });
      }
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file, file.name));

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
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    if (message === 'No autorizado') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
