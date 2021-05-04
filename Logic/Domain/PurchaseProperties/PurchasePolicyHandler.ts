import {PurchaseCondition, PurchaseEvalData} from "../Shop/PurchasePolicy/PurchaseCondition";

export class PurchasePolicyHandler {
    private _conditions: PurchaseCondition[]

    constructor() {
        this._conditions = [];
    }

    get conditions(): PurchaseCondition[] {
        return this._conditions;
    }

    set conditions(value: PurchaseCondition[]) {
        this._conditions = value;
    }

    isAllowed(data: PurchaseEvalData): boolean {
        return this.conditions.every(c => c.evaluate(data))
    }
}