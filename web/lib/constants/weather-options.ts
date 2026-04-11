import { EnumItem } from '@/lib/enum/enum-item.type';
export const WEATHER_OPTIONS = {
    SUNNY: new EnumItem(1, 'Sunny'),
    RAINY: new EnumItem(2, 'Rainy'),
    CLOUDY: new EnumItem(3, 'Cloudy'),
    HUMID: new EnumItem(4, 'Humid'),
    DRY: new EnumItem(5, 'Dry'),
    WINDY: new EnumItem(6, 'Windy')
} as const;


