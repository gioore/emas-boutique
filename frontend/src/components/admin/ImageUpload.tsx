'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const IMAGE_QUALITY = 0.82;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface Props {
  existingImages?: { id: number; url: string; alternativeText?: string | null }[];
  onImagesChange: (images: { id: number; url: string }[]) => void;
}

interface UploadImage {
  id?: number;
  url: string;
  file?: File;
  uploading?: boolean;
  error?: string;
}

interface UploadProgress {
  stage: string;
  current: number;
  total: number;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'No se pudo subir la imagen';
}

function isUploadedImage(image: UploadImage): image is { id: number; url: string } {
  return typeof image.id === 'number' && !image.file && !image.uploading && !image.error;
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return `${file.name}: formato no permitido`;
  if (file.size > MAX_FILE_SIZE) return `${file.name}: supera 10MB`;
  return null;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img');
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('No se pudo leer la imagen'));
    image.src = url;
  });
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('No se pudo optimizar la imagen'));
      },
      type,
      IMAGE_QUALITY
    );
  });
}

async function compressImage(file: File): Promise<File> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));

    if (scale === 1 && file.size <= 700 * 1024) return file;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);

    const context = canvas.getContext('2d');
    if (!context) return file;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    let blob: Blob;
    try {
      blob = await canvasToBlob(canvas, 'image/webp');
    } catch {
      blob = await canvasToBlob(canvas, 'image/jpeg');
    }

    if (blob.size >= file.size) return file;

    const extension = blob.type === 'image/webp' ? 'webp' : 'jpg';
    const name = file.name.replace(/\.[^.]+$/, '') || 'producto';
    return new File([blob], `${name}.${extension}`, { type: blob.type });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function ImageUpload({ existingImages = [], onImagesChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<UploadImage[]>(existingImages.map((img) => ({ id: img.id, url: img.url })));
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const syncImages = (nextImages: UploadImage[]) => {
    onImagesChange(nextImages.filter(isUploadedImage));
  };

  const updateImages = (updater: (current: UploadImage[]) => UploadImage[]) => {
    setImages((current) => {
      const next = updater(current);
      syncImages(next);
      return next;
    });
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const currentCount = images.filter((image) => !image.error).length;
    const availableSlots = MAX_IMAGES - currentCount;
    const selectedFiles = Array.from(files).slice(0, Math.max(availableSlots, 0));

    setError('');

    if (availableSlots <= 0) {
      setError(`Solo puedes subir hasta ${MAX_IMAGES} imagenes por producto.`);
      return;
    }

    if (selectedFiles.length === 0) return;

    const validationErrors = selectedFiles.map(validateFile).filter((message): message is string => Boolean(message));
    const validFiles = selectedFiles.filter((file) => !validateFile(file));

    if (validationErrors.length > 0) setError(validationErrors.join('. '));
    if (validFiles.length === 0) return;

    setUploading(true);
    setProgress({ stage: 'Preparando imagenes', current: 0, total: validFiles.length });

    const previews: UploadImage[] = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      uploading: true,
    }));

    updateImages((current) => [...current, ...previews]);

    try {
      const compressedFiles: File[] = [];

      for (let index = 0; index < validFiles.length; index += 1) {
        setProgress({ stage: 'Optimizando imagenes', current: index + 1, total: validFiles.length });
        compressedFiles.push(await compressImage(validFiles[index]));
      }

      const formData = new FormData();
      compressedFiles.forEach((file) => formData.append('files', file));

      setProgress({ stage: 'Subiendo imagenes', current: compressedFiles.length, total: compressedFiles.length });

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir imagenes');

      const uploaded = (Array.isArray(data) ? data : [data])
        .filter((item): item is { id: number; url: string } => typeof item?.id === 'number' && typeof item?.url === 'string')
        .map((item) => ({ id: item.id, url: item.url }));

      updateImages((current) => {
        const previewUrls = new Set(previews.map((preview) => preview.url));
        return [...current.filter((image) => !previewUrls.has(image.url)), ...uploaded];
      });
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
      updateImages((current) => {
        const previewUrls = new Set(previews.map((preview) => preview.url));
        return current.filter((image) => !previewUrls.has(image.url));
      });
    } finally {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
      setUploading(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    updateImages((current) => {
      const image = current[index];
      if (image?.file) URL.revokeObjectURL(image.url);
      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const getImageSrc = (img: UploadImage) => {
    if (img.file) return img.url;
    return img.url.startsWith('http') ? img.url : '/placeholder.svg';
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#44403c' }}>
        Imagenes del producto
      </label>

      <div
        className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer"
        style={{
          borderColor: dragOver ? '#1c1917' : '#d6d3d1',
          backgroundColor: dragOver ? '#faf7f2' : '#ffffff',
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={(event) => { event.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => { event.preventDefault(); setDragOver(false); void uploadFiles(event.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <svg className="w-10 h-10 mx-auto mb-3" style={{ color: '#a8a29e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm mb-1" style={{ color: '#57534e' }}>
          {uploading && progress ? `${progress.stage} (${progress.current}/${progress.total})` : 'Arrastra imagenes aqui o haz clic para seleccionar'}
        </p>
        <p className="text-xs" style={{ color: '#a8a29e' }}>JPG, PNG, WebP. Se optimizan automaticamente antes de subir.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => event.target.files && void uploadFiles(event.target.files)}
        />
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-lg text-sm" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div key={`${img.url}-${index}`} className="relative aspect-square rounded-lg overflow-hidden group" style={{ backgroundColor: '#f5f0e8' }}>
              <Image
                src={getImageSrc(img)}
                alt={`Imagen ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              {img.uploading && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium" style={{ backgroundColor: 'rgba(28,25,23,0.55)', color: '#ffffff' }}>
                  Subiendo
                </div>
              )}
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); removeImage(index); }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
