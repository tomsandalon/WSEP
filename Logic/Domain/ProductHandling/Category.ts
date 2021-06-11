/**
 * Requirement number - search item by category. // example.
 */
export interface Category {
    readonly name: string

    equals(obj: Category): boolean
}

export class CategoryImpl implements Category {
    private readonly _name: string;

    private constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    public static create(name: string): Category | string {
        if (name.length == 0) {
            return "Category name can't be empty"
        }
        return new CategoryImpl(name);
    }

    public equals(obj: Category): boolean {
        return this._name == obj.name
    }
}
