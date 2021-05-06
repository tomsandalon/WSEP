import {Discount} from "./Discount";
import {Product} from "../../ProductHandling/Product";
import {ProductPurchase} from "../../ProductHandling/ProductPurchase";


export class DiscountHandler {
    static reset(): void {
        DiscountHandler.discountCounter = 0;
    }

    static discountCounter = 0;

    private _discount: Discount[] = Array<Discount>();

    addDiscount(discount: Discount): void {
        this._discount = this._discount.concat([discount])
    }

    removeDiscount(id: number): boolean {
        const curLength = this._discount.length
        this._discount = this._discount.filter(d => d.id != id)
        return curLength != this._discount.length
    }

    get discount() {
        return this._discount;
    }

    evaluateDiscount(product: Product | ProductPurchase, amount: number): number {
        return this._discount.reduce((max, cur) => Math.max(cur.evaluate(product, amount), max), 0)
    }
    toString(): string {
        return JSON.stringify(this)
    }
}