import {CompositeDiscount} from "./CompositeDiscount";
import {Discount} from "./Discount";
import {Product} from "../../ProductHandling/Product";
import {DiscountHandler} from "./DiscountHandler";
import {ProductPurchase} from "../../ProductHandling/ProductPurchase";

export enum LogicComposition {
    XOR,
    AND,
    OR,
    __LENGTH
}

export class LogicCompositionDiscount implements CompositeDiscount {
    logic_composition: LogicComposition
    firstDiscount: Discount
    secondDiscount: Discount

    constructor(id: number, logic_composition: LogicComposition, firstDiscount: Discount, secondDiscount: Discount) {
        this.id = id
        this.logic_composition = logic_composition;
        this.firstDiscount = firstDiscount
        this.secondDiscount = secondDiscount
    }

    static create(logic_condition: LogicComposition, firstDiscount: Discount, secondDiscount: Discount) {
        let id = DiscountHandler.discountCounter++;
        return new LogicCompositionDiscount(id, logic_condition, firstDiscount, secondDiscount)
    }

    private minValue(numbers: number[]): number {
        return numbers.reduce((min, cur) => Math.min(min, cur), 1);
    }

    private maxValue(numbers: number[]): number {
        return numbers.reduce((min, cur) => Math.max(min, cur), 1);
    }

    evaluate(product: ProductPurchase, amount: number): number {
        const discount_values = [this.firstDiscount, this.secondDiscount].map(d => d.evaluate(product, amount))
        switch (this.logic_composition) {
            case LogicComposition.AND:
                if (this.minValue(discount_values) == 0) return 0
                else return this.maxValue(discount_values)
            case LogicComposition.OR:
                return this.maxValue(discount_values)
            case LogicComposition.XOR:
                if (discount_values.some(v => v == 0) && discount_values.some(v => v > 0)) return this.maxValue(discount_values)
                else return 0
            default:
                return -1
        }
    }

    id: number;
    toString(): string {
        return JSON.stringify(this)
    }
}