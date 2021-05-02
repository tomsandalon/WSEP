import {PurchaseCondition, purchaseEvalData} from "./PurchaseCondition";

export enum Action {
    And,
    Or,
}

export class SimpleCondition implements PurchaseCondition {

    constructor(conditions: PurchaseCondition[], action: Action) {
        this.conditions = conditions;
        this.action = action;
    }

    conditions: PurchaseCondition[]
    action: Action

    evaluate(pData: purchaseEvalData): Boolean {
        return this.action == Action.And ? this.conditions.some(c => c.evaluate(pData)) : this.conditions.every(c => c.evaluate(pData));
    }
}