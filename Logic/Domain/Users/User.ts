import {ShoppingBasket, ShoppingBasketImpl, ShoppingEntry} from "../ProductHandling/ShoppingBasket";
import {Purchase} from "../ProductHandling/Purchase";
import {ProductPurchase} from "../ProductHandling/ProductPurchase";
import {logger} from "../Logger";
import {ShopInventory} from "../Shop/ShopInventory";
import {PaymentHandler, PaymentHandlerImpl} from "../../Service/Adapters/PaymentHandler";
import {UserPurchaseHistory, UserPurchaseHistoryImpl} from "./UserPurchaseHistory";
import {BasketDoesntExists} from "../ProductHandling/ErrorMessages";

const LEGAL_DRINKING_AGE = 18
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

    addToBasket(shop: ShopInventory, product_id: number, amount: number): void | string

    editBasketItem(shop: ShopInventory, product_id: number, new_amount: number): void | string

    purchaseBasket(shop_id: number, payment_method: string): Promise<string | boolean>

    purchaseCart(payment_method: string): Promise<string[] | boolean>

    displayBasket(shop_id: number): string[] | string

    removeItemFromBasket(shop: ShopInventory, product_id: number): void

    displayBaskets(): string[][] | string

    getOrderHistory(): string[] | string
}

export class UserImpl implements User {
    private readonly _user_email: string
    private readonly _password: string
    private readonly _is_admin: boolean
    private readonly _order_history: UserPurchaseHistory
    private readonly _user_id: number
    private readonly _is_guest: boolean
    private _cart: ShoppingBasket[]

    private readonly _payment_handler: PaymentHandler

    private constructor(user_email: string, password: string, is_admin: boolean, order_history: UserPurchaseHistory, user_id: number, is_guest: boolean, underaged: boolean, cart: ShoppingBasket[]) {
        this._user_email = user_email
        this._password = password
        this._is_admin = is_admin
        this._order_history = order_history
        this._user_id = user_id
        this._is_guest = is_guest
        this._underaged = underaged
        this._payment_handler = PaymentHandlerImpl.getInstance()
        this._cart = cart
    }

    static create(user_email?: string, password?: string, is_admin: boolean = false, age?: number) {
        let _user_email = ""
        let _password = ""
        let _is_admin = false
        let _is_guest = true
        if (user_email != undefined && password != undefined && is_admin != undefined) {
            _user_email = user_email;
            _password = password;
            _is_admin = is_admin;
            _is_guest = false
        }
        let _cart = [];
        let _order_history = UserPurchaseHistoryImpl.getInstance();
        let _user_id = generateId();
        let _payment_handler = PaymentHandlerImpl.getInstance();
        let _underaged = (age) ? age < LEGAL_DRINKING_AGE : false;

        return new UserImpl(_user_email, _password, _is_admin, _order_history, _user_id, _is_guest, _is_admin, [])
    }

    get cart(): ShoppingBasket[] {
        return this._cart;
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

    get user_id(): number {
        return this._user_id;
    }

    get is_guest(): boolean {
        return this._is_guest;
    }

    private _underaged: boolean;

    get underaged(): boolean {
        return this._underaged;
    }

    set underaged(value: boolean) {
        this._underaged = value;
    }

    static resetIDs = () => id_counter = 0

    /**
     * Requirement number 3.1
     * @param shop
     * @param product_id
     * @return a string if an error occurred otherwise a void.
     */
    removeItemFromBasket(shop: ShopInventory, product_id: number): string | void {
        let shopping_basket = this._cart.filter(element => element.shop.shop_id == shop.shop_id) //basket for provided shop_id exists
        if (shopping_basket.length == 0) { //trying to remove an item from a shopping basket that doesnt exist.
            logger.Error("Trying to remove an item from a shopping basket that doesnt exist");
            return ("Trying to remove an item from a shopping basket that doesnt exist");
        } else {
            let value = shopping_basket[0].removeItem(product_id);
            if (typeof value == "string") {
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
        if (shopping_basket.length == 0) { //new shopping basket
            const item: ShoppingEntry = {productId: product_id, amount: amount};
            let new_basket = ShoppingBasketImpl.create(shop, item, this);
            if (typeof new_basket === "string") {
                return new_basket;
            }
            this._cart.push(new_basket);
        } else {//add to existing
            const add = shopping_basket[0].addToBasket(product_id, amount)
            if (typeof add == "boolean") {
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
    editBasketItem(shop: ShopInventory, product_id: number, new_amount: number): void | string {
        let shopping_basket = this._cart.filter(element => element.shop.shop_id == shop.shop_id);
        if (shopping_basket.length == 0) {// cant edit an item if the shopping basket doesnt exists  yet.
            logger.Error("Can't edit item information to a shop-basket that doesnt exist");
            return "Can't edit item information to a shop-basket that doesnt exist";
        } else {
            const result = shopping_basket[0].editBasketItem(product_id, new_amount);
            if (typeof result === "string") {
                return result;
            }
            if (shopping_basket[0].isEmpty())
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
    async purchaseBasket(shop_id: number, payment_method: string): Promise<string | boolean> {
        let shopping_basket = this._cart.filter(element => element.shop.shop_id == shop_id);
        if (shopping_basket.length == 0) { //trying to purchase a basket that doesnt exist
            logger.Error(BasketDoesntExists);
            return BasketDoesntExists;
        }
        return shopping_basket[0].purchase(payment_method, [])
            .then(order => {
                if (typeof order === "string")
                    return order
                this._order_history.addPurchase(this._user_id, order)
                this._cart = this._cart.filter(basket => basket.shop.shop_id != shop_id)
                return true;
            })
    }

    /**
     * Requirement number 2.9
     * @param payment_method
     * @return true if all baskets could be purchased
     */
    async purchaseCart(payment_method: string): Promise<string[] | boolean> {
        // const coupon_per_basket = [[], []]
        let success: number[] = []
        let errors: string[] = []
        for (const basket of this._cart) {
            const index: number = this._cart.indexOf(basket);
            await basket.purchase(payment_method, [])
                .then(result => {
                    if (typeof result === "string")
                        errors.push(result)
                    else {
                        this._order_history.addPurchase(this._user_id, result)
                        success.push(index)
                    }
                })
        }
        this._cart = this._cart.filter((_, index) => index in success);
        return errors.length > 0 ? errors : true;
    }

    /**
     * Requirement number 2.8
     * @param shop_id
     * @return information regarding the shopping basket of a specific shop.
     */
    displayBasket(shop_id: number): string[] | string {
        let shopping_basket = this._cart.filter(element => element.shop.shop_id == shop_id);
        if (shopping_basket.length == 0) {
            logger.Error("Trying to display a basket that doesnt exist")
            return "Trying to display a basket that doesnt exist";
        } else {
            let basket = shopping_basket[0];
            logger.Info(`Basket of shop id ${shop_id} was displayed`)
            return basket.toString();
        }
    }

    /**
     * Requirement number 2.8
     * @return information regarding the all the shopping baskets of the current user.
     */
    displayBaskets(): string[][] | string {
        if (this._cart.length == 0) {
            logger.Info("Trying to display an empty shopping cart")
            return "Your shopping cart is empty"
        } else {
            logger.Info(`Cart of user_id ${this._user_id} was displayed`)
            return this._cart.map(basket => basket.toString());
        }
    }

    /**
     * Requirement number 3.7
     * @return a string representation of order history
     */
    getOrderHistory(): string[] | string {
        logger.Info(`Order history of user id ${this._user_id} was displayed`)
        const purchases = this._order_history.getUserPurchases(this._user_id);
        if (typeof purchases === "string")
            return purchases
        if (purchases.length == 0) return "Empty order history";
        return purchases.map((purchase: Purchase) => purchase.toString())
    }

    logRating(product_id: number, shop_id: number, rating: number) {
        const purchases = (this._order_history.getUserPurchases(this.user_id) as Purchase[]).filter(p => p.shop.shop_id == shop_id && p.products.some(p => p.product_id == product_id))
        purchases.forEach(
            purchase => {
                const product_purchase = purchase.products.find(p => p.product_id == product_id) as ProductPurchase
                product_purchase.rating = rating
            }
        )
    }

    static createFromEntry(entry) {
        if (entry.user_id >= id_counter) id_counter = entry.user_id + 1
        return new UserImpl(entry.email, entry.password, entry.is_admin, UserPurchaseHistoryImpl.getInstance(), entry.user_id, entry.is_guest, entry.age != 0,
                [] //TODO
            )
    }
}

