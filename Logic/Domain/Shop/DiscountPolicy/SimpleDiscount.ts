import {Discount} from "./Discount";
import {Product} from "../../ProductHandling/Product";
import {ProductPurchase} from "../../ProductHandling/ProductPurchase";
import {DiscountHandler} from "./DiscountHandler";

export class SimpleDiscount implements Discount {
    value: number

    constructor(value: number) {
        this.id = DiscountHandler.discountCounter++;
        this.value = value;
    }

    evaluate(product: Product | ProductPurchase, amount: number): number {
        return this.value;
    }

    id: number;

    toString(): string {
        return JSON.stringify(this)
    }
}