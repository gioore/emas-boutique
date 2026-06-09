import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';
import { createHash } from 'crypto';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const API_KEY = process.env.CLOUDINARY_API_KEY || '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

const MAX_FILES = 8;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function isFile(value: FormDataEntryValue): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

function signParams(params: Record<string, string>): string {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return createHash('sha1').update(sorted + API_SECRET).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary no configurado' }, { status: 500 });
    }

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

    const results = [];

    for (const file of files) {
      const timestamp = Math.floor(Date.now() / 1000);
      const params: Record<string, string> = {
        timestamp: String(timestamp),
        folder: 'products',
      };
      const signature = signParams(params);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');
      formData.append('timestamp', String(timestamp));
      formData.append('api_key', API_KEY);
      formData.append('signature', signature);

      let lastError: Error | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            const errText = await res.text();
            lastError = new Error(errText);
            if (attempt === 0) continue;
            throw lastError;
          }

          const result = await res.json();
          results.push({
            id: results.length + 1,
            url: result.secure_url,
            alternativeText: file.name.replace(/\.[^/.]+$/, ''),
            width: result.width,
            height: result.height,
            format: result.format,
            public_id: result.public_id,
          });
          lastError = null;
          break;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Error al subir imagen');
          if (attempt === 0) continue;
          throw lastError;
        }
      }
    }

    return NextResponse.json(results, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al subir imagenes';
    if (message === 'No autorizado') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
