import {Category} from "./Category";
import {Product} from "./Product";
import {ShopInventory} from "../Shop/ShopInventory";

export interface ProductPurchase {
    readonly product_id: number,
    readonly name: string,
    readonly description: string,
    readonly category: ReadonlyArray<Category>
    readonly amount: number,
    original_price: number,
    actual_price: number,
    rating: number
}

export class ProductPurchaseImpl implements ProductPurchase {
    private readonly _amount: number;
    private readonly _category: ReadonlyArray<Category>;
    private readonly _description: string;
    private readonly _name: string;
    private readonly _product_id: number;

    constructor(product_id: number, name: string, description: string, amount: number, category: ReadonlyArray<Category>, original_price: number, actual_price: number) {
        this._product_id = product_id;
        this._name = name;
        this._description = description;
        this._amount = amount;
        this._category = category;
        this._original_price = original_price
        this._actual_price = actual_price;
    }

    private _actual_price: number;

    get actual_price(): number {
        return this._actual_price;
    }

    set actual_price(value: number) {
        this._actual_price = value;
    }

    private _original_price: number

    get original_price(): number {
        return this._original_price;
    }

    private _rating: number = -1;

    get rating(): number {
        return this._rating;
    }

    set rating(value: number) {
        this._rating = value;
    }

    get product_id() {
        return this._product_id;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get category() {
        return this._category;
    }

    get amount() {
        return this._amount;
    }

    get price() {
        return this._actual_price;
    }

    set price(value: number) {
        this._actual_price = value;
    }

    public static create(product: Product, coupons: any[], amount: number, shop: ShopInventory, actual_price?: number): ProductPurchase | string {
        const ret = ProductPurchaseImpl.createSupporterFunction(product, product.base_price, amount, 0)
        if (!actual_price) {
            const final_price = shop.calculatePrice([ret], {userId: -1, underaged: false});
            if (typeof final_price === "string") {
                return final_price
            }
            ret.actual_price = final_price
        } else ret.actual_price = actual_price
        return ret
    }

    private static createSupporterFunction(product: Product, original_price: number, amount: number, actual_price: number) {
        let product_id = product.product_id;
        let name = product.name;
        let description = product.description;
        let category = product.category;
        return new ProductPurchaseImpl(product_id, name, description, amount, category, original_price, actual_price)
    }

    static productsAreEqual(p1: ProductPurchase, p2: ProductPurchase) {
        return p1.product_id == p2.product_id &&
            p1.description == p2.description &&
            p1.category.length == p2.category.length &&
            p1.category.every(c1 => p2.category.some(c2 => c1.name == c2.name)) &&
            p1.amount == p2.amount &&
            p1.original_price == p2.original_price &&
            p1.actual_price == p2.actual_price
    }
}
