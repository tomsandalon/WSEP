import {User} from "../../Users/User";
import {ShoppingBasket} from "../../ProductHandling/ShoppingBasket";
import {ProductPurchase} from "../../ProductHandling/ProductPurchase";

export type PurchaseEvalData = {
    underaged: boolean,
    basket: ReadonlyArray<ProductPurchase>
}

let id_counter: number = 0;
export const generateId = () => id_counter++;


export interface PurchaseCondition {
    id: number,
    evaluate(pData: PurchaseEvalData): Boolean
}