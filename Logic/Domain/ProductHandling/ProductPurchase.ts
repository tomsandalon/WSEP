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


    private constructor(product_id: number, name: string, description: string, amount: number, category: ReadonlyArray<Category>, original_price: number, actual_price: number) {
        this._product_id = product_id;
        this._name = name;
        this._description = description;
        this._amount = amount;
        this._category = category;
        this._original_price = original_price
        this._actual_price = actual_price;
    }

    private static createSupporterFunction(product: Product, original_price: number, amount: number, actual_price: number) {
        let product_id = product.product_id;
        let name = product.name;
        let description = product.description;
        let category = product.category;
        return new ProductPurchaseImpl(product_id, name, description, amount, category, original_price, actual_price)
    }

    public static create(product: Product, coupons: any[], amount: number, shop: ShopInventory, actual_price?: number): ProductPurchase | string{
        const ret = ProductPurchaseImpl.createSupporterFunction(product, product.price, amount, 0)
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