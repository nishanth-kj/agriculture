import { EnumItem } from '@/lib/enum/enum-item.type';

export const HTTP = {
    STATUS: {
        OK: new EnumItem(200, 'OK'),
        CREATED: new EnumItem(201, 'Created'),
        BAD_REQUEST: new EnumItem(400, 'Bad Request'),
        UNAUTHORIZED: new EnumItem(401, 'Unauthorized'),
        FORBIDDEN: new EnumItem(403, 'Forbidden'),
        NOT_FOUND: new EnumItem(404, 'Not Found'),
        INTERNAL_SERVER_ERROR: new EnumItem(500, 'Internal Server Error'),
    }
} as const;

