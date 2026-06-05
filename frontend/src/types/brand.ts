import type { Image } from '@/types/product';

export interface Brand {
  id: number;
  documentId: string;
  name: string;
  slug: string | null;
  logo: Image | null;
  active: boolean;
}

export interface BrandsResponse {
  data: Brand[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
