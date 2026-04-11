import { ApiErrorCodeKey } from '@/types';

/**
 * Standardized API Error structure
 */
export interface ApiError {
    code: ApiErrorCodeKey | string | number; // Added number support for the new Enum system
    value: string; // Human-readable or logic-relevant string
    field?: Record<string, unknown> | string;
}
