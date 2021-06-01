import {Category, CategoryImpl} from "./Category";
// import {Purchase_Type} from "../PurchaseProperties/Purchase_Type";
import {
    AmountIsLargerThanStock,
    AmountNonPositiveValue,
    BasePriceNonPositiveValue,
    CategoryNotFound,
    DescriptionEmpty,
    ProductNameEmpty
} from "./ErrorMessages";
import {Purchase_Type} from "../Shop/ShopInventory";
import {Rating} from "./Rating";
import {ProductData} from "../../DataAccess/Getters";


export interface Product {
    readonly product_id: number
    name: string
    description: string
    amount: number // >= 0
    category: Category[]
    price: number // >= 0
    purchase_type: Purchase_Type
    rating: Rating

    /**
     * @Requirement - Quality assurance No. 5a
     * @param purchaseType
     */
    changePurchaseType(purchaseType: Purchase_Type): string | boolean

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
     * @Requirement 2.7
     * @functionality increase amount of supplies of this product account of what the user returned
     * @param amount
     * @return true iff amount > 0
     * @return AmountNonPositiveValue otherwise
     */
    returnAmount(amount: number): string | boolean;

    rate(rating: number, rater: string): void

    alreadyRated(user_email: string): Boolean;
}

export class ProductImpl implements Product {
    static _product_id_specifier: number = 0;
    private readonly _product_id: number;
    private _base_price: number;
    private readonly _category: Category[];

    private constructor(base_price: number, description: string, name: string, product_id: number, purchase_type: Purchase_Type, category: Category[], amount: number, rating: Rating) {
        this._product_id = product_id
        this._base_price = base_price
        this._name = name
        this._description = description
        this._purchase_type = purchase_type
        this._category = category
        this._amount = amount
        this._rating = rating
    }

    private _amount: number;

    get amount() {
        return this._amount;
    }

    private _description: string;

    get description() {
        return this._description;
    }

    private _name: string;

    get name() {
        return this._name;
    }

    private _purchase_type: Purchase_Type;

    get purchase_type() {
        return this._purchase_type;
    }

    set purchase_type(value: Purchase_Type) {
        this._purchase_type = value;
    }

    private _rating = Rating.create();

    get rating(): Rating {
        return this._rating;
    }

    get price() {
        return this._base_price;
    }

    get product_id() {
        return this._product_id;
    }

    get category() {
        return this._category;
    }

    static resetIDs = () => ProductImpl._product_id_specifier = 0

    static createFromDB(product: ProductData) {
        return new ProductImpl(
            product.data.base_price,
            product.data.description,
            product.data.name,
            product.data.product_id,
            product.data.purchase_type,
            product.data.categories.split(",").map(category => CategoryImpl.create(category) as CategoryImpl),
            product.data.amount,
            Rating.createFromDB(product.rates)
        )
    }

    public static create(base_price: number, description: string, name: string, purchase_type?: Purchase_Type): Product | string {
        const result = ProductImpl.isValid(base_price, description, name);
        if (typeof result === "string") {
            return result;
        }
        const id: number = this._product_id_specifier++;
        return ProductImpl.createSupporter(base_price, description, name, id, purchase_type);
    }

    static productsAreEqual(p1: Product[], p2: Product[]) {
        return p1.length == p2.length && p1.every(p1 => p2.some(p2 => JSON.stringify(p1) == JSON.stringify(p2)))
    }

    private static createSupporter(base_price: number, description: string, name: string, product_id: number, purchase_type?: Purchase_Type) {
        let _base_price = base_price;
        let _description = description;
        let _name = name;
        let _product_id = product_id;
        let _purchase_type = purchase_type ? purchase_type : Purchase_Type.Immediate;
        let _category = [];
        let _amount = 0;
        return new ProductImpl(_base_price, _description, _name, _product_id, _purchase_type, _category, _amount, Rating.create())
    }

    private static isValid(base_price: number, description: string, name: string): string | boolean {
        if (base_price <= 0) {
            return BasePriceNonPositiveValue;
        } else if (description.length == 0) {
            return DescriptionEmpty;
        } else if (name.length == 0) {
            return ProductNameEmpty;
        } else return true;
    }

    public addSupplies(amount: number): string | boolean {
        if (amount <= 0) {
            return AmountNonPositiveValue;
        }
        this._amount += amount;
        return true;
    }

    public makePurchase(amount: number): string | boolean {
        if (amount <= 0) {
            return AmountNonPositiveValue;
        }
        if (amount > this._amount) {
            return AmountIsLargerThanStock
        }
        this._amount -= amount;
        return true;
    }

    public changePrice(base_price: number): string | boolean {
        if (base_price <= 0) {
            return BasePriceNonPositiveValue
        }
        this._base_price = base_price;
        return true;
    }

    public addCategory(category: Category): string | boolean {
        this._category.push(category);
        return true;
    }

    public removeCategory(toRemove: Category): string | boolean {
        let position = -1;
        this._category.forEach((category: Category, index: number) => {
            if (category.equals(toRemove))
                position = index
        });
        if (position < 0) {
            return CategoryNotFound
        }
        this._category.splice(position, 1);
        return true;
    }

    public changeDescription(description: string): string | boolean {
        if (description.length == 0) {
            return DescriptionEmpty
        }
        this._description = description;
        return true;
    }

    public changeName(name: string): string | boolean {
        if (name.length == 0) {
            return ProductNameEmpty
        }
        this._name = name;
        return true;
    }

    public changePurchaseType(purchaseType: Purchase_Type): string | boolean {
        this._purchase_type = purchaseType;
        return true;
    }

    public returnAmount(amount: number): string | boolean {
        if (amount <= 0) {
            return AmountNonPositiveValue
        }
        this._amount += amount;
        return true;
    }

    rate(rating: number, rater: string): void {
        if (0 <= rating && rating <= 5) this.rating.add_rating(rating, rater)
    }

    public toString() {
        return JSON.stringify(this)

    }

    alreadyRated(user_email: string): Boolean {
        return this.rating.raters_email.some(past_rater => past_rater == user_email)
    }
}