import {Discount} from "./Discount";
import {Product} from "../../ProductHandling/Product";
import {ProductPurchase} from "../../ProductHandling/ProductPurchase";
import {DiscountHandler} from "./DiscountHandler";

export class SimpleDiscount implements Discount {
    value: number
    id: number;

    constructor(id: number, value: number) {
        this.id = id;
        this.value = value;
    }

    static create(value: number) {
        return new SimpleDiscount(DiscountHandler.discountCounter++, value)
    }

    evaluate(product: Product | ProductPurchase, amount: number): number {
        return this.value;
    }

    toString(): string {
        return JSON.stringify(this)
    }
}