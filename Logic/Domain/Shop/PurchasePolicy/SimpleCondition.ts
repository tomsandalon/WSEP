import {PurchaseCondition, purchaseEvalData} from "./PurchaseCondition";

export enum ConditionType {
    NotCategory,
    BeforeTime,
    AfterTime,
    LowerAmount,
    GreaterAmount,
    UnderAge,
}

export class SimpleCondition implements PurchaseCondition {

    condition: ConditionType
    value: string

    constructor(condition: ConditionType, value: any) {
        this.condition = condition;
        this.value = value.toString()
    }

    evaluate(pData: purchaseEvalData): Boolean {
        switch (this.condition) {
            case ConditionType.NotCategory:
                return !pData.basket.products.some(e => e.product.category.some(c => c.name == this.value))
            case ConditionType.BeforeTime:
                return !((new Date()).getHours() > (new Date(this.value)).getHours())
            case ConditionType.AfterTime:
                return !((new Date()).getHours() < (new Date(this.value)).getHours())
            case ConditionType.LowerAmount:
                return (pData.basket.products.reduce((acc, cur) => acc + cur.amount, 0) < Number(this.value))
            case ConditionType.GreaterAmount:
                return (pData.basket.products.reduce((acc, cur) => acc + cur.amount, 0) > Number(this.value))
            case ConditionType.UnderAge:
                return false //TODO add age to users
        }
    }
}