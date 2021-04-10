import {ShoppingBasket} from "../ProductHandling/ShoppingBasket";
import {Order} from "../ProductHandling/Order";
import {ProductPurchase} from "../ProductHandling/ProductPurchase";

export interface User {
    user_email: string
    password: string
    cart: ShoppingBasket[]
    order_history: Order[]
    is_admin: boolean

    addToBasket(shop_id: number,product_id: number, amount: number): void
    editBasketItem(shop_id: number,product_id: number, new_amount: number): void
    purchaseBasket(shop_id: number, payment_method: string): string | boolean
    displayBasket(shop_id): ProductPurchase[]
    //TODO req: 3.7 - add it.
}
export class UserImpl implements User{
    private _user_email: string
    private _password: string
    private _is_admin: boolean
    private _cart: ShoppingBasket[]
    private _order_history: Order[]

    constructor(user_email:string, password:string, is_admin:boolean) {
        this._user_email = user_email;
        this._password = password;
        this._is_admin = is_admin;
        this._cart = [];
        this._order_history = [];
    }

    addToBasket(shop_id: number, product_id: number, amount: number): void {

    }
    editBasketItem(shop_id: number, product_id: number, new_amount: number): void {
        throw new Error("Method not implemented.");
    }
    purchaseBasket(shop_id: number, payment_method: string): string | boolean {
        throw new Error("Method not implemented.");
    }
    displayBasket(shop_id: any): ProductPurchase[] {
        throw new Error("Method not implemented.");
    }

    get user_email(): string {
        return this._user_email;
    }

    get password(): string {
        return this._password;
    }

    get is_admin(): boolean {
        return this._is_admin;
    }

    get cart():ShoppingBasket[] {
        return this._cart;
    }
    get order_history():Order[]
    {
        return this._order_history;
    }

}

