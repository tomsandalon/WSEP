import {User} from "../../Users/User";
import {ShoppingBasket} from "../../ProductHandling/ShoppingBasket";

export type purchaseEvalData = {
    user: User,
    basket: ShoppingBasket
}

export interface PurchaseCondition {
    evaluate(pData: purchaseEvalData): Boolean
}