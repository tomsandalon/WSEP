import {ShoppingBasket, ShoppingBasketImpl, ShoppingEntry} from "../ProductHandling/ShoppingBasket";
import {Purchase} from "../ProductHandling/Purchase";
import {ProductPurchase} from "../ProductHandling/ProductPurchase";
import {logger} from "../Logger";
import {Purchase_Type, ShopInventory} from "../Shop/ShopInventory";
import {PaymentHandler, PaymentHandlerImpl} from "../../Service/Adapters/PaymentHandler";
import {UserPurchaseHistoryImpl} from "./UserPurchaseHistory";
import {BasketDoesntExists} from "../ProductHandling/ErrorMessages";
import {User as UserFromDB} from "../../DataAccess/Getters"
import {SystemImpl} from "../System";
import {Purchase_Info} from "../../../ExternalApiAdapters/PaymentAndSupplyAdapter";
import {Offer} from "../ProductHandling/Offer";

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
    active_offers: Offer[]


    addToBasket(shop: ShopInventory, product_id: number, amount: number, override_immediate?: boolean): void | string

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
    // private readonly _order_history: UserPurchaseHistory
    private readonly _user_id: number
    private readonly _is_guest: boolean
    private readonly _payment_handler: PaymentHandler
    active_offers: Offer[]

    private constructor(user_email: string, password: string, is_admin: boolean, user_id: number, is_guest: boolean, underaged: boolean, cart: ShoppingBasket[], active_offers: Offer[]) {
        this._user_email = user_email
        this._password = password
        this._is_admin = is_admin
        // this._order_history = order_history
        this._user_id = user_id
        this._is_guest = is_guest
        this._underaged = underaged
        this._payment_handler = PaymentHandlerImpl.getInstance()
        this._cart = cart
        this.active_offers = active_offers
    }

    private _cart: ShoppingBasket[]

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
        // let _order_history = UserPurchaseHistoryImpl.getInstance();
        let _user_id = generateId();
        let _payment_handler = PaymentHandlerImpl.getInstance();
        let _underaged = (age) ? age < LEGAL_DRINKING_AGE : false;
        return new UserImpl(_user_email, _password, _is_admin, _user_id, _is_guest, _is_admin, [], [])
    }

    static resetIDs = () => id_counter = 0

    static createFromEntry(entry: UserFromDB) {
        if (entry.user_id >= id_counter) id_counter = entry.user_id + 1
        const ret = new UserImpl(entry.email, entry.password, entry.admin, entry.user_id, false, entry.age < 18, [], []) //todo active offers from db
        entry.cart.forEach(cart => {
            ret.addToBasket(SystemImpl.getInstance().getShopInventoryFromID(cart.shop_id), cart.product_id, cart.amount)
        })
        return ret
    }

    static usersAreEqual(u1: UserImpl, u2: UserImpl) {
        const r = u1._user_id == u2._user_id &&
            // u1._password == u2._password &&
            u1._user_email == u2._user_email &&
            u1._is_guest == u2._is_guest &&
            u1._underaged == u2._underaged &&
            u1.is_admin == u2.is_admin &&
            u1._cart.every(c1 => u2.cart.some(c2 => ShoppingBasketImpl.basketsAreEqual(c1, c2)))
        return r
    }

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

    static same_offers(u1: UserImpl, u2: UserImpl) {
        return u1.active_offers.length == u2.active_offers.length && u1.active_offers.every(o1 => u2.active_offers.some(o2 => Offer.equals(o1, o2)))
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
    async purchaseBasket(shop_id: number, payment_method: string | Purchase_Info): Promise<string | boolean> {
        let shopping_basket = this._cart.filter(element => element.shop.shop_id == shop_id);
        if (shopping_basket.length == 0) { //trying to purchase a basket that doesnt exist
            logger.Error(BasketDoesntExists);
            return BasketDoesntExists;
        }
        return shopping_basket[0].purchase(payment_method, [])
            .then(async order => {
                if (typeof order === "string")
                    return order
                await UserPurchaseHistoryImpl.getInstance().addPurchase(this._user_id, order)
                this._cart = this._cart.filter(basket => basket.shop.shop_id != shop_id)
                return true;
            })
    }

    /**
     * Requirement number 2.9
     * @param payment_method
     * @return true if all baskets could be purchased
     */
    async purchaseCart(payment_method: string | Purchase_Info): Promise<string[] | boolean> {
        let success: number[] = []
        let errors: string[] = []
        for (const basket of this._cart) {
            const index: number = this._cart.indexOf(basket);
            await basket.purchase(payment_method, [])
                .then(result => {
                    if (typeof result === "string")
                        errors.push(result)
                    else {
                        UserPurchaseHistoryImpl.getInstance().addPurchase(this._user_id, result)
                        success.push(index)
                    }
                })
        }
        this._cart = this._cart.filter((_, index) => !(index in success));
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
        const purchases = UserPurchaseHistoryImpl.getInstance().getUserPurchases(this._user_id);
        if (typeof purchases === "string")
            return purchases
        if (purchases.length == 0) return "Empty order history";
        return purchases.map((purchase: Purchase) => purchase.toString())
    }

    logRating(product_id: number, shop_id: number, rating: number) {
        const purchases = (UserPurchaseHistoryImpl.getInstance().getUserPurchases(this.user_id) as Purchase[]).filter(p => p.shop.shop_id == shop_id && p.products.some(p => p.product_id == product_id))
        purchases.forEach(
            purchase => {
                const product_purchase = purchase.products.find(p => p.product_id == product_id) as ProductPurchase
                product_purchase.rating = rating
            }
        )
    }

    makeOffer(shop: ShopInventory, product_id: number, amount: number, price_per_unit: number): string | boolean {
        const offer = Offer.create(shop, product_id, amount, price_per_unit, this)
        if (typeof offer == "string") return offer
        this.active_offers = this.active_offers.concat([offer])
        return offer.addToShop()
    }

    getActiveOffers(): string | string[] {
        return this.active_offers.map(offer => offer.toString())
    }

    denyCounterOfferAsUser(offer_id: number) {
        const offer = this.active_offers.find(o => o.id == offer_id)
        if (offer == undefined) return `Offer ${offer_id} doesn't exist`
        offer.denied()
        offer.notifyManagementOfUserDeny()
        return true
    }

    offerIsPurchasable(offer_id: number) {
        const offer = this.active_offers.find(o => o.id == offer_id)
        if (offer == undefined) return `Offer ${offer_id} doesn't exist`
        return offer.isPurchasable()
    }

    purchaseRealOffer(offer: Offer, payment_info: string | Purchase_Info): Promise<string | boolean> {
        const old_cart = this._cart
        this._cart = this._cart.filter(b => b.shop.shop_id != offer.shop.shop_id)
        const old_price = offer.product.base_price
        offer.product.base_price = offer.price_per_unit
        this.addToBasket(offer.shop, offer.product.product_id, offer.amount, true)
        return this.purchaseBasket(offer.shop.shop_id, payment_info)
            .then(result => {
                this._cart = old_cart
                offer.product.base_price = old_price
                return result
            })
    }

    purchaseOffer(offer_id: number, payment_info: string | Purchase_Info): Promise<string | boolean> {
        const offer = this.active_offers.find(o => o.id == offer_id)
        if (offer == undefined) return Promise.resolve(`Offer ${offer_id} doesn't exist`)
        if (!offer.isPurchasable()) return Promise.resolve(`Offer ${offer_id} is not accepted by all shop management`)
        return this.purchaseRealOffer(offer, payment_info)
            .then(result => {
                if (typeof result != "string" && result) {
                    this.active_offers = this.active_offers.filter(o => o.id != offer_id)
                    offer.shop.active_offers = offer.shop.active_offers.filter(o => o.offer.id != offer_id)
                }
                return result
            })
    }

    /**
     * Requirement number 2.7
     * Add an item to a shopping basket which is connected to a specific store.
     * @param shop
     * @param product_id
     * @param amount
     * @param override_immediate
     * @return string if an error occurred or void otherwise.
     */
    addToBasket(shop: ShopInventory, product_id: number, amount: number, override_immediate?: boolean): string | void {
        let shopping_basket = this._cart.filter(element => element.shop.shop_id == shop.shop_id) //basket for provided shop_id exists
        const product = shop.products.find(p => product_id == p.product_id)
        if (product == undefined) return `Product ${product_id} not found`
        if (!override_immediate && product.purchase_type != Purchase_Type.Immediate) return `Purchase type of product ${product_id} is not Immediate`
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
}

