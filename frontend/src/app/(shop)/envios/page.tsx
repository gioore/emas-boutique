import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';
import Link from 'next/link';

export const metadata = {
  title: `Envíos - ${SITE_CONFIG.name}`,
  description: 'Información sobre envíos de EMAS Boutique a todos los departamentos de Guatemala por medio de nuestra empresa de logística.',
};

export default function EnviosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Envíos</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none" style={{ color: BRAND_COLORS.text }}>
          <p className="text-xl leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
            Realizamos envíos a todos los departamentos de Guatemala por medio de una empresa de logística.
          </p>
          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.text }} />

          <h2 className="text-2xl font-bold mt-10">Cobertura</h2>
          <p>
            Cubrimos los 22 departamentos de Guatemala. Trabajamos con una empresa de logística
            confiable que garantiza la entrega de tu pedido en cualquier destino del país.
          </p>

          <h2 className="text-2xl font-bold mt-10">Tiempos de Entrega</h2>
          <p>
            El tiempo de entrega varía según el departamento y la ubicación exacta. Al confirmar
            tu pedido te daremos una estimación precisa del tiempo de llegada.
          </p>

          <h2 className="text-2xl font-bold mt-10">Costos de Envío</h2>
          <p>
            El costo de envío depende del destino y del peso del paquete. Te proporcionaremos
            el costo exacto antes de confirmar tu pedido.
          </p>

          <h2 className="text-2xl font-bold mt-10">Seguimiento de Pedidos</h2>
          <p>
            Una vez realizado tu pedido, te enviaremos un número de seguimiento por
            WhatsApp para que puedas monitorear el estado de tu entrega.
          </p>

          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.text }} />
          <p>
            ¿Tienes dudas sobre tu entrega? Escríbenos por{' '}
            <Link
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hola, tengo una consulta sobre envíos.')}`}
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
