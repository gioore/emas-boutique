export interface Brand {
  id: number;
  documentId: string;
  name: string;
  slug: string | null;
  logo: Image | null;
  active: boolean;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string | null;
  description: string | null;
  active: boolean;
  order: number;
}

export interface Subcategory {
  id: number;
  documentId: string;
  name: string;
  slug: string | null;
  description: string | null;
  active: boolean;
  order: number;
  category: Category | null;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  category: string; // kept for backwards compat (enum)
  subcategory: string; // kept for backwards compat (enum)
  cat: Category | null;
  subcat: Subcategory | null;
  description: string;
  sizes: string[];
  images: Image[];
  featured: boolean;
  brand: Brand | null;
  sku: string | null;
  availability: 'available' | 'low_stock' | 'out_of_stock' | 'pre_order' | null;
  newArrival: boolean | null;
  onSale: boolean | null;
  colors: string[] | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Image {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  name: string;
  width: number;
  height: number;
  formats: {
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

export interface ProductsResponse {
  data: Product[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ProductResponse {
  data: Product;
  meta: Record<string, unknown>;
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: 'Disponible',
  low_stock: 'Últimas unidades',
  out_of_stock: 'Agotado',
  pre_order: 'Bajo pedido',
};

export const AVAILABILITY_COLORS: Record<string, string> = {
  available: '#166534',
  low_stock: '#92400e',
  out_of_stock: '#991b1b',
  pre_order: '#1e40af',
};
