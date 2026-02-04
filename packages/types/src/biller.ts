export interface Biller {
  id: string;
  billerName: string;
  description: string;
  iconLogo: string;
  status: 'active' | 'inactive' | 'pending';
  shortCode: string;
  providerCode: string;
  channel: 'web' | 'mobile';
  insertedAt: string;
  updatedAt: string;
}

export interface BillerFilters {
  channel?: string;
  status?: string;
}

export interface GetBillersVariables {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
  filters?: BillerFilters;
  fromDate?: string;
  toDate?: string;
}

export interface GetBillersResult {
  billers: {
    entries: Biller[];
    pageNumber: number;
    pageSize: number;
    totalEntries: number;
    totalPages: number;
  };
}

export interface GetBillerByIdVariables {
  id: string;
}

export interface GetBillerByIdResult {
  getBillerById: Biller;
}
