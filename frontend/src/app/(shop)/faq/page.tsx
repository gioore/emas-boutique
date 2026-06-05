'use client';

import { useState } from 'react';
import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';

const faqs = [
  {
    question: '¿Cómo puedo realizar un pedido?',
    answer:
      'Para realizar un pedido, escríbenos por WhatsApp al ' +
      SITE_CONFIG.whatsappDisplay +
      '. Indícanos el producto que te interesa (puedes enviarnos captura de nuestra página o Instagram), tu talla y dirección de entrega. Te confirmaremos disponibilidad y el total a pagar.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos transferencias bancarias (BAM, Bi, Banco Industrial), depósitos, y pagos con tarjeta de crédito/débito a través de nuestro enlace de pago seguro. También aceptamos efectivo en entregas presenciales en la Ciudad de Guatemala.',
  },
  {
    question: '¿Cuánto tiempo tarda la entrega?',
    answer:
      'Las entregas en la Ciudad de Guatemala pueden ser el mismo día o al día siguiente, según la disponibilidad del producto. Para envíos al interior del país, el tiempo estimado es de 2 a 5 días hábiles por medio de la agencia de encomiendas.',
  },
  {
    question: '¿Cuánto cuesta el envío?',
    answer:
      'Los envíos tienen un costo que varía según el destino y el peso del paquete. Consulta nuestra página de envíos para más detalles o escríbenos por WhatsApp para una cotización precisa.',
  },
  {
    question: '¿Puedo cambiar o devolver un producto?',
    answer:
      'Sí, aceptamos cambios y devoluciones en caso de productos defectuosos o talla incorrecta, dentro de los primeros 3 días posteriores a la entrega. El producto debe estar sin uso, con etiquetas y en su empaque original. Consulta nuestra política completa en la página de Cambios y Devoluciones.',
  },
  {
    question: '¿Cómo sé qué talla elegir?',
    answer:
      'Contamos con una guía de tallas disponible en nuestra página. Sin embargo, las tallas pueden variar según la marca. Te recomendamos tomarte las medidas y consultarnos por WhatsApp para recomendarte la talla adecuada.',
  },
  {
    question: '¿Los productos son originales?',
    answer:
      'Sí, todos nuestros productos son 100% originales e importados. Seleccionamos cuidadosamente cada pieza para garantizar la mejor calidad.',
  },
  {
    question: '¿Tienen tienda física?',
    answer:
      'Actualmente operamos de forma digital. Realizamos entregas presenciales en puntos acordados de la Ciudad de Guatemala y envíos a todo el país.',
  },
  {
    question: '¿Se pueden apartar productos?',
    answer:
      'Sí, puedes apartar tu producto con un anticipo del 50% y coordinar la fecha para liquidar el resto. El apartado tiene una vigencia de 7 días.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: '#e5e0d8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>
            Preguntas Frecuentes
          </h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xl mb-12" style={{ color: BRAND_COLORS.textMuted }}>
          Resolvemos tus dudas. Si no encuentras lo que buscas, escríbenos por WhatsApp.
        </p>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-xl overflow-hidden transition-all"
              style={{ borderColor: '#e5e0d8' }}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold transition-colors"
                style={{ color: BRAND_COLORS.text, backgroundColor: openIndex === index ? BRAND_COLORS.background : BRAND_COLORS.white }}
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-4 ${openIndex === index ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5" style={{ backgroundColor: BRAND_COLORS.background, color: BRAND_COLORS.textMuted }}>
                  <p className="leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
