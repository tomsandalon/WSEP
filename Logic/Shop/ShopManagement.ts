import {ShopInventory, ShopInventoryImpl} from "./ShopInventory";
import {Manager, ManagerImpl} from "../ShopPersonnel/Manager";
import {Owner, OwnerImpl} from "../ShopPersonnel/Owner";
import {Action, ManagerPermissions, TotalNumberOfPermissions} from "../ShopPersonnel/Permissions";
import {logger} from "../Logger";

export interface ShopManagement {
    shop_id: number
    shop_inventory: ShopInventory,
    /**
     * @Requirement correctness requirement 4
     */
    original_owner: Owner
    owners: Owner[] // excluding the original
    managers: Manager[]

    /**
     * @param user_email email of the user trying to add items to the shop
     * @return true iff the user representation of user_email is allowed to add items to the shop
     */
    allowedAddItemToShop(user_email: string): boolean

    /**
     * @param user_email email of the user trying to remove items from the shop
     * @return true iff the user representation of user_email is allowed to remove items from the shop
     */
    allowedRemoveItemFromShop(user_email: string): boolean

    /**
     * @param user_email email of the user trying to manage policies of the shop
     * @return true iff the user representation of user_email is allowed to manage policies of the shop
     */
    allowedManagePolicies(user_email: string): boolean

    /**
     * @param appointer_email email of the appointer
     * @param appointee_email email of the  appointee
     * @return true if the appointment was successful, or a string representing the error otherwise
     */
    appointNewOwner(appointer_email: string, appointee_email: string): boolean | string

    /**
     * @param appointer_email email of the appointer
     * @param appointee_email email of the  appointee
     * @return true iff the appointment was successful
     */
    appointNewManager(appointer_email: string, appointee_email: string): boolean

    /**
     * @param appointer_email email of the appointer
     * @param appointee_email email of the  appointee
     * @param permissions new permissions for the appointee
     * @return true iff the edit was successful
     */
    editPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean

    /**
     * @param appointer_email email of the appointer
     * @param appointee_email email of the  appointee
     * @param permissions new permissions to add to the appointee
     * @return true iff the addition was successful
     */
    addPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean

    /**
     * @param appointer_email email of the appointer
     * @param appointee_email email of the  appointee
     * @return true iff  the removal was successful
     */
    removeManager(appointer_email: string, appointee_email: string): boolean

    /**
     * @param user_email email of the user trying to get info about the staff
     * @param staff_email (optional) staff email list if trying to access information about specific staff members
     */
    getStaffInfo(user_email: string, staff_email?: string[]): string[] | string

    /**
     * @param user_email email of the user trying to view shop purchase history
     * @return true iff the user representation of user_email is allowed to view shop purchase history
     */
    allowedToViewShopHistory(user_email: string): boolean
}


export class ShopManagementImpl implements ShopManagement {
    private _managers: Manager[];
    private readonly _original_owner: Owner;
    private _owners: Owner[];
    private readonly _shop_id: number;
    private _shop_inventory: ShopInventory;

    constructor(shop_id: number, original_owner: string, shop_inventory?: ShopInventory) {
        this._shop_id = shop_id;
        //placing a temporary value which is immediately replaced
        this._shop_inventory = shop_inventory ? shop_inventory : new ShopInventoryImpl(-1, this);
        this._original_owner = new OwnerImpl(original_owner);
        this._managers = [];
        this._owners = [];
    }

    get managers(): Manager[] {
        return this._managers;
    }

    get original_owner(): Owner {
        return this._original_owner;
    }

    get owners(): Owner[] {
        return this._owners;
    }

    get shop_id(): number {
        return this._shop_id;
    }

    get shop_inventory(): ShopInventory {
        return this._shop_inventory;
    }
    
    set shop_inventory(value: ShopInventory) {
        this._shop_inventory = value;
    }

    private isOwner(user_email: string) {
        return [this._original_owner].concat(this._owners).some((o: Owner) => o.user_email == user_email)
    }

    private isAllowed(user_email: string, action: Action) {
        return this.isOwner(user_email) ||
            this._managers.some((m: Manager) => m.user_email == user_email && m.permissions?.isAllowed(action));
    }
    
    addPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean {
        if (!this.isOwner(appointer_email) || !this.isManager(appointee_email)) return false;
        const manager = this.getManagerByEmail(appointee_email)
        if (manager == null) return false;
        permissions.forEach(p => manager.permissions.editPermission(p, true))
        return true;
    }

    allowedAddItemToShop(user_email: string): boolean {
        return this.isAllowed(user_email, Action.AddItem);
    }

    allowedManagePolicies(user_email: string): boolean {
        return this.isAllowed(user_email, Action.ManagePolicies);
    }

    allowedRemoveItemFromShop(user_email: string): boolean {
        return this.isAllowed(user_email, Action.RemoveItem);
    }

    allowedToViewShopHistory(user_email: string): boolean {
        return this.isAllowed(user_email, Action.ViewShopHistory);
    }

    appointNewManager(appointer_email: string, appointee_email: string): boolean {
        if (this.isManager(appointee_email) || !this.isOwner(appointer_email)) return false;
        this._managers = this.managers.concat([new ManagerImpl(appointee_email, appointer_email)])
        return true;
    }

    appointNewOwner(appointer_email: string, appointee_email: string): boolean | string {
        if (this.isOwner(appointee_email)) {
            logger.Error(`${appointer_email} attempted to appoint ${appointee_email} but the appointee is already an owner`)
            return "Appointer is not an owner"
        }
        if (!this.isOwner(appointer_email)) {
            logger.Error(`${appointer_email} attempted to appoint ${appointee_email} but the appointer is not a owner`)
            return "Appointer is not an owner"
        }
        this._owners = this._owners.concat([new OwnerImpl(appointee_email, appointer_email)])
        this._managers = this._managers.filter(m => m.user_email != appointee_email)
        return true;
    }

    editPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean {
        const result = this._managers.filter((m: Manager) => m.user_email == appointee_email);
        if (result.length == 0) return false;
        const manager = result[0];
        let new_permissions: boolean[] = new Array<boolean>(TotalNumberOfPermissions).fill(false)
        permissions.forEach(a => {new_permissions[a] = true})
        manager.permissions = new ManagerPermissions(new_permissions);
        return true;
    }

    getStaffInfo(user_email: string, staff_id?: string[]): string[] {
        if (!this.isAllowed(user_email, Action.GetStaffInfo)) return [];
        const owners = !(staff_id) ? [this._original_owner].concat(this._owners) :
            [this._original_owner].concat(this._owners)
            .filter(o => staff_id.some(id => id == o.user_email));
        const managers = !(staff_id) ? this._managers :
            this._managers
            .filter((m) => staff_id.some(id => id == m.user_email));
        return owners.map(o => o.toString()).concat(managers.map(m => m.toString()))
    }

    removeManager(appointer_email: string, appointee_email: string): boolean {
        const manager = this.getManagerByEmail(appointee_email);
        if (!manager) return false;
        if (manager.appointer_user_email != appointer_email) return false;
        this._managers = this._managers.filter(m => m.user_email != appointee_email)
        return true;
    }

    private getManagerByEmail(manager_email: string): Manager | null {
        const result = this._managers.filter(m => m.user_email == manager_email);
        if (result.length == 0) return null;
        return result[0];
    }

    private isManager(manager_email: string): boolean {
        return this.getManagerByEmail(manager_email) != null
    }
}