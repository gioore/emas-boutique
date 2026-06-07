export interface Brand {
  id: number;
  documentId?: string;
  name?: string;
  slug?: string | null;
  logo?: { url: string } | null;
  active?: boolean;
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
