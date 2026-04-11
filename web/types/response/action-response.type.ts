import { ApiError } from '@/types';

/**
 * Standardized Server Action Response
 */
export interface ActionResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
}
