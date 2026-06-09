'use client';

import { useState } from 'react';
import { SITE_CONFIG } from '@/lib/config';

interface Props {
  productName: string;
  productPrice: number;
  sizes: string[];
  colors?: string[];
}

const COLOR_MAP: Record<string, string> = {
  negro: '#1c1917',
  blanco: '#ffffff',
  rojo: '#dc2626',
  azul: '#2563eb',
  verde: '#16a34a',
  amarillo: '#eab308',
  rosa: '#ec4899',
  morado: '#9333ea',
  naranja: '#ea580c',
  gris: '#78716c',
  cafe: '#92400e',
  dorado: '#d4a373',
  plateado: '#9ca3af',
  beige: '#e5e0d8',
  marino: '#1e3a5f',
  vino: '#7f1d1d',
  mostaza: '#b45309',
  teal: '#0d9488',
  coral: '#f43f5e',
  lavanda: '#c084fc',
  oliva: '#4d7c0f',
};

function getColorHex(color: string): string {
  const cleaned = color.toLowerCase().trim();
  if (cleaned.startsWith('#')) return cleaned;
  if (cleaned.startsWith('0x')) return '#' + cleaned.slice(2);
  return COLOR_MAP[cleaned] || '#d6d3d1';
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

export default function ProductBuyClient({ productName, productPrice, sizes, colors = [] }: Props) {
  const [selectedSize, setSelectedSize] = useState<string>('');

  const getMessage = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    let msg = `Hola, me interesa este producto:\n\n*${productName}*\nPrecio: Q${productPrice.toFixed(2)}\n`;
    if (selectedSize) msg += `Talla: ${selectedSize}\n`;
    msg += `\n${url}`;
    return encodeURIComponent(msg);
  };

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${getMessage()}`;

  return (
    <div>
      {/* Color circles */}
      {colors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: '#1c1917' }}>
            Colores disponibles
          </h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color, i) => {
              const hex = getColorHex(color);
              const light = isLightColor(hex);
              return (
                <button
                  type="button"
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer"
                  style={{
                    backgroundColor: hex,
                    borderColor: light ? '#d6d3d1' : 'transparent',
                    color: light ? '#1c1917' : '#ffffff',
                  }}
                  aria-label={`Color: ${color}`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hex, border: light ? '1px solid #d6d3d1' : '1px solid rgba(255,255,255,0.3)' }} />
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: '#1c1917' }}>
            1. Selecciona tu talla
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                className="px-5 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200"
                aria-label={`Talla: ${size}${selectedSize === size ? ' (seleccionada)' : ''}`}
                aria-pressed={selectedSize === size}
                style={{
                  borderColor: selectedSize === size ? '#1c1917' : '#d6d3d1',
                  backgroundColor: selectedSize === size ? '#1c1917' : '#ffffff',
                  color: selectedSize === size ? '#ffffff' : '#1c1917',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop buy button */}
      <div className="hidden sm:block pt-6 border-t" style={{ borderColor: '#e5e0d8' }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 text-white font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          2. Comprar por WhatsApp
        </a>
        <p className="text-xs mt-3" style={{ color: '#78716c' }}>
          Haz clic para contactarnos. Incluye producto, precio{selectedSize ? `, talla ${selectedSize}` : ''} y enlace.
        </p>
      </div>

      {/* Mobile sticky bar */}
      <div className="block sm:hidden fixed bottom-0 left-0 right-0 z-50 p-4 border-t shadow-2xl" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-3.5 text-white font-semibold rounded-full transition-all active:scale-[0.98] shadow-lg"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Comprar por WhatsApp
          {selectedSize && <span className="text-sm font-normal">— Talla {selectedSize}</span>}
        </a>
      </div>
    </div>
  );
}
