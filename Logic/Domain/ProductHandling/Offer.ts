import {Purchase_Type, ShopInventory} from "../Shop/ShopInventory";
import {Product} from "./Product";
import {User} from "../Users/User";

export let offer_id_counter: number = 0
export const set_offer_id_counter = (n: number) => offer_id_counter = n
export const inc_offer_id_counter = () => offer_id_counter++


export class Offer {
    id: number
    shop: ShopInventory
    user: User
    product: Product
    amount: number
    price_per_unit: number
    is_counter_offer: boolean

    constructor(shop: ShopInventory, id: number, product: Product, amount: number, price_per_unit: number, user: User, is_counter_offer: boolean) {
        this.shop = shop;
        this.id = id;
        this.product = product;
        this.amount = amount;
        this.price_per_unit = price_per_unit;
        this.user = user
        this.is_counter_offer = is_counter_offer
    }

    static create(shop: ShopInventory, product_id: number, amount: number, price_per_unit: number, user: User): Offer | string {
        const product = shop.products.find(p => product_id == p.product_id)
        if (product == undefined) return "Product doesn't exist"
        if (product.purchase_type != Purchase_Type.Offer) return "Purchase type doesn't match"
        if (amount <= 0 || price_per_unit < 0) return "Can't offer negative numbers"
        return new Offer(shop, offer_id_counter++, product, amount, price_per_unit, user, false)
    }

    addToShop(): string | boolean {
        return this.shop.addOffer(this)
    }

    toString(): string {
        return JSON.stringify({
            shop_id: this.shop.shop_id,
            shop_name: this.shop.shop_name,
            user_id: this.user.user_id,
            user_email: this.user.user_email,
            offer_id: this.id,
            product_id: this.product.product_id,
            product_name: this.product.name,
            amount: this.amount,
            price_per_unit: this.price_per_unit,
            is_purchasable: this.isPurchasable(),
            is_counter_offer: this.is_counter_offer
        })
    }

    performPurchase() {
        //TODO
    }

    denied() {
        this.user.active_offers = this.user.active_offers.filter(o => o.id != this.id)
        this.shop.active_offers = this.shop.active_offers.filter(o => o.offer.id != this.id)
    }

    isPurchasable(): boolean {
        const offer_and_management = this.shop.active_offers.find(o => o.offer.id == this.id)
        if (offer_and_management == undefined) return false;
        return offer_and_management.managers_not_accepted.length + offer_and_management.owners_not_accepted.length == 0
    }

    notifyManagementOfUserDeny() {
        const offer_and_management = this.shop.active_offers.find(o => o.offer.id == this.id)
        if (offer_and_management == undefined) return
        offer_and_management.offer.shop.shop_management.notifyForOffer(`User ${this.user.user_email} denied the counteroffer`)
    }

    assignAsCounterOffer() {
        this.is_counter_offer = true
    }
}