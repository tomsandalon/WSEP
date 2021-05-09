import {ShoppingBasket, ShoppingBasketImpl, ShoppingEntry} from "../ProductHandling/ShoppingBasket";
import {Purchase, PurchaseImpl} from "../ProductHandling/Purchase";
import {ProductPurchase, ProductPurchaseImpl} from "../ProductHandling/ProductPurchase";
import {logger} from "../Logger";
import {ShopInventory} from "../Shop/ShopInventory";
import {PaymentHandler, PaymentHandlerImpl} from "../../Service/Adapters/PaymentHandler";
import {UserPurchaseHistory, UserPurchaseHistoryImpl} from "./UserPurchaseHistory";
import {BasketDoesntExists} from "../ProductHandling/ErrorMessages";

export let id_counter: number = 0;
const generateId = () => id_counter++;

export interface User {
    user_email: string
    password: string
    cart: ShoppingBasket[]
    is_admin: boolean
    user_id: number
    is_guest: boolean
    underaged: boolean

    addToBasket(shop: ShopInventory,product_id: number, amount: number): void | string
    editBasketItem(shop: ShopInventory,product_id: number, new_amount: number): void | string
    purchaseBasket(shop_id: number, payment_method: string): string | boolean
    purchaseCart(payment_method: string):string[] | boolean
    displayBasket(shop_id: number): string[] | string
    removeItemFromBasket(shop: ShopInventory, product_id: number):void
    displayBaskets(): string[][] | string
    getOrderHistory():string[] | string
    isUnderaged(): boolean;
}

export class UserImpl implements User {
    private readonly _user_email: string
    private readonly _password: string
    private readonly _is_admin: boolean
    private _cart: ShoppingBasket[]
    private readonly _order_history: UserPurchaseHistory
    private readonly _user_id: number
    private readonly _is_guest: boolean
    private readonly _payment_handler: PaymentHandler

    static resetIDs = () => id_counter = 0

    constructor(user_email?:string, password?:string, is_admin?:boolean) {
        if(user_email != undefined && password != undefined && is_admin != undefined) {
            this._user_email = user_email;
            this._password = password;
            this._is_admin = is_admin;
            this._is_guest = false
        }
        else{
            this._user_email = "";
            this._password = "";
            this._is_admin = false;
            this._is_guest = true;
        }
        this._cart = [];
        this._order_history = UserPurchaseHistoryImpl.getInstance();
        this._user_id = generateId();
        this._payment_handler = PaymentHandlerImpl.getInstance();
        this._underaged = false;
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
        logger.Info(`Product id ${product_id} was removed successfully from shop_id ${shop.shop_id}`)
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
            let new_basket = ShoppingBasketImpl.create(shop, item, this);
            if (typeof new_basket === "string"){
                return new_basket;
            }
            this._cart.push(new_basket);
        }
        else{//add to existing
            const add = shopping_basket[0].addToBasket(product_id, amount)
            if(typeof add == "boolean"){
                logger.Info(`Product id ${product_id} was added successfully to the basket of shop_id ${shop.shop_id}`)
                return
            }
        return add;
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
            if(shopping_basket[0].isEmpty())
                this._cart = this._cart.filter(element => element.shop.shop_id != shop.shop_id);
            logger.Info(`Product id ${product_id} was edited successfully for shop_id ${shop.shop_id}`)
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
            logger.Error(BasketDoesntExists);
            return BasketDoesntExists;
        }
        const order = shopping_basket[0].purchase(payment_method, []);
        if(typeof order === "string")
            return order
        this._order_history.addPurchase(this._user_id, order)
        this._cart = this._cart.filter(basket => basket.shop.shop_id != shop_id)
        return true;
    }


    get underaged(): boolean {
        return this._underaged;
    }

    set underaged(value: boolean) {
        this._underaged = value;
    }

    /**
     * Requirement number 2.9
     * @param payment_method
     * @return true if all baskets could be purchased
     */
    purchaseCart(payment_method: string):string[] | boolean {
        // const coupon_per_basket = [[], []]
        let success: number[] = []
        let errors: string[] = []
        this._cart.forEach((basket, index: number) =>{
            const result = basket.purchase(payment_method, []);
            if (typeof result === "string")
                errors.push(result)
            else {
                this._order_history.addPurchase(this._user_id, result)
                success.push(index)
            }
        });
        this._cart = this._cart.filter((_, index) => index in success);
        return errors.length > 0 ? errors : true;
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
            logger.Info(`Basket of shop id ${shop_id} was displayed`)
            return basket.toString();
        }
    }
    /**
     * Requirement number 2.8
     * @return information regarding the all the shopping baskets of the current user.
     */
    displayBaskets(): string[][] | string{
        if(this._cart.length == 0){
            logger.Info("Trying to display an empty shopping cart")
            return "Your shopping cart is empty"
        }
        else{
            logger.Info(`Cart of user_id ${this._user_id} was displayed`)
            return this._cart.map(basket => basket.toString());
        }
    }

    /**
     * Requirement number 3.7
     * @return a string representation of order history
     */
    getOrderHistory():string[] | string{
        logger.Info(`Order history of user id ${this._user_id} was displayed`)
        const purchases = this._order_history.getUserPurchases(this._user_id);
        if (typeof purchases === "string")
            return purchases
        if (purchases.length == 0) return "Empty order history";
        return purchases.map((purchase: Purchase) => purchase.toString())
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
    get user_id():number
    {
        return this._user_id;
    }
    get is_guest():boolean
    {
        return this._is_guest;
    }

    private _underaged: boolean;

    isUnderaged(): boolean {
        return false;
    }

}

