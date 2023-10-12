declare module 'mongoose' {
  interface PaginateResult<T> {
    items: T[];
    totalItems: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    page?: number | undefined;
    totalPages: number;
  }
}
