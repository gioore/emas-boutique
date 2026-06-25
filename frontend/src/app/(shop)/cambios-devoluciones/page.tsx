import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';
import Link from 'next/link';

export const metadata = {
  title: `Cambios y Devoluciones - ${SITE_CONFIG.name}`,
  description: 'Conoce la política de cambios y devoluciones de EMAS Boutique en Guatemala.',
};

export default function CambiosDevolucionesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Cambios y Devoluciones</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none" style={{ color: BRAND_COLORS.text }}>
          <p className="text-xl leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
            En EMAS Boutique queremos que estés completamente satisfecha con tu compra.
            Por eso, ponemos a tu disposición nuestra política de cambios y devoluciones.
          </p>
          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />

          <h2 className="text-2xl font-bold mt-10">Plazo para Cambios o Devoluciones</h2>
          <p>
            Dispone de un máximo de <strong>3 días calendario</strong> a partir de la fecha
            de entrega para solicitar un cambio o devolución. Pasado este plazo, no
            podremos aceptar la solicitud.
          </p>

          <h2 className="text-2xl font-bold mt-10">Condiciones del Producto</h2>
          <p>Para que un cambio o devolución sea aceptado, el producto debe cumplir con:</p>
          <ul>
            <li>Estar sin señas de uso, lavado o daño.</li>
            <li>Conservar todas las etiquetas y empaques originales.</li>
            <li>Estar en las mismas condiciones en que fue entregado.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">Motivos Aceptados</h2>
          <ul>
            <li><strong>Producto defectuoso:</strong> Si recibes un producto con daños de fábrica, te lo cambiaremos sin costo adicional.</li>
            <li><strong>Talla incorrecta:</strong> Si la talla no te quedó bien, puedes cambiarlo por otra talla o producto de igual valor.</li>
            <li><strong>Producto equivocado:</strong> Si te enviamos un producto diferente al solicitado, lo cambiaremos de inmediato.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">Proceso para Solicitar un Cambio o Devolución</h2>
          <ol>
            <li>Contáctanos por WhatsApp al <strong>{SITE_CONFIG.whatsappDisplay}</strong> dentro del plazo de 3 días.</li>
            <li>Indícanos el número de pedido, el producto y el motivo del cambio o devolución.</li>
            <li>Te enviaremos las instrucciones para coordinar la recogida o entrega del producto.</li>
            <li>Una vez recibido y verificado el producto, procesaremos el cambio o reembolso.</li>
          </ol>

          <h2 className="text-2xl font-bold mt-10">Costos de Envío para Devoluciones</h2>
          <ul>
            <li>
              <strong>Por defecto de fábrica o error nuestro:</strong> Cubrimos el costo
              de envío de la devolución y el reenvío del producto correcto sin cargo.
            </li>
            <li>
              <strong>Por talla incorrecta o cambio de opinión:</strong> El costo de envío
              de la devolución corre por cuenta del cliente. El reenvío del nuevo producto
              también tiene un costo adicional.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">Reembolsos</h2>
          <p>
            Los reembolsos se procesarán una vez recibido y verificado el producto devuelto.
            El tiempo de procesamiento puede ser de 5 a 10 días hábiles, dependiendo del
            método de pago utilizado. El reembolso se realiza por el mismo medio en que se
            realizó el pago.
          </p>

          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />
          <p>
            ¿Tienes alguna duda? Escríbenos por{' '}
            <Link
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hola, tengo una consulta sobre cambios y devoluciones.')}`}
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
