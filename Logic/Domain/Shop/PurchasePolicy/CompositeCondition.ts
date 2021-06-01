import {PurchaseCondition, PurchaseEvalData} from "./PurchaseCondition";
import {generateId} from "../ShopInventory";

export enum Operator {
    And,
    Or,
}

export class CompositeCondition implements PurchaseCondition {
    id: number;
    conditions: PurchaseCondition[]
    action: Operator

    constructor(id: number, conditions: PurchaseCondition[], action: Operator) {
        this.id = id;
        this.conditions = conditions;
        this.action = action;
    }

    static create(conditions: PurchaseCondition[], action: Operator) {
        return new CompositeCondition(generateId(), conditions, action)
    }

    evaluate(product_data: PurchaseEvalData): Boolean {
        return this.action == Operator.And ? this.conditions.some(c => c.evaluate(product_data)) : this.conditions.every(c => c.evaluate(product_data));
    }

    toString(): string {
        return JSON.stringify(this)
    }
}