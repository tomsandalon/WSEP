import {PurchaseType} from "../PurchaseProperties/PurchaseType";
import {ShopManagement} from "./ShopManagement";
import {DiscountPolicyHandler} from "../PurchaseProperties/DiscountPolicyHandler";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchasePolicyHandler} from "../PurchaseProperties/PurchasePolicyHandler";
import {Product} from "../ProductHandling/Product";
import {Order} from "../ProductHandling/Order";

export interface ShopInventory {
    shop_id: number //TODO remove if unused
    shop_management: ShopManagement
    products: Product[]
    purchase_policies: PurchasePolicyHandler
    discount_policies: DiscountPolicyHandler
    discount_types: DiscountType[]
    orders: Order[]

    getAllItems(): Product[]
    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[]
    purchaseItems(): boolean

    addItem(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType): boolean
    removeItem(item_id: number): boolean //TODO ADD PARAMETERS
    getShopHistory(): string[]
    filter(products: Product[], filters: { filter_name: string; filter_value: string }[]): Product[];
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

    addItem(name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType): boolean {
        const item: Product = undefined //TODO replace with constructor
        this._products.push(item);
        return true;
    }

    filter(products: Product[], filters: { filter_name: string; filter_value: string }[]): Product[] {
        const passed_filter = (f: { filter_name: string; filter_value: string }) => (product: Product) => {
            return (f.filter_name == "below_price") ? product.base_price <= Number(f.filter_value) :
                    (f.filter_name == "above_price") ? product.base_price >= Number(f.filter_value) :
                    (f.filter_name == "rating") ? true :   //TODO add rating to product
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
        return this._orders.map(o => "hi"); //TODO replace "hi" with order toString after merge with products
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
}