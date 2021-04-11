import {PurchaseType} from "../PurchaseProperties/PurchaseType";
import {ShopManagement} from "./ShopManagement";
import {DiscountPolicyHandler} from "../PurchaseProperties/DiscountPolicyHandler";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchasePolicyHandler} from "../PurchaseProperties/PurchasePolicyHandler";
import {Product, ProductImpl} from "../ProductHandling/Product";
import {Order} from "../ProductHandling/Order";
import {ProductNotFound} from "../ProductHandling/ErrorMessages";

export interface ShopInventory {
    shop_id: number
    shop_management: ShopManagement
    products: Product[]
    /**
     * @Requirement correctness requirement 5.a 5.b
     */
    purchase_policies: PurchasePolicyHandler
    discount_policies: DiscountPolicyHandler
    discount_types: DiscountType[]
    orders: Order[]

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
     * @return true iff the purchase was successful
     */
    purchaseItems(): boolean

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
    filter(products: Product[], filters: { filter_name: string; filter_value: string }[]): Product[];

    /**
     *
     * @param product_id
     * TODO
     */
    getItem(product_id: number): Product | string
}

export class ShopInventoryImpl implements ShopInventory {
    private readonly _discount_policies: DiscountPolicyHandler;
    private readonly _discount_types: DiscountType[];
    private readonly _orders: Order[];
    private _products: Product[];
    private readonly _purchase_policies: PurchasePolicyHandler;
    private readonly _shop_id: number;
    private _shop_management: ShopManagement;

    constructor(shop_id: number, shop_management?: ShopManagement) {
        this._shop_id = shop_id;
        this._shop_management = shop_management;
        this._discount_policies = undefined;
        this._discount_types = [];
        this._products = [];
        this._orders = [];
        this._purchase_policies = [];
    }

    set shop_management(value: ShopManagement) {
        this._shop_management = value;
    }

    get discount_policies(): DiscountPolicyHandler {
        return this._discount_policies;
    }

    get discount_types(): DiscountType[] {
        return this._discount_types;
    }

    get orders(): Order[] {
        return this._orders;
    }

    get products(): Product[] {
        return this._products;
    }

    get purchase_policies(): PurchasePolicyHandler {
        return this._purchase_policies;
    }

    get shop_id(): number {
        return this._shop_id;
    }

    get shop_management(): ShopManagement {
        return this._shop_management;
    }

    addItem(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType): boolean | string {
        const item: Product | string = ProductImpl.create(base_price, description, name, purchase_type);
        if (typeof item === "string"){
            return item
        }
        this._products = this._products.concat([item]);
        return true;
    }

    filter(products: Product[], filters: { filter_name: string; filter_value: string }[]): Product[] {
        const passed_filter = (f: { filter_name: string; filter_value: string }) => (product: Product) => {
            return (f.filter_name == "below_price") ? product.base_price <= Number(f.filter_value) :
                    (f.filter_name == "above_price") ? product.base_price >= Number(f.filter_value) :
                    // (f.filter_name == "rating") ? true :   // add rating to product
                    (f.filter_name == "category") ? product.category.some(c => c.name == f.filter_value) :
                        //can add more
                    false;
        }
        return (filters.length == 0) ? products :
            this.filter(products.filter(passed_filter(filters[0])), filters.slice(1));
    }

    getAllItems(): Product[] {
        return this.products;
    }

    getShopHistory(): string[] {
        return this._orders.map(order => order.to_string());
    }

    purchaseItems() {
        return false //TODO mega function, don't do alone
    }

    removeItem(item_id: number): boolean {
        if (!this._products.some(p => p.product_id == item_id)) return false;
        this._products = this._products.filter(p => p.product_id != item_id);
        return true;
    }

    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[] {
        return this._products
            .filter(p => (name === undefined) ? true : p.name == name)
            .filter(p => (category == undefined) ? true : p.category.some(c => c.name == category))
            .filter(p => (keyword === undefined) ? true : `${p.description} ${String(p.amount)} ${String(p.product_id)}`
                .toLowerCase().indexOf(keyword.toLowerCase()) !== -1)
        ;
    }

    getItem(product_id: number): Product | string {
        const result = this._products.filter((product: Product) => product.product_id == product_id);
        if (result.length == 0)
            return ProductNotFound;//TODO logger
        return result[0];
    }


}