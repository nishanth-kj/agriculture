/**
 * Standardized Pagination structure
 */
export interface Pagination {
    page: number;
    size: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    total: number;
    totalPages: number;

}
