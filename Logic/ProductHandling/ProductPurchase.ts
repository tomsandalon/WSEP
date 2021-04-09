import {Category} from "./Category";
import {Product} from "./Product";

export interface ProductPurchase {
    readonly product_id: number,
    readonly name: string,
    readonly description: string,
    readonly categories: ReadonlyArray<Category>
    readonly amount: number,
    readonly actual_price: number,
}

class ProductPurchaseImpl implements ProductPurchase{
    private _actual_price: number;
    private _amount: number;
    private readonly _categories: ReadonlyArray<Category>;
    private readonly _description: string;
    private readonly _name: string;
    private readonly _product_id: number;
    constructor(product: Product, discount: any) { //TODO discount any??
        this._product_id = product.product_id;
        this._name = product.name;
        this._description = product.description;
        this._amount = product.amount;
        // this.categories =
        // this._actual_price = product.calculatePrice();
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