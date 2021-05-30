import {Category} from "./Category";

export interface ProductPurchase {
    product_id: number,
    name: string,
    description: string,
    categories: string[]
    amount_purchased: number,
    actual_price: number,
}