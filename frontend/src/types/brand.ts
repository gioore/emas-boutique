export interface Brand {
  id: number;
  documentId?: string;
  name?: string;
  slug?: string | null;
  logo?: { url: string } | null;
  active?: boolean;
}

