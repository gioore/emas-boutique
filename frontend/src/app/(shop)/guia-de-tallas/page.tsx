import { SITE_CONFIG, BRAND_COLORS } from '@/lib/config';
import Link from 'next/link';

export const metadata = {
  title: `Guía de Tallas - ${SITE_CONFIG.name}`,
  description: 'Encuentra tu talla perfecta con la guía de tallas de EMAS Boutique. Tablas de medidas para ropa y calzado.',
};

export default function GuiaDeTallasPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.white }}>
      <div className="border-b" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: BRAND_COLORS.textMuted }}>
            {SITE_CONFIG.name}
          </span>
          <h1 className="text-4xl font-bold mt-2" style={{ color: BRAND_COLORS.text }}>Guía de Tallas</h1>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xl mb-12" style={{ color: BRAND_COLORS.textMuted }}>
          Encuentra tu talla ideal con nuestras tablas de medidas. Recuerda que las
          tallas pueden variar ligeramente según la marca.
        </p>

        <div className="w-16 h-0.5 mb-10" style={{ backgroundColor: BRAND_COLORS.gold }} />

        {/* Mujer */}
        <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.text }}>Ropa de Mujer</h2>
        <p className="mb-4 text-sm" style={{ color: BRAND_COLORS.textMuted }}>Medidas en centímetros</p>
        <div className="overflow-x-auto mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>Talla</th>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>Busto (cm)</th>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>Cintura (cm)</th>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>Cadera (cm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['XS', '80–84', '60–64', '88–92'],
                ['S', '84–88', '64–68', '92–96'],
                ['M', '88–92', '68–72', '96–100'],
                ['L', '92–96', '72–76', '100–104'],
                ['XL', '96–102', '76–82', '104–110'],
                ['2XL', '102–108', '82–88', '110–116'],
                ['3XL', '108–114', '88–94', '116–122'],
              ].map(([talla, busto, cintura, cadera], i) => (
                <tr key={i} className="border" style={{ borderColor: BRAND_COLORS.border, backgroundColor: i % 2 === 0 ? BRAND_COLORS.white : BRAND_COLORS.background }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: BRAND_COLORS.text }}>{talla}</td>
                  <td className="px-4 py-3" style={{ color: BRAND_COLORS.textMuted }}>{busto}</td>
                  <td className="px-4 py-3" style={{ color: BRAND_COLORS.textMuted }}>{cintura}</td>
                  <td className="px-4 py-3" style={{ color: BRAND_COLORS.textMuted }}>{cadera}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hombre */}
        <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.text }}>Ropa de Hombre</h2>
        <p className="mb-4 text-sm" style={{ color: BRAND_COLORS.textMuted }}>Medidas en centímetros</p>
        <div className="overflow-x-auto mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>Talla</th>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>Pecho (cm)</th>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>Cintura (cm)</th>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>Cadera (cm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['XS', '86–90', '72–76', '90–94'],
                ['S', '90–94', '76–80', '94–98'],
                ['M', '94–98', '80–84', '98–102'],
                ['L', '98–104', '84–90', '102–108'],
                ['XL', '104–110', '90–96', '108–114'],
                ['2XL', '110–116', '96–102', '114–120'],
                ['3XL', '116–122', '102–108', '120–126'],
              ].map(([talla, pecho, cintura, cadera], i) => (
                <tr key={i} className="border" style={{ borderColor: BRAND_COLORS.border, backgroundColor: i % 2 === 0 ? BRAND_COLORS.white : BRAND_COLORS.background }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: BRAND_COLORS.text }}>{talla}</td>
                  <td className="px-4 py-3" style={{ color: BRAND_COLORS.textMuted }}>{pecho}</td>
                  <td className="px-4 py-3" style={{ color: BRAND_COLORS.textMuted }}>{cintura}</td>
                  <td className="px-4 py-3" style={{ color: BRAND_COLORS.textMuted }}>{cadera}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calzado */}
        <h2 className="text-2xl font-bold mb-6" style={{ color: BRAND_COLORS.text }}>Calzado</h2>
        <p className="mb-4 text-sm" style={{ color: BRAND_COLORS.textMuted }}>Conversión de tallas</p>
        <div className="overflow-x-auto mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.background }}>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>EU</th>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>US Mujer</th>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>US Hombre</th>
                <th className="px-4 py-3 font-semibold border" style={{ borderColor: BRAND_COLORS.border, color: BRAND_COLORS.text }}>Medida (cm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['35', '5', '—', '22.0'],
                ['36', '6', '—', '22.8'],
                ['37', '6.5', '—', '23.5'],
                ['38', '7.5', '—', '24.3'],
                ['39', '8.5', '6', '25.0'],
                ['40', '9', '7', '25.8'],
                ['41', '10', '8', '26.5'],
                ['42', '—', '9', '27.3'],
                ['43', '—', '10', '28.0'],
                ['44', '—', '11', '28.8'],
              ].map(([eu, usMujer, usHombre, cm], i) => (
                <tr key={i} className="border" style={{ borderColor: BRAND_COLORS.border, backgroundColor: i % 2 === 0 ? BRAND_COLORS.white : BRAND_COLORS.background }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: BRAND_COLORS.text }}>{eu}</td>
                  <td className="px-4 py-3" style={{ color: BRAND_COLORS.textMuted }}>{usMujer}</td>
                  <td className="px-4 py-3" style={{ color: BRAND_COLORS.textMuted }}>{usHombre}</td>
                  <td className="px-4 py-3" style={{ color: BRAND_COLORS.textMuted }}>{cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl p-8 border" style={{ backgroundColor: BRAND_COLORS.background, borderColor: BRAND_COLORS.border }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: BRAND_COLORS.text }}>¿Cómo tomar tus medidas?</h3>
          <ul className="space-y-2" style={{ color: BRAND_COLORS.textMuted }}>
            <li><strong>Busto / Pecho:</strong> Mide alrededor de la parte más completa de tu pecho, manteniendo la cinta horizontal.</li>
            <li><strong>Cintura:</strong> Mide la parte más angosta de tu cintura, generalmente unos 2 cm arriba del ombligo.</li>
            <li><strong>Cadera:</strong> Mide la parte más ancha de tus caderas, manteniendo los pies juntos.</li>
          </ul>
        </div>

        <div className="w-16 h-0.5 my-10" style={{ backgroundColor: BRAND_COLORS.gold }} />
        <p style={{ color: BRAND_COLORS.textMuted }}>
          <strong>Nota importante:</strong> Las tallas pueden variar entre marcas. Si tienes
          dudas sobre qué talla elegir, envíanos tus medidas por{' '}
          <Link
            href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hola, ¿pueden ayudarme con la talla?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
            style={{ color: BRAND_COLORS.secondary }}
          >
            WhatsApp
          </Link>{' '}
          y con gusto te asesoramos.
        </p>
      </div>
    </div>
  );
}
