import {Discount} from "./Discount";
import {Product} from "../../ProductHandling/Product";

export class SimpleDiscount implements Discount {
    value: number

    constructor(value: number) {
        this.value = value;
    }

    evaluate(product: Product, amount: number): number {
        return this.value;
    }
}