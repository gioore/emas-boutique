import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';

export const metadata = {
  title: `Política de Privacidad - ${SITE_CONFIG.name}`,
  description: 'Conoce cómo EMAS Boutique protege y utiliza tus datos personales.',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: '#e5e0d8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Política de Privacidad</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none" style={{ color: BRAND_COLORS.text }}>
          <p className="text-xl leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
            En EMAS Boutique nos tomamos muy en serio la privacidad de tus datos.
            Esta política describe cómo recopilamos, usamos y protegemos tu información.
          </p>
          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />

          <h2 className="text-2xl font-bold mt-10">Información que Recopilamos</h2>
          <p>
            Podemos recopilar la siguiente información personal cuando realizas una compra
            o te comunicas con nosotros:
          </p>
          <ul>
            <li>Nombre completo</li>
            <li>Número de teléfono (WhatsApp)</li>
            <li>Dirección de entrega</li>
            <li>Correo electrónico (si aplica)</li>
            <li>Información de pago (procesada a través de plataformas seguras de terceros)</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">Uso de la Información</h2>
          <p>Utilizamos tu información únicamente para:</p>
          <ul>
            <li>Procesar y gestionar tus pedidos.</li>
            <li>Coordinar la entrega de tus productos.</li>
            <li>Brindarte atención al cliente personalizada.</li>
            <li>Enviarte información sobre tus compras (estado del pedido, facturación).</li>
            <li>Enviarte promociones y novedades solo si has dado tu consentimiento explícito.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">Protección de Datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu
            información contra acceso no autorizado, pérdida, alteración o divulgación.
            Tus datos de pago son procesados a través de plataformas seguras que cumplen
            con los estándares de la industria (PCI-DSS).
          </p>

          <h2 className="text-2xl font-bold mt-10">Compartir Información con Terceros</h2>
          <p>
            No vendemos, alquilamos ni compartimos tu información personal con terceros,
            excepto cuando sea necesario para procesar tu pedido (agencias de encomiendas
            para la entrega, procesadores de pago) o cuando la ley lo requiera.
          </p>

          <h2 className="text-2xl font-bold mt-10">Datos de Mensajería (WhatsApp)</h2>
          <p>
            Las conversaciones mantenidas a través de WhatsApp son privadas y no serán
            compartidas con terceros. EMAS Boutique no almacena tus conversaciones más
            allá de lo necesario para brindarte atención al cliente y gestionar tus pedidos.
          </p>

          <h2 className="text-2xl font-bold mt-10">Tus Derechos</h2>
          <p>Tienes derecho a:</p>
          <ul>
            <li>Solicitar acceso a tus datos personales que tenemos almacenados.</li>
            <li>Solicitar la corrección de datos inexactos.</li>
            <li>Solicitar la eliminación de tus datos personales.</li>
            <li>Oponerte al uso de tus datos para fines de marketing.</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, contáctanos por WhatsApp al{' '}
            <strong>{SITE_CONFIG.whatsappDisplay}</strong>.
          </p>

          <h2 className="text-2xl font-bold mt-10">Cambios a esta Política</h2>
          <p>
            Nos reservamos el derecho de actualizar esta política de privacidad en
            cualquier momento. Los cambios serán publicados en esta página y, cuando sea
            relevante, te notificaremos por WhatsApp.
          </p>

          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />
          <p className="text-sm" style={{ color: BRAND_COLORS.textMuted }}>
            Última actualización: {new Date().toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}.
          </p>
        </div>
      </div>
    </div>
  );
}
