import {PaymentHandler} from "../Adapters/PaymentHandler";
import {DeliveryHandler} from "../Adapters/DeliveryHandler";
import {ProductPurchase} from "./ProductPurchase";

export interface Order {
    order_id: number,
    shop_id: any,
    products: ProductPurchase[],
    date: Date,
    purchase_self: () => string | boolean
}