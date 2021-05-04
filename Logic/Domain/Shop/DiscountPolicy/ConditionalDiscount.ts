import {CompositeDiscount} from "./CompositeDiscount";
import {Product} from "../../ProductHandling/Product";
import {Discount} from "./Discount";

export enum Condition {
    Category,
    Product_Name,
    Amount,
    Shop
}

export class ConditionalDiscount implements Discount {
    condition: Condition
    value: number
    condition_param: string

    constructor(condition: Condition, value: number, condition_param: string) {
        this.condition = condition;
        this.value = value;
        this.condition_param = condition_param;
    }

    evaluate(product: Product, amount: number): number {
        let shouldApply: Boolean;
        switch (this.condition) {
            case Condition.Amount:
                shouldApply = amount > Number(this.condition_param)
                break
            case Condition.Category:
                shouldApply = product.category.some(c => c.name == this.condition_param)
                break
            case Condition.Product_Name:
                shouldApply = product.name == this.condition_param
                break
            case Condition.Shop:
            default:
                shouldApply = true
                break
        }
        return shouldApply ? value : 0
    }
}