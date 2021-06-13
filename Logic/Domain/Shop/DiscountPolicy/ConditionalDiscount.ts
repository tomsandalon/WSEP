import {Discount} from "./Discount";
import {ProductPurchase} from "../../ProductHandling/ProductPurchase";
import {DiscountHandler} from "./DiscountHandler";

export enum Condition {
    Category,
    Product_Name,
    Amount,
    Shop
}

export class ConditionalDiscount implements Discount {
    condition: Condition
    discount: Discount
    condition_param: string
    id: number

    constructor(id: number, condition: Condition, discount: Discount, condition_param: string) {
        this.id = id;
        this.condition = condition;
        this.discount = discount;
        this.condition_param = condition_param;
    }

    static create(condition: Condition, discount: Discount, condition_param: string) {
        let id = DiscountHandler.discountCounter++;
        return new ConditionalDiscount(id, condition, discount, condition_param)
    }

    evaluate(product: ProductPurchase, amount: number): number {
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
        return shouldApply ? this.discount.evaluate(product, amount) : 0
    }

    toString(): string {
        return JSON.stringify(this)
    }
}