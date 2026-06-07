export function getImageUrl(image: { url: string } | null | undefined): string {
  if (!image?.url) return '/placeholder.svg';
  if (image.url.startsWith('http')) return image.url;
  return '/placeholder.svg';
}
