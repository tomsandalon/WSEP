import {ShoppingBasket, ShoppingBasketImpl, ShoppingEntry} from "../ProductHandling/ShoppingBasket";
import {Order} from "../ProductHandling/Order";
import {ProductPurchase, ProductPurchaseImpl} from "../ProductHandling/ProductPurchase";
import {logger} from "../Logger";
import {ShopInventory} from "../Shop/ShopInventory";

export interface User {
    user_email: string
    password: string
    cart: ShoppingBasket[]
    order_history: Order[]
    is_admin: boolean

    addToBasket(shop: ShopInventory,product_id: number, amount: number): void | string
    editBasketItem(shop: ShopInventory,product_id: number, new_amount: number): void | string
    purchaseBasket(shop_id: number, payment_method: string): string | boolean
    displayBasket(shop_id: number): string[]
    removeItemFromBasket(shop_id: number,product_id: number):void
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

    removeItemFromBasket(shop_id: number, product_id: number):void {
        let shopping_basket = this._cart.filter(element => element.shop == shop_id) //basket for provided shop_id exists
        if(shopping_basket.length == 0){ //trying to remove an item from a shopping basket that doesnt exist.
            logger.Error("Trying to remove an item from a shopping basket that doesnt exist");
        }
        else{
            //TODO use the removeItem function which is not a part of the interface therefore i cant use it...
            //shopping_basket[0].removeItem(product_id);
        }
        return;
    }

    addToBasket(shop: ShopInventory, product_id: number, amount: number): string | void {
        let shopping_basket = this._cart.filter(element => element.shop.shop_id == shop.shop_id) //basket for provided shop_id exists
        if(shopping_basket.length == 0){ //new shopping basket
            const item: ShoppingEntry = {productId: product_id, amount: amount};
            let new_basket = ShoppingBasketImpl.create(shop, item);
            if (typeof new_basket === "string"){
                return new_basket;
            }
            this._cart.push(new_basket);
        }
        else{//add to existing
            shopping_basket[0].addToBasket(product_id, amount);
        }
    }

    editBasketItem(shop: ShopInventory, product_id: number, new_amount: number): void | string{
        let shopping_basket = this._cart.filter(element =>element.shop.shop_id == shop.shop_id);
        if(shopping_basket.length == 0){// cant edit an item if the shopping basket doesnt exists  yet.
            logger.Error("Can't edit item information to a shop-basket that doesnt exist");
            return;
        }
        else{
            const result = shopping_basket[0].editBasketItem(product_id, new_amount);
            if (typeof result === "string"){
                return result;
            }
        }

    }
    purchaseBasket(shop_id: number, payment_method: string): string | boolean {
        let shopping_basket = this._cart.filter(element =>element.shop.shop_id == shop_id);
        if(shopping_basket.length == 0){ //trying to purchase a basket that doesnt exist
            logger.Error("Trying to purchase a shop basket that doesnt exist");
            return false;
        }
        else{//TODO payment_handler?
            return true;
        }

    }
    displayBasket(shop_id: number): string[] {
        let shopping_basket = this._cart.filter(element =>element.shop.shop_id == shop_id);
        if(shopping_basket.length == 0){
            logger.Error("Trying to display a basket that doesnt exist")
            return [];
        }
        else{
            //TODO to string products + amount

            return []
        }
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

