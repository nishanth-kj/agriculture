import { EnumItem } from '@/lib/enum/enum-item.type';
export const SEASONS = {
    KHARIF: new EnumItem(1, 'Kharif'),
    RABI: new EnumItem(2, 'Rabi'),
    SUMMER: new EnumItem(3, 'Summer'),
    WHOLE_YEAR: new EnumItem(4, 'Whole Year')
} as const;


