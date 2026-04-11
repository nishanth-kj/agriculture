import { EnumItem } from '@/lib/enum/enum-item.type';
export const GROWTH_STAGES = {
    SEEDLING: new EnumItem(1, 'Seedling'),
    VEGETATIVE: new EnumItem(2, 'Vegetative'),
    FLOWERING: new EnumItem(3, 'Flowering'),
    FRUITING: new EnumItem(4, 'Fruiting'),
    MATURITY: new EnumItem(5, 'Maturity'),
    HARVESTED: new EnumItem(6, 'Harvested')
} as const;


