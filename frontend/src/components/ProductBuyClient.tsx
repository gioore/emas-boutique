'use client';

import { useState, useEffect } from 'react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { SITE_CONFIG } from '@/lib/config';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface Props {
  productId: number;
  productName: string;
  productPrice: number;
  productSlug: string;
  productImage: string;
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

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium" style={{ backgroundColor: '#1c1917', color: '#ffffff' }}>
        <svg className="w-5 h-5 shrink-0" style={{ color: '#4a7c59' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    </div>
  );
}

export default function ProductBuyClient({ productId, productName, productPrice, productSlug, productImage, sizes, colors = [] }: Props) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      setError('Debes seleccionar una talla');
      return;
    }
    setError('');
    addItem({
      id: productId,
      name: productName,
      slug: productSlug,
      price: productPrice,
      size: selectedSize || 'Única',
      color: selectedColor ? getColorLabel(selectedColor) : undefined,
      image: productImage,
    });
    triggerToast('Producto agregado al carrito');
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(selectedColor === color ? '' : color);
  };

  const getMessage = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    let msg = `Hola, me interesa este producto:\n\n*${productName}*\nPrecio: Q${productPrice.toFixed(2)}\n`;
    if (selectedSize) msg += `Talla: ${selectedSize}\n`;
    if (selectedColor) msg += `Color: ${getColorLabel(selectedColor)}\n`;
    msg += `\n${url}`;
    return encodeURIComponent(msg);
  };

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${getMessage()}`;

  return (
    <div>
      <Toast message={toastMessage} visible={showToast} />

      {error && (
        <div className="mb-4 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {colors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: '#1c1917' }}>
            {selectedColor ? '2. Color seleccionado' : '2. Selecciona tu color'}
          </h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color, i) => {
              const hex = getColorHex(color);
              const light = isLightColor(hex);
              const isSelected = selectedColor === color;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleColorSelect(color)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: hex,
                    borderColor: isSelected ? '#1c1917' : light ? '#d6d3d1' : 'transparent',
                    color: light ? '#1c1917' : '#ffffff',
                    outline: isSelected ? '2px solid #1c1917' : 'none',
                    outlineOffset: '2px',
                  }}
                  aria-label={`Color: ${color}${isSelected ? ' (seleccionado)' : ''}`}
                  aria-pressed={isSelected}
                >
                  {isSelected && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {!isSelected && (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hex, border: light ? '1px solid #d6d3d1' : '1px solid rgba(255,255,255,0.3)' }} />
                  )}
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
                onClick={() => { setSelectedSize(selectedSize === size ? '' : size); setError(''); }}
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

      {/* Desktop buttons */}
      <div className="hidden sm:flex items-center gap-3 pt-6 border-t" style={{ borderColor: '#e5e0d8' }}>
        <button
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border-2"
          style={{ borderColor: '#1c1917', color: '#1c1917', backgroundColor: '#ffffff' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Agregar al carrito
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 text-white font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
          style={{ backgroundColor: '#25D366' }}
        >
          <WhatsAppIcon className="w-5 h-5" />
          Comprar ahora
        </a>
      </div>

      {/* Mobile sticky bar */}
      <div className="block sm:hidden fixed bottom-0 left-0 right-0 z-50 p-4 border-t shadow-2xl" style={{ backgroundColor: '#ffffff', borderColor: '#e5e0d8' }}>
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 flex-1 py-3.5 font-semibold rounded-full border-2 transition-all active:scale-[0.98]"
            style={{ borderColor: '#1c1917', color: '#1c1917', backgroundColor: '#ffffff' }}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-sm">Carrito</span>
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 flex-1 py-3.5 text-white font-semibold rounded-full transition-all active:scale-[0.98] shadow-lg"
            style={{ backgroundColor: '#25D366' }}
          >
            <WhatsAppIcon className="w-5 h-5 shrink-0" />
            <span className="text-sm">Comprar</span>
            {selectedSize && <span className="text-xs font-normal">— Talla {selectedSize}</span>}
          </a>
        </div>
      </div>
    </div>
  );
}
