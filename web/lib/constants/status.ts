import { EnumItem } from '@/lib/enum/enum-item.type';

export const STATUS = {
    ACTIVE: new EnumItem(1, 'Active'),
    INACTIVE: new EnumItem(0, 'Inactive'),
    PENDING: new EnumItem(2, 'Pending'),
} as const;

