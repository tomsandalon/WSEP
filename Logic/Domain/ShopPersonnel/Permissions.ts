export const TotalNumberOfPermissions: number = 5

export enum Action {
    AddItem,
    ManagePolicies,
    RemoveItem,
    ViewShopHistory,
    GetStaffInfo,
}

export interface Permissions {
    add_item: boolean,
    manage_policies: boolean,
    remove_item: boolean,
    view_shop_history: boolean,
    get_staff_info: boolean

    /**
     * @param action action to perform
     * @return true iff the action is allowed by this permission
     */
    isAllowed(action: Action): boolean

    /**
     * @param action the action to edit
     * @param value the new value to set
     */
    editPermission(action: Action, value: boolean): void
}

// noinspection RedundantConditionalExpressionJS
export class ManagerPermissions implements Permissions {
    /**
     * Get staff info:
     * @Requirement 4.5
     */
    constructor(actions?: boolean[]) {
        if (actions == undefined) {
            this._add_item = false;
            this._get_staff_info = true;
            this._manage_policies = false;
            this._remove_item = false;
            this._view_shop_history = false;
        } else {
            //this weird method is necessary to ensure that the boolean array doesnt have "holes"
            this._add_item = (actions[Action.AddItem]) ? true : false;
            this._get_staff_info = actions[Action.GetStaffInfo] ? true : false;
            this._manage_policies = actions[Action.ManagePolicies] ? true : false;
            this._remove_item = actions[Action.RemoveItem] ? true : false;
            this._view_shop_history = actions[Action.ViewShopHistory] ? true : false;
        }
    }

    private _add_item: boolean;

    get add_item(): boolean {
        return this._add_item;
    }

    set add_item(value: boolean) {
        this._add_item = value;
    }

    private _get_staff_info: boolean;

    get get_staff_info(): boolean {
        return this._get_staff_info;
    }

    set get_staff_info(value: boolean) {
        this._get_staff_info = value;
    }

    private _manage_policies: boolean;

    get manage_policies(): boolean {
        return this._manage_policies;
    }

    set manage_policies(value: boolean) {
        this._manage_policies = value;
    }

    private _remove_item: boolean;

    get remove_item(): boolean {
        return this._remove_item;
    }

    set remove_item(value: boolean) {
        this._remove_item = value;
    }

    private _view_shop_history: boolean;

    get view_shop_history(): boolean {
        return this._view_shop_history;
    }

    set view_shop_history(value: boolean) {
        this._view_shop_history = value;
    }

    isAllowed(action: Action): boolean {
        return action == Action.AddItem ? this.add_item :
            action == Action.ViewShopHistory ? this.view_shop_history :
                action == Action.RemoveItem ? this.remove_item :
                    action == Action.ManagePolicies ? this.manage_policies :
                        action == Action.GetStaffInfo ? this.get_staff_info : false
    }

    toString(): string {
        const y = "Yes"
        const n = "No"
        return `Add items: ${this._add_item ? y : n}\n` +
            `Manage Policies: ${this._manage_policies ? y : n}\n` +
            `Remove items: ${this._remove_item ? y : n}\n` +
            `View shop history: ${this._view_shop_history ? y : n}\n` +
            `Get staff information: ${this._get_staff_info ? y : n}\n`;
    }

    editPermission(action: Action, value: boolean): void {
        action == Action.AddItem ? this.add_item = value :
            action == Action.ViewShopHistory ? this.view_shop_history = value :
                action == Action.RemoveItem ? this.remove_item = value :
                    action == Action.ManagePolicies ? this.manage_policies = value :
                        action == Action.GetStaffInfo ? this.get_staff_info = value : null
    }
}