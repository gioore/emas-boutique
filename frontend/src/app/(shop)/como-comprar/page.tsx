import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';
import Link from 'next/link';

export const metadata = {
  title: `Cómo Comprar - ${SITE_CONFIG.name}`,
  description: 'Guía paso a paso para comprar en EMAS Boutique. Elige tus productos, cotiza por WhatsApp y recibe en toda Guatemala.',
};

export default function ComoComprarPage() {
  const steps = [
    {
      number: '01',
      title: 'Explora el Catálogo',
      desc: 'Navega por nuestro catálogo en línea. Filtra por categoría (Mujer u Hombre), marca o tipo de producto. Cada producto muestra precio, tallas disponibles y colores.',
    },
    {
      number: '02',
      title: 'Elige tus Productos',
      desc: 'Selecciona la talla y color de tu preferencia. Revisa los detalles y fotos de cada producto. Si tienes dudas, escríbenos por WhatsApp.',
    },
    {
      number: '03',
      title: 'Cotiza por WhatsApp',
      desc: 'Haz clic en el botón "Comprar por WhatsApp" y automáticamente se generará un mensaje con los productos que elegiste. Te responderemos para confirmar disponibilidad, costo de envío y tiempo de entrega.',
    },
    {
      number: '04',
      title: 'Confirma tu Pedido',
      desc: 'Te enviaremos la información de pago y coordinarás con nosotros el método de entrega. Una vez confirmado, procesamos tu pedido.',
    },
    {
      number: '05',
      title: 'Recibe o Recoge',
      desc: 'Recibe tu pedido en la puerta de tu casa (con envío a toda Guatemala) o coordina una entrega presencial en la Ciudad de Guatemala.',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Cómo Comprar</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none" style={{ color: BRAND_COLORS.text }}>
          <p className="text-xl leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
            Comprar en EMAS Boutique es muy sencillo. Sigue estos pasos y recibe tus productos
            favoritos en la comodidad de tu hogar.
          </p>
          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />

          {steps.map((step) => (
            <div key={step.number} className="mb-12">
              <div className="flex items-start gap-6">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: BRAND_COLORS.secondary }}
                >
                  {step.number}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mt-0">{step.title}</h2>
                  <p className="mt-2">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />
          <p>
            ¿Listo para empezar?{' '}
            <Link href="/catalogo" className="font-semibold underline" style={{ color: BRAND_COLORS.secondary }}>
              Explora nuestro catálogo
            </Link>{' '}
            o escríbenos por{' '}
            <Link
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hola, quiero más información sobre cómo comprar.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
              style={{ color: BRAND_COLORS.secondary }}
            >
              WhatsApp
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
