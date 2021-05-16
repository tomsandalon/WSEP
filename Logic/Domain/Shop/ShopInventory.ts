// import {PurchaseType} from "../PurchaseProperties/PurchaseType";
import {ShopManagement} from "./ShopManagement";
import {Product, ProductImpl} from "../ProductHandling/Product";
import {Purchase} from "../ProductHandling/Purchase";
import {ProductNotFound} from "../ProductHandling/ErrorMessages";
import {logger} from "../Logger";
import {CategoryImpl} from "../ProductHandling/Category";
import {ProductPurchase} from "../ProductHandling/ProductPurchase";
import {UserPurchaseHistory, UserPurchaseHistoryImpl} from "../Users/UserPurchaseHistory";
import {PurchaseCondition, PurchaseEvalData} from "./PurchasePolicy/PurchaseCondition";
import {MinimalUserData} from "../ProductHandling/ShoppingBasket";
import {DiscountHandler} from "./DiscountPolicy/DiscountHandler";
import {Discount} from "./DiscountPolicy/Discount";
import {CompositeCondition, Operator} from "./PurchasePolicy/CompositeCondition";
import {NumericOperation} from "./DiscountPolicy/NumericCompositionDiscount";
import {Condition} from "./DiscountPolicy/ConditionalDiscount";
import {LogicComposition} from "./DiscountPolicy/LogicCompositionDiscount";

export type Filter = { filter_type: Filter_Type; filter_value: string }
export enum Filter_Type {
    BelowPrice,
    AbovePrice,
    Category,
    Rating
}

export enum Item_Action {
    AddAmount,
    ChangeName,
    AddCategory,
    RemoveCategory,
    ChangePrice,
    ChangeDescription,
    //add policies
}

export enum Purchase_Type {
    Immediate,
}

export interface ShopInventory {
    shop_id: number
    shop_name: string
    shop_management: ShopManagement
    products: Product[]
    /**
     * @Requirement correctness requirement 5.a 5.b
     */
    purchase_policies: PurchaseCondition[]
    discount_policies: DiscountHandler
    purchase_types: Purchase_Type[]
    purchase_history: UserPurchaseHistory
    bank_info: string

    /**
     * @Requirement 2.5
     * @return product list of the items currently sold in the store
     */
    getAllItems(): Product[]

    /**
     * @Requirement 2.6
     * @param name Product name
     * @param category Product category
     * @param keyword keyword to search by
     * @return product list of products list in the shop which match the search parameters
     */
    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[]

    /**
     * @Requirement 2.9
     * @param products The products to purchase (reduce their amount)
     * @param minimal_user_data The minimal user data required to evaluate the purchase
     * @return true iff the purchase was successful
     */
    purchaseItems(products: ReadonlyArray<ProductPurchase>, minimal_user_data: MinimalUserData): boolean | string

    /**
     * @param products
     */
    returnItems(products: ReadonlyArray<ProductPurchase>): void

    /**
     * @Requirement 4.1
     * @param name name of the product
     * @param description description of the product
     * @param amount amount available for selling
     * @param categories categories of the product
     * @param base_price base price for the product
     * @param purchase_type purchase purchase type available for the product
     * @return true iff the add was successful
     */
    addItem(name: string, description: string, amount: number, categories: string[], base_price: number, purchase_type?: Purchase_Type): boolean | string

    /**
     * @Requirement 4.1
     * @param item_id product id of the item
     * @return true iff the removal was successful
     */
    removeItem(item_id: number): boolean

    /**
     * @Requirement 4.11
     * @return a string list representation of the shop purchase history
     */
    getShopHistory(): string[]

    /**
     * @Requirement 2.6
     * @param products Product list to filter from
     * @param filters comprised of @filter_name and @filter_value
     * @filter-param filter_name type of filter
     * @filter-param filter_value the value of the filter
     * @return the products from @param products which match the filter
     */
    filter(products: Product[], filters: Filter[]): Product[];

    /**
     * @param product_id product id of the requested product
     * @return the product with a matching product id, or a string representing an error
     */
    getItem(product_id: number): Product | string

    /**
     * @param product_id the product to edit
     * @param action the action to perform
     * @param value the value of the action
     * @return true if the action was successful, or a string representing an error
     */
    editItem(product_id: number, action: Item_Action, value: string): string | boolean;

    /**
     * @param order the order to log in the shop order history
     */
    logOrder(order: Purchase): void

    /**
     * @param discount the discount to add
     */
    addDiscount(discount: Discount): void

    removeDiscount(id: number): string | boolean

    getAllDiscounts(): string

    getAllPurchasePolicies(): string

    addPurchasePolicy(condition: PurchaseCondition): void

    removePurchasePolicy(id: number): boolean | string

    composePurchasePolicies(id1: number, id2: number, operator: Operator): boolean | string

    calculatePrice(products: ReadonlyArray<ProductPurchase>, user_data: MinimalUserData): number

    displayItems(): string

    addConditionToDiscount(discount_id: number, condition: Condition, condition_param: string): string | boolean;

    addNumericCompositionDiscount(operation: NumericOperation, d_id1: number, d_id2: number): boolean | string;

    addLogicCompositionDiscount(operation: LogicComposition, d_id1: number, d_id2: number): boolean | string;

    notifyOwners(order: Purchase): void;

    rateProduct(product_id: number, rating: number): void;
}

export class ShopInventoryImpl implements ShopInventory {
    private readonly _discount_policies: DiscountHandler;
    private _purchase_policies: PurchaseCondition[];

    private readonly _purchase_types: Purchase_Type[]


    private readonly _shop_id: number;
    private readonly _bank_info: string;
    private _purchase_history: UserPurchaseHistory;
    get discount_policies(): DiscountHandler {
        return this._discount_policies;
    }
    get purchase_policies(): PurchaseCondition[] {
        return this._purchase_policies;
    }
    constructor(shop_id: number, shop_management: ShopManagement, shop_name: string, bank_info: string) {
        this._shop_id = shop_id;
        this._shop_management = shop_management;
        this._purchase_types = [Purchase_Type.Immediate];
        this._products = [];
        this._bank_info = bank_info;
        this._shop_name = shop_name;
        this._purchase_history = UserPurchaseHistoryImpl.getInstance();
        this._discount_policies = new DiscountHandler();
        this._purchase_policies = Array<PurchaseCondition>();
    }


    private readonly _shop_name: string;

    get purchase_history(): UserPurchaseHistory {
        return this._purchase_history;
    }

    get shop_name(): string {
        return this._shop_name;
    }

    private _products: Product[];

    get products(): Product[] {
        return this._products;
    }

    private _shop_management: ShopManagement;

    get shop_management(): ShopManagement {
        return this._shop_management;
    }

    set shop_management(value: ShopManagement) {
        this._shop_management = value;
    }

    get purchase_types(): Purchase_Type[] {
        return this._purchase_types;
    }

    get shop_id(): number {
        return this._shop_id;
    }

    get bank_info(): string {
        return this._bank_info
    }

    addItem(name: string, description: string, amount: number, categories: string[], base_price: number, purchase_type?: Purchase_Type): boolean | string {
        const item: Product | string = ProductImpl.create(base_price, description, name, purchase_type);
        if (typeof item === "string") {
            return item
        }
        let result = item.addSupplies(amount)
        if (typeof result == "string") {
            logger.Error(result)
            return result
        }
        categories.forEach(c => {
            const cat = CategoryImpl.create(c)
            if (typeof cat == "string") return result
            item.addCategory(cat)
        })
        if (typeof result == "string") {
            logger.Error(result)
            return result
        }
        // item.addDiscountType(discount_type) //TODO
        this._products = this._products.concat([item]);
        return true;
    }

    filter(products: Product[], filters: Filter[]): Product[] {
        if (filters.length == 0) return products
        const passed_filter = (f: Filter) => (product: Product) => {
            return (f.filter_type == Filter_Type.AbovePrice) ? product.price >= Number(f.filter_value) :
                (f.filter_type == Filter_Type.BelowPrice) ? product.price <= Number(f.filter_value) :
                    (f.filter_type == Filter_Type.Rating) ? product.rating.get_rating() == Number(f.filter_value) :
                    (f.filter_type == Filter_Type.Category) ? product.category.some(c => c.name == f.filter_value) :
                        //can add more
                        false;
        }
        return (filters.length == 0) ? products :
            this.filter(products.filter(passed_filter(filters[0])), filters.slice(1));
    }

    getAllItems(): Product[] {
        return this.products.filter(p => p.amount > 0);
    }

    getShopHistory(): string[] {
        const result = this._purchase_history.getShopPurchases(this.shop_id);
        if (typeof result == "string") {
            logger.Error(`${this.shop_id} doesn't exist in the shop history manager. Error`);
            return [];
        }
        return result.map(p => p.toString());
    }

    private evaluatePurchaseItem(products: ReadonlyArray<ProductPurchase>, minimal_user_data: MinimalUserData): string | boolean {
        const purchase_data: PurchaseEvalData = {basket: products, underaged: minimal_user_data.underaged}
        if (!this._purchase_policies.every(policy => policy.evaluate(purchase_data))) {
            logger.Error(`Failed to purchase as the purchase policy doesn't permit it`)
            return `Purchase policy doesn't allow this purchase`
        }
        return true
    }

    purchaseItems(products: ReadonlyArray<ProductPurchase>, minimal_user_data: MinimalUserData): string | boolean {
        let result = this.evaluatePurchaseItem(products, minimal_user_data)
        if (typeof result == "string") return result
        products.forEach(p => {
            const product = this.getItem(p.product_id)
            if (typeof product == "string") {
                logger.Error(`Failed to purchase as ${p.product_id} was not found`)
                result = `Product ${p.product_id} was not found`
            }
            else if (product.amount < 1) {
                logger.Error(`Failed to purchase as ${p.product_id} has an amount lower than 1`)
                result = `Product ${p.product_id} has an amount lower than 1`
            }
            else if (product.amount < p.amount) {
                logger.Error(`Failed to purchase as ${p.product_id} has ${product.amount} units but requires ${p.amount}`)
                result = `Product ${p.product_id} doesn't have enough in stock for this purchase`
            }
        })
        if (typeof result == "string") return result
        this._products = this._products.map(p => {
            const result = products.find(product_purchase => product_purchase.product_id == p.product_id)
            if (!result) return p
            p.makePurchase(result.amount)
            return p
        })
        return result
    }

    removeItem(item_id: number): boolean {
        if (!this._products.some(p => p.product_id == item_id)) return false;
        this._products = this._products.filter(p => p.product_id != item_id);
        return true;
    }

    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[] {
        return this._products.filter(p => p.amount > 0)
            .filter(p => (name === undefined || name == "") ? true : p.name.toLowerCase().includes(name.toLowerCase()))
            .filter(p => (category == undefined || category == "") ? true : p.category.some(c => c.name.toLowerCase() === category.toLowerCase()))
            .filter(p => (keyword === undefined || keyword == "") ? true : `${p.description} ${String(p.amount)} ${String(p.product_id)}`
                .toLowerCase().includes(keyword.toLowerCase()))
            ;
    }

    getItem(product_id: number): Product | string {
        const result = this._products.find((product: Product) => product.product_id == product_id);
        if (!result) {
            logger.Error(`Product id ${product_id} search for but doesn't exist`)
            return ProductNotFound;
        }
        logger.Info(`Product id ${product_id} was search for and found ${result.name}`)
        return result;
    }

    editItem(product_id: number, action: Item_Action, value: string): string | boolean {
        const result = this.getItem(product_id)
        if (typeof result === "string") {
            return result
        }
        if ((action == Item_Action.AddAmount || action == Item_Action.ChangePrice) && (isNaN(Number(value)))) {
            return `Cannot edit Item ${product_id}. ${value} is not a number`
        }

        const category = CategoryImpl.create(String(value))
        return (action == Item_Action.AddAmount) ? result.addSupplies(Number(value)) :
            (action == Item_Action.ChangeDescription) ? result.changeDescription(String(value)) :
                (action == Item_Action.ChangeName) ? result.changeName(String(value)) :
                    (action == Item_Action.ChangePrice) ? result.changePrice(Number(value)) :
                        (typeof category === "string") ? category :
                            (action == Item_Action.AddCategory) ? result.addCategory(category) :
                                (action == Item_Action.RemoveCategory) ? result.removeCategory(category) : "Should not get here";
    }

    returnItems(products: ReadonlyArray<ProductPurchase>): void {
        this._products = this._products.map(p => {
            const result = products.find(product_purchase => product_purchase.product_id == p.product_id)
            if (!result) return p
            p.returnAmount(result.amount)
            return p
        })
    }

    displayItems(): string{
        return JSON.stringify(
            this.products.filter(p => p.amount > 0).map(p => p.toString()),
        )
    }

    toString(): string {
        return JSON.stringify({
            shop_id: this.shop_id,
            purchase_types: this.purchase_types,
            products: this.products.filter(p => p.amount > 0).map(p => p.toString()),
            // bank_info: this._bank_info,
            shop_name: this.shop_name,
            purchase_history: this._purchase_history.toString(),
            discount_policies: this.discount_policies,
            purchase_policies: this.purchase_policies
        })
        // this._shop_id = shop_id;
        // this._shop_management = shop_management;
        // this._discount_types = [];
        // this._purchase_types = [Purchase_Type.Immediate];
        // this._products = [];
        // this._bank_info = bank_info;
        // this._shop_name = shop_name;
        // this._purchase_history = UserPurchaseHistoryImpl.getInstance();
        // this._discount_policies = new DiscountHandler();
        // this._purchase_policies = Array<PurchaseCondition>();
        //
        // return JSON.stringify(this.products.filter(p => p.amount > 0).map(p => p.toString()))
        // return this.products.reduce(function(acc, cur) {
        //     return acc.concat(cur.amount != 0 ? cur.toString().concat("\n") : "")}, "")
    }

    logOrder(order: Purchase): void {
        //still maintained in order to support further logic expansion.
        //for now, it shall stay unimplemented
        return
    }

    calculatePrice(products: ReadonlyArray<ProductPurchase>, user_data: MinimalUserData): number {
        return this.discount_policies.calculatePrice(products, user_data)
    }

    addDiscount(discount: Discount): void {
        this.discount_policies.addDiscount(discount);
    }

    removeDiscount(id: number): string | boolean {
        if (this._discount_policies.removeDiscount(id)) {
            logger.Info(`Discount ${id} removed`)
            return true
        }
        logger.Error(`Discount ${id} doesn't exist`)
        return `Discount ${id} doesn't exist`
    }

    getAllDiscounts(): string {
        return this.discount_policies.toString();
    }

    getAllPurchasePolicies(): string {
        return JSON.stringify(
            this.purchase_policies.map(p => p.toString())
        );
    }

    addPurchasePolicy(condition: PurchaseCondition): void {
        this._purchase_policies = this.purchase_policies.concat([condition])
    }

    removePurchasePolicy(id: number): boolean {
        const length = this._purchase_policies.length
        this._purchase_policies = this._purchase_policies.filter(p => p.id != id);
        return length != this._purchase_policies.length
    }

    composePurchasePolicies(id1: number, id2: number, operator: Operator): boolean | string {
        if (this._purchase_policies.every(p => p.id != id1) ||
            this._purchase_policies.every(p => p.id != id2)) {
            logger.Error(`Policies not found`)
            return "Policies not found"
        }
        const new_policy = new CompositeCondition([
            this._purchase_policies.find(p => p.id == id1) as PurchaseCondition,
            this._purchase_policies.find(p => p.id == id2) as PurchaseCondition
        ], operator)
        this._purchase_policies = this._purchase_policies.filter(p => p.id == id1 || p.id == id2)
        this._purchase_policies = this._purchase_policies.concat([new_policy])
        return true
    }

    //temp

    // public addDiscountType(discountType: DiscountType): string | boolean{
    //     if (this._discount_types.indexOf(discountType) < 0) {
    //         return DiscountExists
    //     }
    //     this._discount_types.push(discountType);
    //     return true;
    // }
    // public removeDiscountType(discountType: DiscountType): string | boolean{
    //     if (this._discount_types.indexOf(discountType) < 0){
    //         return DiscountNotExists
    //     }
    //     this._discount_types.splice(this._discount_types.indexOf(discountType), 1);
    //     return true;
    // }
    //
    // /**
    //  * @Requirement - 4.1 and Quality assurance No. 5b
    //  * @param discountType
    //  * @return true iff this.discount_types.contains(discountType)
    //  * @return DiscountNotExists otherwise
    //  */
    // removeDiscountType(discountType: DiscountType): string | boolean
    //
    //
    // /**
    //  * @Requirement - Quality assurance No. 5b
    //  * @param discountType
    //  */
    // addDiscountType(discountType: DiscountType): string | boolean

    addConditionToDiscount(discount_id: number, condition: Condition, condition_param: string) {
        const result = this.discount_policies.addConditionToDiscount(discount_id, condition, condition_param)
        if (!result) {
            logger.Error(`Discount ${discount_id} not found`)
            return false;
        }
        return true;
    }

    addNumericCompositionDiscount(operation: NumericOperation, d_id1: number, d_id2: number): boolean | string {
        const result = this.discount_policies.addNumericCompositionDiscount(operation, d_id1, d_id2)
        if (!result) {
            logger.Error(`Discounts not found`)
            return false;
        }
        return true;
    }

    addLogicCompositionDiscount(operation: LogicComposition, d_id1: number, d_id2: number): boolean | string {
        const result = this.discount_policies.addLogicCompositionDiscount(operation, d_id1, d_id2)
        if (!result) {
            logger.Error(`Discounts not found`)
            return false;
        }
        return true;
    }

    notifyOwners(order: Purchase): void {
        this._shop_management.notifyOwners(`New successful order:\n` +
        `Order number: ${order.order_id}\n` +
        `Items: ${order.products.reduce(
            (acc, cur) => acc + "\n" + cur.name, ""
        )}`)
    }

    rateProduct(product_id: number, rating: number): void {
        const product = this._products.find(p => product_id == p.product_id)
        if (product == undefined) return
        product.rate(rating)
    }

}