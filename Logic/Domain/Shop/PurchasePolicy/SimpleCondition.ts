import {PurchaseCondition, PurchaseEvalData} from "./PurchaseCondition";

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

    evaluate(purchase_data: PurchaseEvalData): Boolean {
        switch (this.condition) {
            case ConditionType.NotCategory:
                return !purchase_data.basket.some(e => e.category.some(c => c.name == this.value))
            case ConditionType.BeforeTime:
                return !((new Date()).getHours() > (new Date(this.value)).getHours())
            case ConditionType.AfterTime:
                return !((new Date()).getHours() < (new Date(this.value)).getHours())
            case ConditionType.LowerAmount:
                return purchase_data.basket.reduce((acc, cur) => acc + cur.amount, 0) < Number(this.value)
            case ConditionType.GreaterAmount:
                return purchase_data.basket.reduce((acc, cur) => acc + cur.amount, 0) > Number(this.value)
            case ConditionType.UnderAge:
                return !purchase_data.underaged
        }
    }
}