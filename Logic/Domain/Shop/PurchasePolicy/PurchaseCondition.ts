import {ProductPurchase} from "../../ProductHandling/ProductPurchase";

export type PurchaseEvalData = {
    underaged: boolean,
    basket: ReadonlyArray<ProductPurchase>
}


export interface PurchaseCondition {
    id: number,

    evaluate(pData: PurchaseEvalData): Boolean
}