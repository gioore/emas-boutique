function normalizeUrl(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL)
  ? `https://${normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || '')}`
  : (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://emasboutique.com');

export const SITE_CONFIG = {
  name: 'EMAS BOUTIQUE',
  tagline: '100% original',
  description: 'Vestidos, blusas, pantalones, bolsos y más. Envíos a toda Guatemala.',
  instagram: 'emasboutique_',
  whatsapp: '50247633183',
  whatsappDisplay: '+502 4763-3183',
  email: 'info@emasboutique.com',
  heroTitle: 'Tu estilo',
  heroSubtitle: '100% original',
  heroDescription: 'Vestidos, blusas, pantalones, bolsos y accesorios. Envíos a toda Guatemala.',
  whatsappMessage: '¡Hola! Quiero información sobre EMAS BOUTIQUE.',
  whatsappProductMessage: (name: string, price: number) =>
    `Hola, me interesa este producto: ${name} - Q${price.toFixed(2)}. ¿Está disponible?`,
  footer: {
    description: '100% original. Entregas inmediatas y bajo pedido. Envíos a toda Guatemala.',
    copyright: `© ${new Date().getFullYear()} EMAS Boutique. Todos los derechos reservados.`,
  },
  categories: [
    { slug: 'mujer', label: 'Mujer', description: 'Vestidos, blusas, pantalones y más' },
    { slug: 'hombre', label: 'Hombre', description: 'Camisas, playeras, pantalones y más' },
  ],
};

export const WHY_EMAS = [
  {
    title: '100% Original',
    description: 'Todo nuestro inventario es 100% original. Sin imitaciones.',
    icon: 'shield',
  },
  {
    title: 'Atención Personalizada',
    description: 'Te atendemos por WhatsApp de forma directa y sin complicaciones.',
    icon: 'chat',
  },
  {
    title: 'Envíos Seguros',
    description: 'Empacamos con cuidado y enviamos a toda Guatemala con entregas rápidas.',
    icon: 'truck',
  },
];

export const TESTIMONIALS = [
  {
    name: 'María F.',
    text: 'Compré un vestido y llegó antes de lo esperado. La calidad es increíble, exactamente como se ve en las fotos. Volveré a comprar seguro.',
  },
  {
    name: 'Ana G.',
    text: 'Me encanta que todo sea original. La atención por WhatsApp es súper rápida y resolvieron todas mis dudas. Recomendada.',
  },
  {
    name: 'Carlos M.',
    text: 'Compré un reloj para regalo y quedaron fascinados. Producto original, bien empacado y el precio justo.',
  },
  {
    name: 'Sofía R.',
    text: 'EMAS Boutique es mi tienda de confianza. Siempre encuentran lo que busco y los envíos llegan perfectos.',
  },
];

export const BRAND_COLORS = {
  primary: '#d4a373',
  secondary: '#18181b',
  accent: '#c76f4b',
  background: '#faf7f2',
  backgroundAlt: '#f5f0e8',
  text: '#1c1917',
  textMuted: '#78716c',
  white: '#ffffff',
  black: '#0c0a09',
  gold: '#d4a373',
  terracotta: '#c76f4b',
  border: '#e5e0d8',
};
