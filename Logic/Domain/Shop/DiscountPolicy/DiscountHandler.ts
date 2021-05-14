import {Discount} from "./Discount";
import {Product} from "../../ProductHandling/Product";
import {ProductPurchase} from "../../ProductHandling/ProductPurchase";
import {Condition, ConditionalDiscount} from "./ConditionalDiscount";
import {NumericCompositionDiscount, NumericOperation} from "./NumericCompositionDiscount";
import {LogicComposition, LogicCompositionDiscount} from "./LogicCompositionDiscount";
import {MinimalUserData} from "../../ProductHandling/ShoppingBasket";


export class DiscountHandler {
    static reset(): void {
        DiscountHandler.discountCounter = 0;
    }

    static discountCounter = 0;

    private _discounts: Discount[] = Array<Discount>();

    addDiscount(discount: Discount): void {
        this._discounts = this._discounts.concat([discount])
    }

    removeDiscount(id: number): boolean {
        const curLength = this._discounts.length
        this._discounts = this._discounts.filter(d => d.id != id)
        return curLength != this._discounts.length
    }

    get discounts() {
        return this._discounts;
    }

    evaluateDiscount(product: ProductPurchase, amount: number): number {
        return this._discounts.reduce((max, cur) => Math.max(cur.evaluate(product, amount), max), 0)
    }
    toString(): string {
        return JSON.stringify(this)
    }

    addConditionToDiscount(discount_id: number, condition: Condition, condition_param: string) {
        const discount = this._discounts.find(d => d.id == discount_id)
        if (!discount) return false;
        this._discounts = this._discounts.filter(d => d.id != discount_id).concat([
            new ConditionalDiscount(condition, discount, condition_param)
        ])
        return true
    }

    addNumericCompositionDiscount(operation: NumericOperation, d_id1: number, d_id2: number) {
        const discount1 = this._discounts.find(d => d.id == d_id1)
        const discount2 = this._discounts.find(d => d.id == d_id2)
        if (!discount1 || !discount2) return false;
        this._discounts = this._discounts.filter(d => d.id != d_id1 && d.id != d_id2).concat([
            new NumericCompositionDiscount(operation, [discount1, discount2])
        ])
        return true
    }

    addLogicCompositionDiscount(operation: LogicComposition, d_id1: number, d_id2: number) {
        const discount1 = this._discounts.find(d => d.id == d_id1)
        const discount2 = this._discounts.find(d => d.id == d_id2)
        if (!discount1 || !discount2) return false;
        this._discounts = this._discounts.filter(d => d.id != d_id1 && d.id != d_id2).concat([
            new LogicCompositionDiscount(operation, discount1, discount2)
        ])
        return true
    }

    calculatePrice(products: ReadonlyArray<ProductPurchase>, user_data: MinimalUserData) {
        return products.reduce((acc, cur) =>
            acc + (cur.amount * cur.original_price * (1 - this.evaluateDiscount(cur, cur.amount))), 0)
    }
}