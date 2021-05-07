import {PurchaseCondition, PurchaseEvalData} from "./PurchaseCondition";

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

    evaluate(product_data: PurchaseEvalData): Boolean {
        return this.action == Action.And ? this.conditions.some(c => c.evaluate(product_data)) : this.conditions.every(c => c.evaluate(product_data));
    }
}