import {Product} from "./Product";
import {ProductPurchase} from "./ProductPurchase";

export interface ShoppingBasket {
    basket_id: number
    shop_id: number
    products: {product_id: number, amount: number}[]

    addToBasket(product_id: number, amount: number): void
    editBasketItem(product_id: number, new_amount: number): void
    displayBasket(shop_id): ProductPurchase[]
}