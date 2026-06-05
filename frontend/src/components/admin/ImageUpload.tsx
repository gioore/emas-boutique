'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Props {
  existingImages?: { id: number; url: string; alternativeText?: string | null }[];
  onImagesChange: (images: { id: number; url: string }[]) => void;
}

export default function ImageUpload({ existingImages = [], onImagesChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ id: number; url: string; file?: File }[]>(
    existingImages.map((img) => ({ id: img.id, url: img.url }))
  );
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true);
    const fileArray = Array.from(files);
    const newImages: { id: number; url: string }[] = [];

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append('files', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (Array.isArray(data) && data[0]) {
          newImages.push({ id: data[0].id, url: data[0].url });
        } else if (data.id) {
          newImages.push({ id: data.id, url: data.url });
        }
      } catch (e) {
        console.error('Subida falló:', e);
      }
    }

    const updated = [...images, ...newImages];
    setImages(updated);
    onImagesChange(updated.filter((img) => !('file' in img)));
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated.filter((img) => !('file' in img)));
  };

  const getImageSrc = (img: { id: number; url: string; file?: File }) => {
    if (img.file) return URL.createObjectURL(img.file);
    if (img.url.startsWith('http')) return img.url;
    return `${STRAPI_URL}${img.url}`;
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#44403c' }}>
        Imágenes del producto
      </label>

      <div
        className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer"
        style={{
          borderColor: dragOver ? '#1c1917' : '#d6d3d1',
          backgroundColor: dragOver ? '#faf7f2' : '#ffffff',
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <svg className="w-10 h-10 mx-auto mb-3" style={{ color: '#a8a29e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm mb-1" style={{ color: '#57534e' }}>
          {uploading ? 'Subiendo...' : 'Arrastra imágenes aquí o haz clic para seleccionar'}
        </p>
        <p className="text-xs" style={{ color: '#a8a29e' }}>JPG, PNG, WebP — Máximo 10MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group" style={{ backgroundColor: '#f5f0e8' }}>
              <Image
                src={getImageSrc(img)}
                alt={`Imagen ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(index); }}
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
