import { EnumItem } from '@/lib/enum/enum-item.type';

export const ROLE = {
    ADMIN: new EnumItem(1, 'Admin'),
    FARMER: new EnumItem(2, 'Farmer'),
    WORKER: new EnumItem(3, 'Worker'),
} as const;


