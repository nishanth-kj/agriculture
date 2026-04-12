import { Pagination } from '@/types';

/**
 * Standardized API Response Payload
 */
export interface ApiResponsePayload<T = unknown> {
    data: T;
    pagination?: Pagination;
}
