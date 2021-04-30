import {Category} from "./Category";
import {Product} from "./Product";
import {DiscountType} from "../PurchaseProperties/DiscountType";

export interface ProductPurchase {
    readonly product_id: number,
    readonly name: string,
    readonly description: string,
    readonly categories: ReadonlyArray<Category>
    readonly amount: number,
    readonly actual_price: number,
}

export class ProductPurchaseImpl implements ProductPurchase{
    private readonly _actual_price: number;
    private readonly _amount: number;
    private readonly _categories: ReadonlyArray<Category>;
    private readonly _description: string;
    private readonly _name: string;
    private readonly _product_id: number;
    private constructor(product: Product, actual_price: number, amount: number) {
        this._product_id = product.product_id;
        this._name = product.name;
        this._description = product.description;
        this._amount = amount;
        this._categories = product.category;
        this._actual_price = actual_price;
    }

    public static create(product: Product, coupons: DiscountType[], amount: number): ProductPurchase | string{
        const final_price = product.calculatePrice(coupons);
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
    get categories(){
        return this._categories;
    }
    get amount(){
        return this._amount;
    }
    get actual_price(){
        return this._actual_price;
    }
}