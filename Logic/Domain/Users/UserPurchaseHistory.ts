import {Purchase, PurchaseImpl} from "../ProductHandling/Purchase";
import {PurchaseBasket} from "../../DataAccess/API";
import {SystemImpl} from "../System";
import {Purchase as PurchaseRestore} from "../../DataAccess/Getters"
import {ProductPurchaseImpl} from "../ProductHandling/ProductPurchase";
import {CategoryImpl} from "../ProductHandling/Category";


type history_key = { user_id: number, shop_id: number, purchase_id: number };
export type history_entry = { key: history_key, purchase: Purchase };

export interface UserPurchaseHistory {
    history: history_entry[]

    addPurchase(user_id: number, purchase: Purchase): Promise<void>

    getUserPurchases(user_id: number): Purchase[] | string

    getShopPurchases(shop_id: number): Purchase[] | string
}

export class UserPurchaseHistoryImpl implements UserPurchaseHistory {
    private static instance: UserPurchaseHistoryImpl;

    private constructor() {
        this._history = []
    }

    private _history: history_entry[];

    get history(): history_entry[] {
        return this._history;
    }

    public static getInstance(reset?: boolean) {
        if (this.instance == undefined || reset)
            UserPurchaseHistoryImpl.instance = new UserPurchaseHistoryImpl()
        return this.instance
    }

    public async addPurchase(user_id: number, purchase: Purchase): Promise<void> {
        this.addPurchaseToHistory(user_id, purchase);
        await PurchaseBasket(user_id, purchase.shop.shop_id, purchase.order_id, purchase.date, purchase.products.map(product => {
            return {
                product_id: product.product_id,
                amount: product.amount,
                actual_price: product.actual_price,
                name: product.name,
                base_price: product.original_price,
                description: product.description,
                categories: product.category.join(",")
            }
        }))
    }

    public getUserPurchases(user_id: number): Purchase[] | string {
        return this._history.reduce((acc: Purchase[], entry: history_entry) =>
            entry.key.user_id == user_id ? acc.concat(entry.purchase) : acc, []);
    }

    getShopPurchases(shop_id: number): Purchase[] | string {
        return this._history.reduce((acc: Purchase[], entry: history_entry) =>
            entry.key.shop_id == shop_id ? acc.concat(entry.purchase) : acc, []);
    }

    toString(): string {
        return JSON.stringify({
            history: this._history.map(h => h.toString())
        })
    }

    reloadPurchasesFromDB(purchases: PurchaseRestore[]) {
        purchases.forEach(purchase => {
            this.reloadPurchaseFromDB(purchase)
        })
    }

    private addPurchaseToHistory(user_id: number, purchase: Purchase) {
        this._history.push({
            key: {
                user_id: user_id,
                purchase_id: purchase.order_id,
                shop_id: purchase.shop.shop_id
            },
            purchase: purchase
        })
    }

    private reloadPurchaseFromDB(purchase: PurchaseRestore) {
        this._history = this._history.concat([
            {
                key: {
                    user_id: purchase.user_id,
                    shop_id: purchase.shop_id,
                    purchase_id: purchase.purchase_id
                },
                purchase: new PurchaseImpl(
                    purchase.date,
                    {userId: purchase.user_id, underaged: false},
                    purchase.products.map(p => new ProductPurchaseImpl(
                        p.product_id,
                        p.name,
                        p.description,
                        p.amount,
                        p.categories.split(",").filter(c => c.length > 0).map(c => CategoryImpl.create(c) as CategoryImpl),
                        p.base_price,
                        p.actual_price
                    )),
                    SystemImpl.getInstance().getShopInventoryFromID(purchase.shop_id),
                    purchase.purchase_id
                )
            }
        ])
    }

    static historiesAreEqual(h1: history_entry, h2: history_entry) {
        const key1 = h1.key
        const key2 = h2.key
        const p1 = h1.purchase
        const p2 = h2.purchase
        return key1.user_id == key2.user_id &&
            key1.shop_id == key2.shop_id &&
            p1.shop.shop_id == p2.shop.shop_id &&
            UserPurchaseHistoryImpl.sameDay(p1.date, p2.date) &&
            p1.minimal_user_data.userId == p2.minimal_user_data.userId &&
            p1.products.length == p2.products.length &&
            p1.products.every(p1 => p2.products.some(p2 => ProductPurchaseImpl.productsAreEqual(p1, p2)))
    }

    private static sameDay = function (d1: Date, d2: Date) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getDate() == d2.getDate() &&
            d1.getMonth() == d2.getMonth()
    }
}