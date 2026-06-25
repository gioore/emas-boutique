import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';

export const metadata = {
  title: `Quiénes Somos - ${SITE_CONFIG.name}`,
  description: 'Conoce la historia de EMAS Boutique, tu tienda de moda 100% original en Guatemala.',
};

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Quiénes Somos</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none" style={{ color: BRAND_COLORS.text }}>
          <p className="text-xl leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
            EMAS Boutique nace de la pasión por la moda y el deseo de ofrecer a Guatemala
            productos 100% originales a precios accesibles.
          </p>
          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.text }} />
          <h2 className="text-2xl font-bold mt-10">Nuestra Historia</h2>
          <p>
            EMAS Boutique es un emprendimiento guatemalteco dedicado a la venta de ropa,
            calzado, bolsos y accesorios. Seleccionamos cuidadosamente cada
            pieza para ofrecerte lo mejor de las tendencias internacionales.
          </p>
          <h2 className="text-2xl font-bold mt-10">Nuestra Misión</h2>
          <p>
            Brindar a nuestros clientes productos de alta calidad, originales
            y con estilo, acompañados de un servicio cercano y personalizado. Creemos en
            la moda como expresión de identidad.
          </p>
          <h2 className="text-2xl font-bold mt-10">Nuestros Valores</h2>
          <ul>
            <li><strong>Autenticidad:</strong> Solo trabajamos con productos 100% originales.</li>
            <li><strong>Calidad:</strong> Cada prenda es seleccionada por su calidad y diseño.</li>
            <li><strong>Cercanía:</strong> Te atendemos de forma personalizada vía WhatsApp.</li>
            <li><strong>Compromiso:</strong> Entregas inmediatas y envíos a toda Guatemala.</li>
          </ul>
          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.text }} />
          <p>
            Contáctanos por WhatsApp al <strong>{SITE_CONFIG.whatsappDisplay}</strong> para
            cualquier consulta. ¡Estamos para servirte!
          </p>
        </div>
      </div>
    </div>
  );
}
