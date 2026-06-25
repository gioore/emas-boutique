'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { SITE_CONFIG, SITE_URL, BRAND_COLORS } from '@/lib/config';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const buildWhatsAppMessage = () => {
    const lines: string[] = ['Hola! Quiero hacer un pedido:\n'];
    items.forEach((item, i) => {
      const productUrl = `${SITE_URL}/producto/${item.slug}`;
      lines.push(`${i + 1}. ${item.name} - Q${item.price.toFixed(2)}`);
      lines.push(`   Talla: ${item.size} | Cant: ${item.quantity}`);
      if (item.color) lines.push(`   Color: ${item.color}`);
      lines.push(`   ${productUrl}`);
      if (i < items.length - 1) lines.push('');
    });
    lines.push(`\nTotal: Q${totalPrice.toFixed(2)}`);
    return encodeURIComponent(lines.join('\n'));
  };

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${buildWhatsAppMessage()}`;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4" style={{ backgroundColor: BRAND_COLORS.background }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f5f5f5' }}>
          <svg className="w-10 h-10" style={{ color: '#d6d3d1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: BRAND_COLORS.text }}>Tu carrito está vacío</h1>
        <p className="text-sm mb-8" style={{ color: BRAND_COLORS.textMuted }}>
          Agregá productos desde la página de cada producto
        </p>
        <Link
          href="/catalogo"
          className="px-8 py-3.5 text-white font-semibold rounded-full transition-all hover:scale-105 shadow-lg"
          style={{ backgroundColor: BRAND_COLORS.primary }}
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.background }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: BRAND_COLORS.text }}>Carrito</h1>
            <p className="text-sm mt-1" style={{ color: BRAND_COLORS.textMuted }}>
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ color: '#991b1b', backgroundColor: '#fef2f2' }}
          >
            Vaciar carrito
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex gap-4 p-4 rounded-2xl"
              style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.border}` }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: '#f5f5f5' }}>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: '#d6d3d1' }}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/producto/${item.slug}`}
                  className="text-sm font-semibold hover:underline block truncate"
                  style={{ color: BRAND_COLORS.text }}
                >
                  {item.name}
                </Link>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  <span className="text-xs" style={{ color: BRAND_COLORS.textMuted }}>
                    Talla: <span className="font-medium" style={{ color: BRAND_COLORS.text }}>{item.size}</span>
                  </span>
                  {item.color && (
                    <span className="text-xs" style={{ color: BRAND_COLORS.textMuted }}>
                      Color: <span className="font-medium" style={{ color: BRAND_COLORS.text }}>{item.color}</span>
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold mt-1" style={{ color: BRAND_COLORS.text }}>
                  Q{item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
                    style={{ backgroundColor: '#f5f5f5', color: BRAND_COLORS.text }}
                    aria-label="Reducir cantidad"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-8 text-center text-sm font-semibold" style={{ color: BRAND_COLORS.text }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
                    style={{ backgroundColor: '#f5f5f5', color: BRAND_COLORS.text }}
                    aria-label="Aumentar cantidad"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id, item.size)}
                  className="text-xs font-medium px-2 py-1 rounded-lg transition-colors"
                  style={{ color: '#991b1b' }}
                  aria-label="Eliminar producto"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: BRAND_COLORS.white, border: `1px solid ${BRAND_COLORS.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium" style={{ color: BRAND_COLORS.textMuted }}>Subtotal</span>
            <span className="text-lg font-bold" style={{ color: BRAND_COLORS.text }}>Q{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-6 pb-6 border-b" style={{ borderColor: '#e5e5e5' }}>
            <span className="text-sm font-medium" style={{ color: BRAND_COLORS.textMuted }}>Total</span>
            <span className="text-2xl font-bold" style={{ color: BRAND_COLORS.text }}>Q{totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-xs mb-4" style={{ color: BRAND_COLORS.textMuted }}>
            El total incluye todos los productos seleccionados. El envío se coordina por WhatsApp.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 text-white font-semibold rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{ backgroundColor: '#25D366' }}
          >
            <WhatsAppIcon className="w-5 h-5" />
            Pedir por WhatsApp
          </a>
          <div className="mt-4 text-center">
            <Link
              href="/catalogo"
              className="text-sm font-medium hover:underline"
              style={{ color: BRAND_COLORS.textMuted }}
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
