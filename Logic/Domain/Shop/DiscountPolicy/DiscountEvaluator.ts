import {Discount} from "./Discount";
import {Product} from "../../ProductHandling/Product";

export class DiscountEvaluator {
    private readonly _discount[]: Discount[]

    constructor() {
        this._discount = Array<Discount>();
    }

    get discount() {
        return this._discount;
    }

    evaluateDiscount(product: Product, amount: number): number {
        return this._discount.reduce((max, cur) => Math.max(cur.evaluate(product, amount), max), 0)
    }
}