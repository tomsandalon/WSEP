import {Product} from "../../ProductHandling/Product";

export interface Discount {
    /**
     * evaluation of discount. 0 <= discount value <= 1
    * @param product the product to evaluate
     * @param amount the amount of the product to evaluate
     * @return total percent of discount. 0 for no discount.
     */
    evaluate(product: Product, amount: number): number
}