import {Category} from "./Category";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchaseType} from "../PurchaseProperties/PurchaseType";
import {
    AmountNonPositiveValue,
    BasePriceNonPositiveValue,
    DescriptionEmpty, DiscountExists, DiscountNotExists,
    ProductNameEmpty
} from "./ErrorMessages";

export interface Product {
    readonly product_id: number
    name: string
    description: string
    amount: number // >= 0
    category: Category[]
    base_price: number // >= 0
    discount_types: DiscountType[]
    purchase_type: PurchaseType
    changePurchaseType(purchaseType: PurchaseType): string | boolean
    makePurchase(quantity: number): string | boolean
    changeName(name: string): string | boolean
    addCategory(category: Category): string | boolean
    removeCategory(category: Category): string | boolean
    changePrice(base_price: number): string | boolean
    addDiscountType(discountType: DiscountType): string | boolean
    changeDescription(description: string): string | boolean
    addSupplies(amount: number): string | boolean
    calculatePrice(coupons: DiscountType[]): number | string
    removeDiscountType(discountType: DiscountType): string | boolean
    returnAmount(difference: number): string | boolean;
}

export class ProductImpl implements Product{
    private static _product_id_specifier: number = 0;
    private readonly _product_id: number;
    private _amount: number;
    private _base_price: number;
    private readonly _category: Category[];
    private _description: string;
    private _discount_types: DiscountType[];
    private _name: string;
    private _purchase_type: PurchaseType;
    private constructor(base_price: number, description: string, name: string, product_id: number, purchase_type: PurchaseType) {
        this._base_price = base_price;
        this._description = description;
        this._name = name;
        this._product_id = product_id;
        this._purchase_type = purchase_type;
        this._discount_types = [];
        this._category = [];
        this._amount = 0;
    }

    public static create(base_price: number, description: string, name: string, purchase_type: PurchaseType): Product | string {
        const result = ProductImpl.isValid(base_price, description, name);
        if(typeof result === "string"){
            return result;
        }
        const id: number = this._product_id_specifier++;
        return new ProductImpl(base_price, description, name, id, purchase_type);
    }

    private static isValid(base_price: number, description: string, name: string): string | boolean{
        if (base_price <= 0){
            return BasePriceNonPositiveValue;
        } else if (description.length == 0){
            return DescriptionEmpty;
        } else if (name.length == 0) {
            return ProductNameEmpty;
        } else return true;
    }

    get amount(){
        return this._amount;
    }
    public addSupplies(amount: number): string | boolean{
        if(amount <= 0) {
            return AmountNonPositiveValue;
        }
        this._amount += amount;
        return true;
    }
    public makePurchase(amount: number): string | boolean{
        if(amount <= 0){
            return AmountNonPositiveValue;
        }
        this._amount -= amount;
        return true;
    }
    get base_price(){
        return this._base_price;
    }
    public changePrice(base_price: number): string | boolean{
        if(base_price <= 0){
            return BasePriceNonPositiveValue
        }
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
    public removeCategory(category: Category): string | boolean{
        this._category.splice(this._category.indexOf(category),1);
        return true;
    }
    get discount_types(){
        return this._discount_types;
    }
    public addDiscountType(discountType: DiscountType): string | boolean{
        if (this._discount_types.indexOf(discountType) < 0) {
            return DiscountExists
        }
        this._discount_types.push(discountType);
        return true;
    }
    public removeDiscountType(discountType: DiscountType): string | boolean{
        if (this._discount_types.indexOf(discountType) < 0){
            return DiscountNotExists
        }
        this._discount_types.splice(this._discount_types.indexOf(discountType), 1);
        return true;
    }
    get description(){
        return this._description;
    }
    public changeDescription(description: string): string | boolean{
        if (description.length == 0){
            return DescriptionEmpty
        }
        this._description = description;
        return true;
    }
    get name(){
        return this._name;
    }
    public changeName(name: string): string | boolean{
        if(name.length == 0){
            return ProductNameEmpty
        }
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
    public calculatePrice(coupons: DiscountType[]): number | string{
        let price = this._base_price;
        let privateDiscounts: number[] = [];
        for (let coupon of coupons){
            const position = this._discount_types.indexOf(coupon);
            if( position < 0){
                return DiscountNotExists
            }
            privateDiscounts.push(position);
            price = coupon.applyDiscount(price);
        }
        this._discount_types.forEach((discount: DiscountType, index: number) => {
                if(privateDiscounts.indexOf(index) < 0){
                    price = discount.applyDiscount(price)
                }
        });
        return price
    }

    returnAmount(amount: number): string | boolean {
        if (amount <= 0){
            return AmountNonPositiveValue
        }
        this._amount += amount;
        return true;
    }
}