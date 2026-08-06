import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/admin-auth-server';
import { deleteCloudinaryImage } from '@/lib/cloudinary';
import { handleApiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body: any = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
    const { publicId } = body;
    if (!publicId || typeof publicId !== 'string') {
      return NextResponse.json({ error: 'publicId requerido' }, { status: 400 });
    }
    await deleteCloudinaryImage(publicId);
    return NextResponse.json({ data: null });
  } catch (err) {
    return handleApiError(err);
  }
}
