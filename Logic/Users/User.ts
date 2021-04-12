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
    purchaseCart(payment_method: string):any
    displayBasket(shop_id: number): string[] | string
    removeItemFromBasket(shop: ShopInventory, product_id: number):void
    displayBaskets(): string[][] | string
    //TODO req: 3.7 - add it.
}
export class UserImpl implements User{
    private readonly _user_email: string
    private readonly _password: string
    private readonly _is_admin: boolean
    private readonly _cart: ShoppingBasket[]
    private readonly _order_history: Order[]

    constructor(user_email:string, password:string, is_admin:boolean) {
        this._user_email = user_email;
        this._password = password;
        this._is_admin = is_admin;
        this._cart = [];
        this._order_history = [];
    }

    purchaseCart(payment_method: string) {
        throw new Error("Method not implemented.");
    }

    /**
     * Requirement number 3.1
     * @param shop
     * @param product_id
     * @return a string if an error occurred otherwise a void.
     */
    removeItemFromBasket(shop: ShopInventory, product_id: number): string | void {
        let shopping_basket = this._cart.filter(element => element.shop.shop_id == shop.shop_id) //basket for provided shop_id exists
        if(shopping_basket.length == 0){ //trying to remove an item from a shopping basket that doesnt exist.
            logger.Error("Trying to remove an item from a shopping basket that doesnt exist");
            return ("Trying to remove an item from a shopping basket that doesnt exist");
        }
        else{
            let value = shopping_basket[0].removeItem(product_id);
            if(typeof value == "string"){
                return value;
            }
        }
        return;
    }

    /**
     * Requirement number 2.7
     * Add an item to a shopping basket which is connected to a specific store.
     * @param shop
     * @param product_id
     * @param amount
     * @return string if an error occurred or void otherwise.
     */
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
            console.log(shopping_basket[0].addToBasket(product_id, amount));
        }
    }

    /**
     * Requirement number 2.8
     * Edit an item amount of a specific product id which belongs to a specific shop
     * @param shop
     * @param product_id
     * @param new_amount
     * @return string if an error occurred or void otherwise
     */
    editBasketItem(shop: ShopInventory, product_id: number, new_amount: number): void | string{
        let shopping_basket = this._cart.filter(element =>element.shop.shop_id == shop.shop_id);
        if(shopping_basket.length == 0){// cant edit an item if the shopping basket doesnt exists  yet.
            logger.Error("Can't edit item information to a shop-basket that doesnt exist");
            return "Can't edit item information to a shop-basket that doesnt exist";
        }
        else{
            const result = shopping_basket[0].editBasketItem(product_id, new_amount);
            if (typeof result === "string"){
                return result;
            }
        }
    }

    /**
     * Requirement number 2.9
     * @param shop_id
     * @param payment_method
     * @return true if the purchase is a success otherwise a string representing th error
     */
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

    /**
     * Requirement number 2.8
     * @param shop_id
     * @return information regarding the shopping basket of a specific shop.
     */
    displayBasket(shop_id: number): string[] | string {
        let shopping_basket = this._cart.filter(element =>element.shop.shop_id == shop_id);
        if(shopping_basket.length == 0){
            logger.Error("Trying to display a basket that doesnt exist")
            return "Trying to display a basket that doesnt exist";
        }
        else{
            let basket = shopping_basket[0];
            return basket.toStringBasket();
        }
    }
    /**
     * Requirement number 2.8
     * @return information regarding the all the shopping baskets of the current user.
     */
    displayBaskets(): string[][] | string{
        if(this._cart.length == 0){
            logger.Error("Trying to display an empty shopping cart")
            return "Trying to display an empty shopping cart";
        }
        else{
            return this._cart.map(basket => basket.toStringBasket());
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

