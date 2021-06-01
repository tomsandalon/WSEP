import {Discount} from "./Discount";
import {ProductPurchase} from "../../ProductHandling/ProductPurchase";
import {Condition, ConditionalDiscount} from "./ConditionalDiscount";
import {NumericCompositionDiscount, NumericOperation} from "./NumericCompositionDiscount";
import {LogicComposition, LogicCompositionDiscount} from "./LogicCompositionDiscount";
import {MinimalUserData} from "../../ProductHandling/ShoppingBasket";
import {DiscountTree, GetDiscount} from "../../../DataAccess/Getters";
import {SimpleDiscount} from "./SimpleDiscount";


export class DiscountHandler {
    static discountCounter = 0;

    private _discounts: Discount[] = Array<Discount>();

    get discounts() {
        return this._discounts;
    }

    static reset(): void {
        DiscountHandler.discountCounter = 0;
    }

    static discountsAreEqual(dis1: DiscountHandler, dis2: DiscountHandler) {
        return dis1._discounts.length == dis2._discounts.length &&
            dis1._discounts.every(d1 => dis2._discounts.some(d2 => DiscountHandler.discountIsEqual(d1, d2)))
    }

    private static roundHalf(num: number) {
        return Math.round(num * 2) / 2;
    }

    private static discountIsEqual(d1: Discount, d2: Discount) {
        return d1.id == d2.id && typeof d1 == typeof d2 &&
            JSON.stringify(d1) == JSON.stringify(d2)
    }

    addDiscount(discount: Discount): void {
        this._discounts = this._discounts.concat([discount])
    }

    removeDiscount(id: number): boolean {
        const curLength = this._discounts.length
        this._discounts = this._discounts.filter(d => d.id != id)
        return curLength != this._discounts.length
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
            ConditionalDiscount.create(condition, discount, condition_param)
        ])
        return true
    }

    addNumericCompositionDiscount(operation: NumericOperation, d_id1: number, d_id2: number) {
        const discount1 = this._discounts.find(d => d.id == d_id1)
        const discount2 = this._discounts.find(d => d.id == d_id2)
        if (!discount1 || !discount2) return false;
        this._discounts = this._discounts.filter(d => d.id != d_id1 && d.id != d_id2).concat([
            NumericCompositionDiscount.create(operation, [discount1, discount2])
        ])
        return true
    }

    addLogicCompositionDiscount(operation: LogicComposition, d_id1: number, d_id2: number) {
        const discount1 = this._discounts.find(d => d.id == d_id1)
        const discount2 = this._discounts.find(d => d.id == d_id2)
        if (!discount1 || !discount2) return false;
        this._discounts = this._discounts.filter(d => d.id != d_id1 && d.id != d_id2).concat([
            LogicCompositionDiscount.create(operation, discount1, discount2)
        ])
        return true
    }

    calculatePrice(products: ReadonlyArray<ProductPurchase>, user_data: MinimalUserData) {
        const result = products.reduce((acc, cur) =>
            acc + (cur.amount * cur.original_price * (1 - this.evaluateDiscount(cur, cur.amount))), 0)
        return DiscountHandler.roundHalf(result)
    }

    async discountFromDTO(discount: DiscountTree): Promise<Discount> {
        return discount.left && discount.right ? new SimpleDiscount(discount.id, discount.value) :
            discount.left ? GetDiscount(discount.left).then(left => this.discountFromDTO(left).then(other => new ConditionalDiscount(discount.id, discount.operator, other, discount.value))) :
                GetDiscount(discount.left).then(left => this.discountFromDTO(left).then(left =>
                    GetDiscount(discount.right).then(right => this.discountFromDTO(right).then(right => {
                        if (discount.operator >= NumericOperation.__LENGTH) return new LogicCompositionDiscount(discount.id, discount.operator + NumericOperation.__LENGTH, left, right)
                        else return new NumericCompositionDiscount(discount.id, discount.operator, [left, right])
                    })))
                );
    }

    addDiscountsFromDB(discounts) {
        discounts.forEach(discountId => {
            DiscountHandler.discountCounter = Math.max(DiscountHandler.discountCounter, discountId + 1)
            GetDiscount(discountId).then(discount => {
                this.discountFromDTO(discount).then(result => this._discounts.push(result))
            })
        })
    }
}