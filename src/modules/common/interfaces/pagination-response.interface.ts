export interface PaginationResponse<T> {
  data: T[];
  total: number;
  pageNumber: number;
  pageSize: number;
}

export interface PaginationRequest {
  pageNumber?: number;
  pageSize?: number;
}
