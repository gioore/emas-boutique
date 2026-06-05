import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';
import Link from 'next/link';

export const metadata = {
  title: `Términos y Condiciones - ${SITE_CONFIG.name}`,
  description: 'Términos y condiciones de uso de EMAS Boutique, tienda de mercadería importada en Guatemala.',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: '#e5e0d8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Términos y Condiciones</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none" style={{ color: BRAND_COLORS.text }}>
          <p className="text-xl leading-relaxed" style={{ color: BRAND_COLORS.textMuted }}>
            Al realizar una compra en EMAS Boutique, aceptas los siguientes términos y condiciones.
          </p>
          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />

          <h2 className="text-2xl font-bold mt-10">1. General</h2>
          <p>
            EMAS Boutique es un emprendimiento guatemalteco dedicado a la venta de mercadería
            importada 100% original. Al realizar un pedido a través de WhatsApp o cualquier
            otro medio, aceptas estos términos en su totalidad.
          </p>

          <h2 className="text-2xl font-bold mt-10">2. Productos</h2>
          <p>
            Todos los productos anunciados son 100% originales e importados. Las imágenes
            son de referencia y pueden tener ligeras variaciones respecto al producto real
            (iluminación, tonos de color). Nos esforzamos por describir cada producto con
            la mayor precisión posible.
          </p>

          <h2 className="text-2xl font-bold mt-10">3. Precios</h2>
          <p>
            Todos los precios están expresados en Quetzales (GTQ) e incluyen el IVA (IGV)
            cuando aplica. Los precios pueden cambiar sin previo aviso, pero el precio
            acordado al momento de confirmar tu pedido será respetado.
          </p>

          <h2 className="text-2xl font-bold mt-10">4. Proceso de Compra</h2>
          <ol>
            <li>Selecciona los productos de tu interés.</li>
            <li>Contáctanos por WhatsApp al {SITE_CONFIG.whatsappDisplay}.</li>
            <li>Te confirmaremos disponibilidad, precio total y tiempo de entrega.</li>
            <li>Realiza el pago por el medio acordado.</li>
            <li>Una vez confirmado el pago, procesaremos tu pedido.</li>
          </ol>

          <h2 className="text-2xl font-bold mt-10">5. Disponibilidad</h2>
          <p>
            Todos los productos están sujetos a disponibilidad. Si un producto no está
            disponible después de realizar tu pedido, te notificaremos y te ofreceremos
            un producto similar o el reembolso total.
          </p>

          <h2 className="text-2xl font-bold mt-10">6. Pagos</h2>
          <p>
            Aceptamos transferencias bancarias, depósitos, pagos con tarjeta de crédito/débito
            a través de enlace seguro y efectivo en entregas presenciales. El pedido no será
            procesado hasta que el pago haya sido confirmado.
          </p>

          <h2 className="text-2xl font-bold mt-10">7. Envíos</h2>
          <p>
            Realizamos entregas en la Ciudad de Guatemala y envíos a todo el país. Los
            tiempos de entrega varían según la ubicación. Consulta nuestra{' '}
            <Link href="/envios" className="font-semibold underline" style={{ color: BRAND_COLORS.secondary }}>
              política de envíos
            </Link>{' '}
            para más información.
          </p>

          <h2 className="text-2xl font-bold mt-10">8. Cambios y Devoluciones</h2>
          <p>
            Aceptamos cambios y devoluciones bajo los términos descritos en nuestra{' '}
            <Link href="/cambios-devoluciones" className="font-semibold underline" style={{ color: BRAND_COLORS.secondary }}>
              política de cambios y devoluciones
            </Link>
            .
          </p>

          <h2 className="text-2xl font-bold mt-10">9. Propiedad Intelectual</h2>
          <p>
            Todas las marcas, logotipos y nombres de productos mencionados son propiedad
            de sus respectivos dueños. EMAS Boutique no reclama derechos de propiedad
            intelectual sobre las marcas que comercializa.
          </p>

          <h2 className="text-2xl font-bold mt-10">10. Limitación de Responsabilidad</h2>
          <p>
            EMAS Boutique no se hace responsable por daños indirectos, pérdida de lucro
            o inconvenientes derivados del uso de los productos adquiridos. Nuestra
            responsabilidad se limita al valor del producto adquirido.
          </p>

          <h2 className="text-2xl font-bold mt-10">11. Ley Aplicable</h2>
          <p>
            Estos términos se rigen por las leyes de la República de Guatemala. Cualquier
            controversia será sometida a la jurisdicción de los tribunales de la Ciudad de
            Guatemala.
          </p>

          <div className="w-16 h-0.5 my-8" style={{ backgroundColor: BRAND_COLORS.gold }} />
          <p className="text-sm" style={{ color: BRAND_COLORS.textMuted }}>
            Última actualización: Junio 2025.
          </p>
        </div>
      </div>
    </div>
  );
}
