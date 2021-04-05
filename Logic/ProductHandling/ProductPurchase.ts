import {Category} from "./Category";

export interface ProductPurchase {
    product_id: number,
    name: string,
    description: string,
    categories: string[]
    amount: number,
    actual_price: number,
}