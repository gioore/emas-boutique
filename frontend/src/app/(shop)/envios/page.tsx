import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';
import Link from 'next/link';

export const metadata = {
  title: `Envíos - ${SITE_CONFIG.name}`,
  description: 'Información sobre envíos de EMAS Boutique a toda Guatemala. Conoce tiempos de entrega, costos y cobertura.',
};

export default function EnviosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Política de Envíos</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none" style={{ color: BRAND_COLORS.text }}>
          <p className="text-xl leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
            En EMAS Boutique realizamos entregas en la Ciudad de Guatemala y envíos a todo el país.
          </p>
          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />

          <h2 className="text-2xl font-bold mt-10">Áreas de Entrega</h2>
          <p>
            Cubrimos toda la República de Guatemala. Las entregas presenciales se coordinan
            en puntos acordados dentro de la Ciudad de Guatemala y áreas metropolitanas.
            Para el interior del país, realizamos envíos a través de agencias de encomiendas
            con cobertura nacional.
          </p>

          <h2 className="text-2xl font-bold mt-10">Tiempos de Entrega</h2>
          <ul>
            <li>
              <strong>Ciudad de Guatemala:</strong> Entrega el mismo día o al día siguiente,
              dependiendo de la hora de confirmación del pedido (antes de las 3:00 PM).
            </li>
            <li>
              <strong>Interior del país:</strong> De 2 a 5 días hábiles, según el destino
              y la agencia de encomiendas seleccionada.
            </li>
            <li>
              <strong>Bajo pedido (pre-order):</strong> Los productos bajo pedido pueden
              tener tiempos de entrega de 1 a 3 semanas. Te informaremos el tiempo estimado
              antes de confirmar tu compra.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">Costos de Envío</h2>
          <p>
            El costo de envío varía según el peso, tamaño del paquete y destino. Te
            proporcionaremos el costo exacto antes de confirmar tu pedido. En algunos
            casos, ofrecemos envío gratis en compras mayores a Q500.00 (válido para
            entregas en Ciudad de Guatemala).
          </p>

          <h2 className="text-2xl font-bold mt-10">Seguimiento de Pedidos</h2>
          <p>
            Una vez realizado tu pedido, te enviaremos un número de seguimiento por
            WhatsApp para que puedas monitorear el estado de tu entrega. También puedes
            contactarnos directamente para conocer el estatus de tu pedido.
          </p>

          <h2 className="text-2xl font-bold mt-10">Empaque</h2>
          <p>
            Todos nuestros productos son empacados cuidadosamente para garantizar que
            lleguen en perfectas condiciones. Utilizamos empaques protectores y bolsas
            selladas. Si el producto presenta daños durante el transporte, contáctanos
            de inmediato para resolverlo.
          </p>

          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />
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
