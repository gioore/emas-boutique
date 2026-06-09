export function getImageUrl(image: { url: string } | null | undefined): string {
  if (!image?.url) return '/placeholder.svg';
  if (image.url.startsWith('http') || image.url.startsWith('/')) return image.url;
  return '/placeholder.svg';
}
