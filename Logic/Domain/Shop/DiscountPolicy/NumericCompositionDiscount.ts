import {CompositeDiscount} from "./CompositeDiscount";
import {Discount} from "./Discount";
import {Product} from "../../ProductHandling/Product";

export enum Operation {
    Max,
    Add
}

export class NumericCompositionDiscount implements CompositeDiscount {
    operation: Operation
    value: number
    discounts: Discount[]

    constructor(operation: Operation, value: number, discounts: Discount[]) {
        this.operation = operation;
        this.value = value;
        this.discounts = discounts;
    }

    evaluate(product: Product, amount: number): number {
        switch (this.operation) {
            case Operation.Add:
                return Math.min(1, this.discounts.reduce((acc, cur) => acc + cur.evaluate(product, amount), 0))
            case Operation.Max:
                return this.discounts.reduce((max, cur) => Math.max(max, cur.evaluate(product, amount)), 0)
        }
    }

}