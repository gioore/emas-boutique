export interface Brand {
  id: number;
  name?: string;
  slug?: string | null;
  logo?: { url: string } | null;
  active?: boolean;
}

export interface Category {
  id: number;
  name?: string;
  slug?: string | null;
  description?: string | null;
  active?: boolean;
  order?: number;
}

export interface Subcategory {
  id: number;
  name?: string;
  slug?: string | null;
  description?: string | null;
  active?: boolean;
  order?: number;
  category?: Category | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  category: string;
  subcategory: string;
  cat: Category | null;
  subcat: Subcategory | null;
  description: string;
  sizes: string[];
  images: Image[];
  featured: boolean;
  brand: Brand | null;
  sku: string | null;
  availability: string | null;
  newArrival: boolean | null;
  onSale: boolean | null;
  colors: string[] | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: number;
  url: string;
  alternativeText: string | null;
  name: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
}

export interface ImageFormat {
  url: string;
  width: number;
  height: number;
  name: string;
}


