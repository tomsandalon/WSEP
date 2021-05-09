import {Category} from "./Category";
import {Product} from "./Product";
import {ShopInventory} from "../Shop/ShopInventory";

export interface ProductPurchase {
    readonly product_id: number,
    readonly name: string,
    readonly description: string,
    readonly category: ReadonlyArray<Category>
    readonly amount: number,
    readonly price: number,
}

export class ProductPurchaseImpl implements ProductPurchase{
    private _actual_price: number;
    private readonly _amount: number;
    private readonly _category: ReadonlyArray<Category>;
    private readonly _description: string;
    private readonly _name: string;
    private readonly _product_id: number;
    private constructor(product: Product, actual_price: number, amount: number) {
        this._product_id = product.product_id;
        this._name = product.name;
        this._description = product.description;
        this._amount = amount;
        this._category = product.category;
        this._actual_price = actual_price;
    }
    public static create(product: Product, coupons: any[], amount: number, shop: ShopInventory): ProductPurchase | string{
        const final_price = shop.calculatePrice([product], {userId: -1, underaged: false});
        if(typeof final_price === "string"){
            return final_price
        }
        return new ProductPurchaseImpl(product, final_price, amount)
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
}