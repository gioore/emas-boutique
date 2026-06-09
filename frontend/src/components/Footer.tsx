import Link from 'next/link';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { SITE_CONFIG } from '@/lib/config';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1c1917', color: '#d6d3d1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="sm:col-span-2 lg:col-span-1 reveal visible">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#d4a373', color: '#1c1917' }}>
                EB
              </div>
              <h3 className="text-white font-bold text-xl tracking-tight">{SITE_CONFIG.name}</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#78716c' }}>
              {SITE_CONFIG.footer.description}
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Categorías</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/mujer" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block" style={{ color: '#78716c' }}>
                  Mujer
                </Link>
              </li>
              <li>
                <Link href="/hombre" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block" style={{ color: '#78716c' }}>
                  Hombre
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block" style={{ color: '#78716c' }}>
                  Catálogo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Ayuda</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/faq" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block" style={{ color: '#78716c' }}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/guia-de-tallas" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block" style={{ color: '#78716c' }}>
                  Guía de Tallas
                </Link>
              </li>
              <li>
                <Link href="/envios" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block" style={{ color: '#78716c' }}>
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/cambios-devoluciones" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block" style={{ color: '#78716c' }}>
                  Cambios y Devoluciones
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Empresa</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/quienes-somos" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block" style={{ color: '#78716c' }}>
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block" style={{ color: '#78716c' }}>
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block" style={{ color: '#78716c' }}>
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="transition-all duration-200 hover:text-white hover:translate-x-1 inline-block" style={{ color: '#78716c' }}>
                  Términos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Social</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-all duration-200 hover:text-white hover:translate-x-1"
                  style={{ color: '#78716c' }}
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  {SITE_CONFIG.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${SITE_CONFIG.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-all duration-200 hover:text-white hover:translate-x-1"
                  style={{ color: '#78716c' }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  @{SITE_CONFIG.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="section-divider my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: '#78716c' }}>
            {SITE_CONFIG.footer.copyright}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs" style={{ color: '#57534e' }}>
              Mercadería 100% original
            </p>
            <Link href="/admin" className="text-xs transition-colors duration-200" style={{ color: '#57534e' }}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
