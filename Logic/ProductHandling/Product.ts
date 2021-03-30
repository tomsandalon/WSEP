import {Category} from "./Category";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchaseType} from "../PurchaseProperties/PurchaseType";

export interface Product {
    product_id: number,
    name: string,
    description: string,
    amount: number, // >= 0
    category: Category[],
    base_price: number, // >= 0
    discount_type: DiscountType
    purchase_type: PurchaseType
}