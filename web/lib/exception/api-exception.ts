import { EnumItem } from '@/lib/enum/enum-item.type';

/**
 * Base class for all API exceptions
 */
export class ApiException extends Error {
    public item: EnumItem;
    public code: string | number;
    public fields?: Record<string, unknown>;

    constructor(
        item: EnumItem,
        fields?: Record<string, unknown>
    ) {
        super(item.value);
        this.item = item;
        this.code = item.code;
        this.fields = fields;
        this.name = 'ApiException';
    }

    get statusCode(): number {
        return typeof this.code === 'number' ? this.code : 400;
    }
}

/**
 * Exception for 401 Unauthorized errors
 */
export class AuthException extends ApiException {
    constructor(item: EnumItem) {
        super(item);
        this.name = 'AuthException';
    }
}

/**
 * Exception for 403 Forbidden errors
 */
export class ForbiddenException extends ApiException {
    constructor(item: EnumItem) {
        super(item);
        this.name = 'ForbiddenException';
    }
}

/**
 * Exception for 404 Not Found errors
 */
export class NotFoundException extends ApiException {
    constructor(item: EnumItem) {
        super(item);
        this.name = 'NotFoundException';
    }
}

/**
 * Exception for validation errors
 */
export class ValidationException extends ApiException {
    constructor(item: EnumItem, fields?: Record<string, unknown>) {
        super(item, fields);
        this.name = 'ValidationException';
    }
}
