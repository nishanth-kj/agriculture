import { ApiResponse } from '@/lib/api/response';
import { ApiException } from "./api-exception";

/**
 * Standardized Error Handling Factory
 * Signature: ErrorException(value, code, field)
 * Use this strict version as per user request.
 */
export const ErrorException = (value: string | ApiException | unknown, code?: number, field?: string) => {
    // 1. Handle ApiException instances
    if (value instanceof ApiException) {
        return ApiResponse(value.item.value, code || value.statusCode, field).error();
    }

    // 2. Wrap generic values or strings
    return ApiResponse(value as string, code, field).error();
};
