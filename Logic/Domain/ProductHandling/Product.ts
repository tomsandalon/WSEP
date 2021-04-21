import {Category} from "./Category";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchaseType} from "../PurchaseProperties/PurchaseType";
import {
    AmountIsLargerThanStock,
    AmountNonPositiveValue,
    BasePriceNonPositiveValue, CategoryNotFound,
    DescriptionEmpty,
    DiscountExists,
    DiscountNotExists,
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

    /**
     * @Requirement - Quality assurance No. 5a
     * @param purchaseType
     */
    changePurchaseType(purchaseType: PurchaseType): string | boolean

    /**
     * @Requirement 2.7
     * @param quantity
     * @functionality Reduce amount of supplies of this product
     * @return true iff 0 < quantity <= this.amount
     * @return AmountNonPositiveValue otherwise
     */
    makePurchase(quantity: number): string | boolean

    /**
     * @Requirement 4.1
     * @param name
     * @return true iff 0 < name.length
     * @return ProductNameEmpty otherwise
     */
    changeName(name: string): string | boolean

    /**
     * @Requirement 4.1
     * @param category
     * @return true
     */
    addCategory(category: Category): string | boolean

    /**
     * @Requirement 4.1
     * @param category
     * @return true iff this.categories.contains(category) == true
     * @return CategoryNotFound otherwise
     */
    removeCategory(category: Category): string | boolean

    /**
     * @Requirement 4.1
     * @param base_price
     * @return true iff 0 < base_price
     * @return BasePriceNonPositiveValue otherwise
     */
    changePrice(base_price: number): string | boolean

    /**
     * @Requirement - Quality assurance No. 5b
     * @param discountType
     */
    addDiscountType(discountType: DiscountType): string | boolean

    /**
     * @Requirement 4.1
     * @param description
     * @return true iff 0 < description.len
     * @return DescriptionEmpty otherwise
     */
    changeDescription(description: string): string | boolean

    /**
     * @Requirement 4.1
     * @param amount
     * @return true iff 0 < amount
     * @return AmountNonPositiveValue otherwise
     */
    addSupplies(amount: number): string | boolean

    /**
     *
     * @param coupons
     * @return actual_price considering all discounts applied on this product and coupons that the customer applied
     * @return DiscountNotExists iff the customer entered a coupon that can't be applied on this product
     */
    calculatePrice(coupons: DiscountType[]): number | string

    /**
     * @Requirement - 4.1 and Quality assurance No. 5b
     * @param discountType
     * @return true iff this.discount_types.contains(discountType)
     * @return DiscountNotExists otherwise
     */
    removeDiscountType(discountType: DiscountType): string | boolean

    /**
     * @Requirement 2.7
     * @functionality increase amount of supplies of this product account of what the user returned
     * @param amount
     * @return true iff amount > 0
     * @return AmountNonPositiveValue otherwise
     */
    returnAmount(amount: number): string | boolean;
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

    static resetIDs = () => ProductImpl._product_id_specifier = 0


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
        if(amount > this._amount){
            return AmountIsLargerThanStock
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
    public removeCategory(toRemove: Category): string | boolean{
        let position = -1;
        this._category.forEach((category: Category, index: number) =>{
            if(category.equals(toRemove))
                position = index
        });
        if (position < 0){
            return CategoryNotFound
        }
        this._category.splice(position,1);
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

    public returnAmount(amount: number): string | boolean {
        if (amount <= 0){
            return AmountNonPositiveValue
        }
        this._amount += amount;
        return true;
    }

    public toString(){
        return `Product id: ${this._product_id}\tName: ${this._name}\tAvailableAmount: ${this._amount}\tBase price: ${this._base_price}\nCategories:\n${this.category.reduce((acc, category) => acc + category.name + "\n", "")}`
    }
}