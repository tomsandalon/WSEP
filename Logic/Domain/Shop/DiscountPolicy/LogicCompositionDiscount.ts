import {CompositeDiscount} from "./CompositeDiscount";
import {Discount} from "./Discount";
import {Product} from "../../ProductHandling/Product";

export enum LogicComposition {
    XOR,
    AND,
    OR,
}

export class LogicCompositionDiscount implements CompositeDiscount {
    logic_composition: LogicComposition
    firstDiscount: Discount
    secondDiscount: Discount

    constructor(logic_composition: LogicComposition, firstDiscount: Discount, secondDiscount: Discount) {
        this.logic_composition = logic_composition;
        this.firstDiscount = firstDiscount
        this.secondDiscount = secondDiscount
    }

    evaluate(product: Product, amount: number): number {
        const discount_values = [this.firstDiscount, this.secondDiscount].map(d => d.evaluate(product, amount))
        switch (this.logic_composition) {
            case LogicComposition.AND:
                if (Math.min(discount_values) == 0) return 0
                else return Math.max(discount_values)
            case LogicComposition.OR:
                return Math.max(discount_values)
            case LogicComposition.XOR:
                if (discount_values.some(v => v == 0) && discount_values.some(v => v > 0)) return Math.max(discount_values)
                else return 0
        }
    }
}