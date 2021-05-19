import {Category} from "./Category";
import {Product} from "./Product";
import {ShopInventory} from "../Shop/ShopInventory";
import {Rating} from "./Rating";

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

export class ProductPurchaseImpl implements ProductPurchase{
    private _actual_price: number;
    private readonly _amount: number;
    private readonly _category: ReadonlyArray<Category>;
    private readonly _description: string;
    private readonly _name: string;
    private readonly _product_id: number;
    private _original_price: number
    private _rating: number = -1;


    private constructor(product: Product, original_price: number, amount: number, actual_price: number) {
        this._product_id = product.product_id;
        this._name = product.name;
        this._description = product.description;
        this._amount = amount;
        this._category = product.category;
        this._original_price = original_price
        this._actual_price = actual_price;
    }

    public static create(product: Product, coupons: any[], amount: number, shop: ShopInventory, actual_price?: number): ProductPurchase | string{
        const ret = new ProductPurchaseImpl(product, product.price, amount, 0)
        if (!actual_price) {
            const final_price = shop.calculatePrice([ret], {userId: -1, underaged: false});
            if (typeof final_price === "string") {
                return final_price
            }
            ret.actual_price = final_price
        }
        else ret.actual_price = actual_price
        return ret
    }

    set actual_price(value: number) {
        this._actual_price = value;
    }

    get actual_price(): number {
        return this._actual_price;
    }

    get original_price(): number {
        return this._original_price;
    }

    get product_id(){
        return this._product_id;
    }

    get name(){
        return this._name;
    }
    get description(){
        return this._description;
    }
    get category(){
        return this._category;
    }
    get amount(){
        return this._amount;
    }
    get price(){
        return this._actual_price;
    }
    set price(value: number) {
        this._actual_price = value;
    }


    get rating(): number {
        return this._rating;
    }

    set rating(value: number) {
        this._rating = value;
    }
}