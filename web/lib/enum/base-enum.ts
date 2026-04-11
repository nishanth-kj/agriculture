import { EnumItem } from '@/lib/enum/enum-item.type';

export type EnumDefinition<T extends string> = {
    readonly [K in T]: EnumItem;
};

export class EnumUtil {
    /**
     * Get only the values (labels) of the enum
     */
    static getValues<T extends string>(def: EnumDefinition<T>): string[] {
        return (Object.values(def) as EnumItem[]).map(item => item.value);
    }

    /**
     * Get only the numeric codes of the enum
     */
    static getCodes<T extends string>(def: EnumDefinition<T>): number[] {
        return (Object.values(def) as EnumItem[]).map(item => item.code);
    }

    /**
     * Get the full item for a given key
     */
    static getItem<T extends string>(def: EnumDefinition<T>, key: T): EnumItem {
        return def[key];
    }

    /**
     * Retrieve an EnumItem by its numeric code
     */
    static getByCode<T extends string>(def: EnumDefinition<T>, code: number): EnumItem | undefined {
        return (Object.values(def) as EnumItem[]).find(item => item.code === code);
    }

    /**
     * Retrieve an EnumItem by its string value
     */
    static getByValue<T extends string>(def: EnumDefinition<T>, value: string): EnumItem | undefined {
        return (Object.values(def) as EnumItem[]).find(item => item.value === value);
    }
}
