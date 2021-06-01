import {CompositeDiscount} from "./CompositeDiscount";
import {Discount} from "./Discount";
import {ProductPurchase} from "../../ProductHandling/ProductPurchase";
import {DiscountHandler} from "./DiscountHandler";

export enum NumericOperation {
    Max,
    Add,
    __LENGTH
}

export class NumericCompositionDiscount implements CompositeDiscount {
    operation: NumericOperation
    discounts: Discount[]
    id: number;

    constructor(id: number, operation: NumericOperation, discounts: Discount[]) {
        this.id = id;
        this.operation = operation;
        this.discounts = discounts;
    }

    static create(operation: NumericOperation, discounts: Discount[]) {
        return new NumericCompositionDiscount(DiscountHandler.discountCounter++, operation, discounts)
    }

    evaluate(product: ProductPurchase, amount: number): number {
        switch (this.operation) {
            case NumericOperation.Add:
                return Math.min(1, this.discounts.reduce((acc, cur) => acc + cur.evaluate(product, amount), 0))
            case NumericOperation.Max:
                return this.discounts.reduce((max, cur) => Math.max(max, cur.evaluate(product, amount)), 0)
            default:
                return -1
        }
    }

    toString(): string {
        return JSON.stringify(this)
    }
}