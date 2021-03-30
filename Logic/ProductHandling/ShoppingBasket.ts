import {Product} from "./Product";

export interface ShoppingBasket {
    basket_id: number
    shop_id: number
    products: Product[]
}