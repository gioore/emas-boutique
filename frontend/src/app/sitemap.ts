import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';

const BASE_URL = 'https://emasboutique.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/catalogo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/mujer`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/hombre`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/quienes-somos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/envios`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/cambios-devoluciones`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/guia-de-tallas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacidad`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terminos`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
