export function getImageUrl(image: { url: string }): string {
  if (image.url.startsWith('http')) return image.url;
  const base = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${base}${image.url}`;
}
