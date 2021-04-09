import {Category} from "./Category";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchaseType} from "../PurchaseProperties/PurchaseType";

export interface Product {
    readonly product_id: number
    name: string
    description: string
    amount: number // >= 0
    category: Category[]
    base_price: number // >= 0
    discount_type: DiscountType
    purchase_type: PurchaseType
    changePurchaseType(purchaseType: PurchaseType): string | boolean
    makePurchase(quantity: number): string | boolean
    changeName(name: string): string | boolean
    addCategory(category: Category): string | boolean
    removeCategory(): string | boolean
    changePrice(base_price: number): string | boolean
    changeDiscountType(discountType: DiscountType): string | boolean
    changeDescription(description: string): string | boolean
}

export class ProductImpl implements Product{
    private static _product_id_specifier: number;
    private readonly _product_id: number;
    private _amount: number;
    private _base_price: number;
    private readonly _category: Category[];
    private _description: string;
    private _discount_type: DiscountType;
    private _name: string;
    private _purchase_type: PurchaseType;
    private constructor(base_price: number, description: string, name: string, product_id: number, purchase_type: PurchaseType) {
        this._base_price = base_price;
        this._description = description;
        this._name = name;
        this._product_id = product_id;
        this._purchase_type = purchase_type;
        this._discount_type = null;
        this._category = [];
    }

    public static createProduct(base_price: number, description: string, name: string, purchase_type: PurchaseType): Product {
        const id: number = this._product_id_specifier++;
        return new ProductImpl(base_price, description, name, id, purchase_type);
    }

    get amount(){
        return this._amount;
    }
    public makePurchase(quantity: number): string | boolean{
        this._amount - quantity;
        return true;
    }
    get base_price(){
        return this._base_price;
    }
    public changePrice(base_price: number): string | boolean{
        this._base_price = base_price;
        return true;
    }
    get product_id(){
        return this._product_id;
    }
    get category(){
        return this._category;
    }
    public addCategory(category: Category): string | boolean{
        this._category.push(category);
        return true;
    }
    public removeCategory(): string | boolean{
        //TODO
        return true;
    }
    get discount_type(){
        return this._discount_type;
    }
    public changeDiscountType(discountType: DiscountType): string | boolean{
        //TODO discount type.change product
        this._discount_type = discountType;
        return true;
    }
    get description(){
        return this._description;
    }
    public changeDescription(description: string): string | boolean{
        this._description = description;
        return true;
    }
    get name(){
        return this._name;
    }
    public changeName(name: string): string | boolean{
        this._name = name;
        return true;
    }
    get purchase_type(){
        return this._purchase_type;
    }
    public changePurchaseType(purchaseType: PurchaseType): string | boolean{
        //TODO purchasetype.change
        this._purchase_type = purchaseType;
        return true;
    }
}