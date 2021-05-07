import {generateId, PurchaseCondition, PurchaseEvalData} from "./PurchaseCondition";

export enum Operator {
    And,
    Or,
}

export class CompositeCondition implements PurchaseCondition {
    id: number;

    constructor(conditions: PurchaseCondition[], action: Operator) {
        this.id = generateId();
        this.conditions = conditions;
        this.action = action;
    }

    conditions: PurchaseCondition[]
    action: Operator

    evaluate(product_data: PurchaseEvalData): Boolean {
        return this.action == Operator.And ? this.conditions.some(c => c.evaluate(product_data)) : this.conditions.every(c => c.evaluate(product_data));
    }

    toString(): string {
        return JSON.stringify(this)
    }
}