'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/lib/images';
import { BRAND_COLORS } from '@/lib/config';

interface Props {
  images: { url: string }[];
  productName: string;
  onSale: boolean;
  newArrival: boolean;
}

export default function ProductImageGallery({ images, productName, onSale, newArrival }: Props) {
  if (images.length === 0) return null;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zooming, setZooming] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    if (!images[index]?.url) return;
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, goNext, goPrev]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zooming) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="space-y-4">
      <div
        className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-lg cursor-crosshair"
        style={{ backgroundColor: BRAND_COLORS.backgroundAlt }}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={handleMouseMove}
        onClick={() => openLightbox(selectedIndex)}
      >
        {images[selectedIndex]?.url ? (
          <>
            <Image
              src={getOptimizedImageUrl(images[selectedIndex], 800)}
              alt={productName}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              style={{
                transform: zooming ? 'scale(1.8)' : 'scale(1)',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transition: zooming ? 'none' : 'transform 0.3s ease',
              }}
            />
            {zooming && (
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: `radial-gradient(circle 120px at ${zoomPos.x}% ${zoomPos.y}%, transparent 0%, rgba(0,0,0,0.15) 100%)`,
                  pointerEvents: 'none',
                }}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: '#d6d3d1' }}>
            <svg aria-hidden="true" className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {onSale && (
            <span className="px-3 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: BRAND_COLORS.terracotta, color: '#ffffff' }}>
              OFERTA
            </span>
          )}
          {newArrival && (
            <span className="px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: BRAND_COLORS.black, color: '#ffffff' }}>
              Nuevo Ingreso
            </span>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 hover:opacity-80"
              style={{
                borderColor: i === selectedIndex ? BRAND_COLORS.text : BRAND_COLORS.border,
                opacity: i === selectedIndex ? 1 : 0.6,
              }}
              aria-label={`Ver imagen ${i + 1} de ${images.length}`}
            >
              {img.url && (
                <Image
                  src={getOptimizedImageUrl(img, 160)}
                  alt=""
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Anterior"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Siguiente"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {images[lightboxIndex]?.url && (
              <Image
                src={getOptimizedImageUrl(images[lightboxIndex], 1200)}
                alt={productName}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
