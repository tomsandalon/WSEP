import {User} from "../../Users/User";
import {ShoppingBasket} from "../../ProductHandling/ShoppingBasket";
import {ProductPurchase} from "../../ProductHandling/ProductPurchase";

export type PurchaseEvalData = {
    underaged: boolean,
    basket: ReadonlyArray<ProductPurchase>
}

export interface PurchaseCondition {
    evaluate(pData: PurchaseEvalData): Boolean
}