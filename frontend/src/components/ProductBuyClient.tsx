'use client';

import { useState } from 'react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
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
  terracota: '#c76f4b',
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const HEX_TO_NAME: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(COLOR_MAP).map(([name, hex]) => [hex.toLowerCase(), capitalize(name)])
  ),
  '#4a7c59': 'Verde',
  '#991b1b': 'Vino',
};

function getColorHex(color: string): string {
  const cleaned = color.toLowerCase().trim();
  if (cleaned.startsWith('#')) return cleaned;
  if (cleaned.startsWith('0x')) return '#' + cleaned.slice(2);
  return COLOR_MAP[cleaned] || '#d6d3d1';
}

function getColorLabel(color: string): string {
  const cleaned = color.toLowerCase().trim();
  if (cleaned.startsWith('#') || cleaned.startsWith('0x')) {
    const hex = cleaned.startsWith('0x') ? '#' + cleaned.slice(2) : cleaned;
    return HEX_TO_NAME[hex] || color;
  }
  return capitalize(color);
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
                  {getColorLabel(color)}
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
          <WhatsAppIcon className="w-5 h-5" />
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
          <WhatsAppIcon className="w-5 h-5" />
          Comprar por WhatsApp
          {selectedSize && <span className="text-sm font-normal">— Talla {selectedSize}</span>}
        </a>
      </div>
    </div>
  );
}
