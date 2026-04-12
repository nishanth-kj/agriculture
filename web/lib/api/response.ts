import { NextResponse } from "next/server";
import { ApiException } from '@/lib/server';

/**
 * Standardized API Response Handler
 * Based on user-provided minimalist logic.
 */
export class ApiResponseHandler<T = unknown> {
    constructor(private data: T | string | null, private code?: number, private field?: string) {
        this.data = data;
        this.code = code;
        this.field = field;
    }

    /**
     * Send a successful response
     */
    success() {
        return NextResponse.json({
            status: 1,
            data: this.data,
            error: null
        });
    }

    /**
     * Send an error response
     */
    error() {
        return NextResponse.json({
            status: 0,
            data: null,
            error: {
                code: this.code || 500,
                message: this.data || "Unknown Error",
                field: this.field || null
            }
        });
    }
}

/**
 * Factory function named ApiResponse for clean call-site usage:
 * ApiResponse(data).success()
 */
export const ApiResponse = <T = unknown>(dataOrItem: T | ApiException | unknown = null, code?: number, field?: string) => {
    // 1. Handle ApiException instances (unwrap message and code)
    if (dataOrItem instanceof ApiException) {
        return new ApiResponseHandler<string>(dataOrItem.item.value, dataOrItem.item.code);
    }

    if (dataOrItem && typeof dataOrItem === 'object' && 'value' in (dataOrItem as Record<string, unknown>)) {
        const item = dataOrItem as { value: string; code?: number };
        return new ApiResponseHandler<string>(item.value, item.code || code, field);
    }

    // 3. Raw data
    return new ApiResponseHandler<T>(dataOrItem as T, code, field);
};
