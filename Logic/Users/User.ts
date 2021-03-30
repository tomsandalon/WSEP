import {ShoppingBasket} from "../ProductHandling/ShoppingBasket";
import {Order} from "../ProductHandling/Order";

export interface User {
    user_email: string
    password: string
    cart: ShoppingBasket[]
    order_history: Order[]
    is_admin: boolean
}