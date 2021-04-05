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