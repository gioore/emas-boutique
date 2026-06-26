export function getImageUrl(image: { url: string } | null | undefined): string {
  if (!image?.url) return '/placeholder.svg';
  if (image.url.startsWith('http') || image.url.startsWith('/')) return image.url;
  return '/placeholder.svg';
}

export function getOptimizedImageUrl(image: { url: string } | null | undefined, width = 800): string {
  if (!image?.url) return '/placeholder.svg';
  if (image.url.startsWith('http')) {
    if (image.url.includes('cloudinary.com')) {
      const base = image.url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
      return base;
    }
    return image.url;
  }
  if (image.url.startsWith('/')) return image.url;
  return '/placeholder.svg';
}

export const OG_IMAGE_URL = `https://res.cloudinary.com/dt9ad6ovb/image/upload/w_1200,h_630,c_fill,q_auto,f_auto/emas-og`;
