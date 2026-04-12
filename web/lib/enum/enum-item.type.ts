export class EnumItem {
    constructor(private readonly _code: number, private readonly _value: string) {}

    get code(): number {
        return this._code;
    }

    get value(): string {
        return this._value;
    }
}
