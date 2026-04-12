import { EnumItem } from '@/lib/enum/enum-item.type';
export const CROP_SUGGESTIONS = {
    RICE: new EnumItem(1, 'Rice'),
    WHEAT: new EnumItem(2, 'Wheat'),
    MAIZE: new EnumItem(3, 'Maize'),
    MILLET: new EnumItem(4, 'Millet'),
    SUNFLOWER: new EnumItem(5, 'Sunflower'),
    COTTON: new EnumItem(6, 'Cotton'),
    SUGARCANE: new EnumItem(7, 'Sugarcane'),
    PULSE: new EnumItem(8, 'Pulse')
} as const;


