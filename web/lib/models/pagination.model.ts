import { Pagination as IPagination } from "@/types";

/**
 * Pagination Model Class
 * Handles logic for page transitions and API parameter mapping.
 */
export class PaginationModel implements IPagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  constructor(initial?: Partial<IPagination>) {
    this.page = initial?.page ?? 1;
    this.size = initial?.size ?? 10;
    this.total = initial?.total ?? 0;
    this.totalPages = initial?.totalPages ?? 0;
    this.sortBy = initial?.sortBy;
    this.sortOrder = initial?.sortOrder;
  }

  /**
   * Updates state based on API response
   */
  updateFromResponse(pagination: IPagination) {
    this.page = pagination.page;
    this.size = pagination.size;
    this.total = pagination.total;
    this.totalPages = pagination.totalPages;
    this.sortBy = pagination.sortBy;
    this.sortOrder = pagination.sortOrder;
    return this;
  }

  /**
   * Navigation methods
   */
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
    return this;
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
    return this;
  }

  setPage(page: number) {
    if (page >= 1 && (this.totalPages === 0 || page <= this.totalPages)) {
      this.page = page;
    }
    return this;
  }

  /**
   * Helper for API requests
   */
  toParams() {
    return {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    };
  }

  /**
   * Clone to ensure React state updates correctly if used directly
   */
  clone() {
    return new PaginationModel(this);
  }
}
