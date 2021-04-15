import {PurchaseType} from "../PurchaseProperties/PurchaseType";
import {ShopManagement} from "./ShopManagement";
import {DiscountPolicyHandler} from "../PurchaseProperties/DiscountPolicyHandler";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchasePolicyHandler} from "../PurchaseProperties/PurchasePolicyHandler";
import {Product, ProductImpl} from "../ProductHandling/Product";
import {Order} from "../ProductHandling/Order";
import {ProductNotFound} from "../ProductHandling/ErrorMessages";
import {logger} from "../Logger";
import {CategoryImpl} from "../ProductHandling/Category";
import {ProductPurchase} from "../ProductHandling/ProductPurchase";

export type Filter = { filter_type: Filter_Type; filter_value: string }

export enum Filter_Type {
    BelowPrice,
    AbovePrice,
    Category,
    // Rating
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

export interface ShopInventory {
    shop_id: number
    shop_name: string
    shop_management: ShopManagement
    products: Product[]
    /**
     * @Requirement correctness requirement 5.a 5.b
     */
    purchase_policies: PurchasePolicyHandler | undefined
    discount_policies: DiscountPolicyHandler | undefined
    discount_types: DiscountType[]
    orders: Order[]
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
     * @return true iff the purchase was successful
     */
    purchaseItems(products: ReadonlyArray<ProductPurchase>): boolean | string

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
     * @param discount_type discount type available for the product
     * @param purchase_type purchase purchase type available for the product
     * @return true iff the add was successful
     */
    addItem(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType): boolean | string

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
}

export class ShopInventoryImpl implements ShopInventory {
    private readonly _discount_policies: DiscountPolicyHandler | undefined;
    private readonly _discount_types: DiscountType[];
    private readonly _orders: Order[];
    private readonly _purchase_policies: PurchasePolicyHandler | undefined;
    private readonly _shop_id: number;
    private readonly _bank_info: string;

    constructor(shop_id: number, shop_management: ShopManagement, shop_name: string, bank_info: string) {
        this._shop_id = shop_id;
        this._shop_management = shop_management;
        this._discount_types = [];
        this._products = [];
        this._orders = [];
        this._bank_info = bank_info;
        this._shop_name = shop_name
        /*
        TODO policies
         */
        // this._discount_policies = DiscountPolicyHandler.getInstance();
        // this._purchase_policies = PurchasePolicyHandler.getInstance();
        /*
        End
         */
    }

    private _shop_name: string;

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

    get discount_policies(): DiscountPolicyHandler | undefined {
        return this._discount_policies;
    }

    get discount_types(): DiscountType[] {
        return this._discount_types;
    }

    get orders(): Order[] {
        return this._orders;
    }

    get purchase_policies(): PurchasePolicyHandler | undefined {
        return this._purchase_policies;
    }

    get shop_id(): number {
        return this._shop_id;
    }

    get bank_info(): string {
        return this._bank_info
    }

    addItem(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType): boolean | string {
        const item: Product | string = ProductImpl.create(base_price, description, name, purchase_type);
        if (typeof item === "string") {
            return item
        }
        item.addSupplies(amount)
        categories.forEach(c => {
            const cat = CategoryImpl.create(c)
            if (typeof cat == "string") return cat
            item.addCategory(cat)
        })
        item.addDiscountType(discount_type)
        this._products = this._products.concat([item]);
        return true;
    }

    filter(products: Product[], filters: Filter[]): Product[] {
        const passed_filter = (f: Filter) => (product: Product) => {
            return (f.filter_type == Filter_Type.AbovePrice) ? product.base_price >= Number(f.filter_value) :
                (f.filter_type == Filter_Type.BelowPrice) ? product.base_price <= Number(f.filter_value) :
                    // ((f.filter_type == Filter_Type.Rating) ? true :   // add rating to product
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
        return this._orders.map(order => order.to_string());
    }

    purchaseItems(products: ReadonlyArray<ProductPurchase>): string | boolean {
        products.forEach(p => {
            const product = this.getItem(p.product_id)
            if (typeof product == "string") {
                logger.Error(`Failed to purchase as ${p.product_id} was not found`)
                return `Product ${p.product_id} was not found`
            }
            if (product.amount < 1) {
                logger.Error(`Failed to purchase as ${p.product_id} has an amount lower than 1`)
                return `Product ${p.product_id} has an amount lower than 1`
            }
            if (product.amount < p.amount) {
                logger.Error(`Failed to purchase as ${p.product_id} has ${product.amount} units but requires ${p.amount}`)
                return `Product ${p.product_id} doesn't have enough in stock for this purchase`
            }
        })
        this._products = this._products.map(p => {
            const result = products.find(product_purchase => product_purchase.product_id == p.product_id)
            if (!result) return p
            p.makePurchase(result.amount)
            return p
        })
        return true
    }

    removeItem(item_id: number): boolean {
        if (!this._products.some(p => p.product_id == item_id)) return false;
        this._products = this._products.filter(p => p.product_id != item_id);
        return true;
    }

    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[] {
        return this._products.filter(p => p.amount > 0)
            .filter(p => (name === undefined) ? true : p.name.toLowerCase().includes(name.toLowerCase()))
            .filter(p => (category == undefined) ? true : p.category.some(c => c.name.toLowerCase() === category.toLowerCase()))
            .filter(p => (keyword === undefined) ? true : `${p.description} ${String(p.amount)} ${String(p.product_id)}`
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
}