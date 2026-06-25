import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';
import Link from 'next/link';

export const metadata = {
  title: `Medios de Pago - ${SITE_CONFIG.name}`,
  description: 'Conoce los métodos de pago disponibles en EMAS Boutique: transferencia bancaria, efectivo y más. Compra seguro en Guatemala.',
};

export default function MediosDePagoPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Medios de Pago</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none" style={{ color: BRAND_COLORS.text }}>
          <p className="text-xl leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
            En EMAS Boutique ofrecemos varias opciones de pago para tu comodidad.
            Todos nuestros precios están en Quetzales (Q).
          </p>
          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />

          <h2 className="text-2xl font-bold mt-10">Transferencia Bancaria</h2>
          <p>
            Puedes realizar tu pago mediante transferencia o depósito a nuestra cuenta
            bancaria. Te proporcionaremos los datos de la cuenta al momento de confirmar
            tu pedido por WhatsApp.
          </p>
          <ul>
            <li>Aceptamos transferencias de todos los bancos de Guatemala</li>
            <li>El pedido se procesa una vez confirmado el pago</li>
            <li>Te enviaremos un comprobante de pago</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">Efectivo</h2>
          <p>
            Si coordinas una entrega presencial en la Ciudad de Guatemala, puedes pagar
            en efectivo al momento de recibir tus productos.
          </p>
          <ul>
            <li>Pago contra entrega en punto acordado</li>
            <li>Disponible solo en Ciudad de Guatemala</li>
            <li>Debes confirmar tu pedido antes para garantizar la disponibilidad</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">Billeteras Digitales</h2>
          <p>
            Consulta si aceptamos tu billetera digital favorita. Al confirmar tu pedido
            por WhatsApp, pregúntanos por opciones como:
          </p>
          <ul>
            <li>Tigo Money</li>
            <li>Otras billeteras digitales disponibles en Guatemala</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">Seguridad</h2>
          <p>
            Tu seguridad es importante para nosotros. Todos los pagos se procesan de
            forma segura y protegemos tus datos personales. No almacenamos información
            bancaria en nuestros sistemas.
          </p>

          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />
          <p>
            ¿Tienes dudas sobre los métodos de pago? Escríbenos por{' '}
            <Link
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hola, tengo una consulta sobre métodos de pago.')}`}
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
