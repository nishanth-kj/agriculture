import { EnumItem } from '@/lib/enum/enum-item.type';

export const RESOURCE_TYPE = {
    INVENTORY: new EnumItem(1, 'Inventory'),
    LABOUR: new EnumItem(2, 'Labour'),
} as const;
