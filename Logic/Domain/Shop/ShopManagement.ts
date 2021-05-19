import {ShopInventory, ShopInventoryImpl} from "./ShopInventory";
import {Manager, ManagerImpl} from "../ShopPersonnel/Manager";
import {Owner, OwnerImpl} from "../ShopPersonnel/Owner";
import {Action, ManagerPermissions, TotalNumberOfPermissions} from "../ShopPersonnel/Permissions";
import {logger} from "../Logger";
import {NotificationAdapter} from "../Notifications/NotificationAdapter";

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
    allowedEditItems(user_email: string): boolean

    /**
     * @param user_email the user to check
     * @return true iff the user is allowed to edit policies
     */
    allowedEditPolicy(user_email: string): boolean

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
     * @return true if the appointment was successful, or a string representing the error otherwise
     */
    appointNewManager(appointer_email: string, appointee_email: string): boolean | string

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
     * @return true if the addition was successful, or a string representing an error otherwise
     */
    addPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean | string

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

    removeOwner(user_email: string, target: string): boolean

    notifyOwners(message: string): void;

    isManager(user_email: string): boolean;

    isOwner(user_email: string): boolean;

    getPermissions(user_email: string): string | string[];

    removePermission(appointer_email: string, appointee_email: string, permission: Action): string | boolean;
}


export class ShopManagementImpl implements ShopManagement {
    private readonly _original_owner: Owner;
    private readonly _shop_id: number;

    constructor(shop_id: number, original_owner: string, shop_inventory?: ShopInventory) {
        this._shop_id = shop_id;
        //placing a temporary value which is immediately replaced
        this._shop_inventory = shop_inventory ? shop_inventory : new ShopInventoryImpl(-1, this, "", "");
        this._original_owner = new OwnerImpl(original_owner);
        this._managers = [];
        this._owners = [];
    }

    private _managers: Manager[];

    get managers(): Manager[] {
        return this._managers;
    }

    private _owners: Owner[];

    get owners(): Owner[] {
        return this._owners;
    }

    allowedEditPolicy(user_email: string): boolean {
        return this.isAllowed(user_email, Action.EditPolicies);
    }

    private _shop_inventory: ShopInventory;

    get shop_inventory(): ShopInventory {
        return this._shop_inventory;
    }

    set shop_inventory(value: ShopInventory) {
        this._shop_inventory = value;
    }

    get original_owner(): Owner {
        return this._original_owner;
    }

    get shop_id(): number {
        return this._shop_id;
    }

    addPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean | string {
        if (!this.isOwner(appointer_email))
            return `${appointer_email} is not an owner`;
        if (!this.isManager(appointee_email))
            return `${appointee_email} is not a manager`
        const manager = this.getManagerByEmail(appointee_email) as Manager
        if (manager.appointer_user_email != appointer_email)
            return `${appointer_email} is not the appointer of ${appointee_email}`
        permissions.forEach(p => manager.permissions.editPermission(p, true))
        return true;
    }

    removePermission(appointer_email: string, appointee_email: string, permission: Action) {
        if (!this.isOwner(appointer_email))
            return `${appointer_email} is not an owner`;
        if (!this.isManager(appointee_email))
            return `${appointee_email} is not a manager`
        const manager = this.getManagerByEmail(appointee_email) as Manager
        if (manager.appointer_user_email != appointer_email)
            return `${appointer_email} is not the appointer of ${appointee_email}`
        manager.permissions.editPermission(permission, false)
        return true;
    }

    allowedEditItems(user_email: string): boolean {
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

    appointNewManager(appointer_email: string, appointee_email: string): boolean | string {
        if (this.isManager(appointee_email)) {
            logger.Error(`${appointer_email} attempted to appoint ${appointee_email} but the appointee is already a manager`)
            return "Appointer is not an owner"
        }
        if (this.isOwner(appointee_email)) {
            logger.Error(`${appointer_email} attempted to appoint ${appointee_email} but the appointee is already an owner`)
            return "Appointer is not an owner"
        }
        if (!this.isOwner(appointer_email)) {
            logger.Error(`${appointer_email} attempted to appoint ${appointee_email} but the appointer is not a owner`)
            return "Appointer is not an owner"
        }

        this._managers = this._managers.concat([new ManagerImpl(appointee_email, appointer_email)])
        const original = this.owners.find(o => o.user_email == appointer_email)
        if (original && original.appointees_emails().every(mail => mail != appointee_email)) {
            original.appointed_managers = original.appointed_managers.concat([appointee_email])
        }
        return true;
    }

    appointNewOwner(appointer_email: string, appointee_email: string): boolean | string {
        if (this.isOwner(appointee_email)) {
            logger.Error(`${appointer_email} attempted to appoint ${appointee_email} but the appointee is already an owner`)
            return "Appointee is already an owner"
        }
        if (!this.isOwner(appointer_email)) {
            logger.Error(`${appointer_email} attempted to appoint ${appointee_email} but the appointer is not a owner`)
            return "Appointer is not an owner"
        }
        this._owners = this._owners.concat([new OwnerImpl(appointee_email, appointer_email)])
        this._managers = this._managers.filter(m => m.user_email != appointee_email)
        const original = this.owners.find(o => o.user_email == appointer_email)
        if (original) {
            original.appointed_owners = original.appointed_owners.concat([appointee_email])
        }
        return true;
    }

    editPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean {
        const manager = this._managers.find((m: Manager) => m.user_email == appointee_email);
        if (!manager) return false;
        let new_permissions: boolean[] = new Array<boolean>(TotalNumberOfPermissions).fill(false)
        permissions.forEach(a => {
            new_permissions[a] = true
        })
        manager.permissions = new ManagerPermissions(new_permissions);
        return true;
    }

    getStaffInfo(user_email: string, staff_id?: string[]): string[] | string {
        if (!this.isAllowed(user_email, Action.GetStaffInfo)) return `${user_email} is not allowed to check for staff information`;
        const owners = !(staff_id) ? [this._original_owner].concat(this._owners) :
            [this._original_owner].concat(this._owners)
                .filter(o => staff_id.some(id => id == o.user_email));
        const managers = !(staff_id) ? this._managers :
            this._managers
                .filter((m) => staff_id.some(id => id == m.user_email));
        return [
            JSON.stringify({
                owners: owners.map(o => o.toString()),
                managers: managers.map(m => m.toString())
            })
        ]
    }

    removeManager(appointer_email: string, appointee_email: string): boolean {
        const manager = this.getManagerByEmail(appointee_email);
        if (!manager) return false;
        if (manager.appointer_user_email != appointer_email) return false;
        this._managers = this._managers.filter(m => m.user_email != appointee_email)
        NotificationAdapter.getInstance().notify(appointee_email,
            `You have been demoted by ${appointer_email}`
        )
        return true;
    }

    removeOwner(user_email: string, target: string): boolean {
        if (!this.isOwner(user_email) || !this.isOwner(target)) return false;
        const ownerToRemove = this.getOwnerByEmail(target);
        if (!ownerToRemove) return false;
        if (ownerToRemove.appointer_email != user_email) return false;
        // this._owners = this.owners.filter(m => m.user_email != target)
        NotificationAdapter.getInstance().notify(target,
            `You have been demoted by ${user_email}`)
        this.removeAllSubordinates(target, user_email)
        return true;
    }

    removeManagerByRecursion(user_email: string, target: string) {
        const manager = this.getManagerByEmail(target);
        if (!manager) return
        this._managers = this._managers.filter(m => m.user_email != target)
        NotificationAdapter.getInstance().notify(target,
            `You have been demoted by ${user_email}`
        )
    }

    removeOwnerByRecursion(user_email: string, target: string) {
        const ownerToRemove = this.getOwnerByEmail(target);
        if (!ownerToRemove) return;
        this._owners = this.owners.filter(o => o.user_email != target)
        this.removeAllSubordinates(target, user_email)
        NotificationAdapter.getInstance().notify(target,
            `You have been demoted by ${user_email}`)
    }

    toString(): string {
        return JSON.stringify({
            shop_id: this._shop_id,
            original_owner: this.original_owner,
            managers: this.managers,
            owners: this.owners
        })
        // return `Original owner: ${this.original_owner.user_email}\t` +
        //     `Owners: ${this.owners.reduce((acc, curr) => acc + ", " + curr.user_email, "")}\t` +
        //     `Managers: ${this.managers.reduce((acc, curr) => acc + ", " + curr.user_email, "")}`
    }

    private removeAllSubordinates(user_email: string, original: string) {
        this.managers.filter(m => m.appointer_user_email == user_email)
            .forEach(m => this.removeManagerByRecursion(m.user_email, original))
        this.owners.filter(o => o.appointer_email == user_email)
            .forEach(o => this.removeOwnerByRecursion(o.user_email, original))
    }

    isOwner(user_email: string) {
        return [this._original_owner].concat(this._owners).some((o: Owner) => o.user_email == user_email)
    }

    private getOwnerByEmail(user_email: string) {
        return [this._original_owner].concat(this._owners).find((o: Owner) => o.user_email == user_email)
    }

    private isAllowed(user_email: string, action: Action) {
        return this.isOwner(user_email) ||
            this._managers.some((m: Manager) => m.user_email == user_email && m.permissions?.isAllowed(action));
    }

    private getManagerByEmail(manager_email: string): Manager | null {
        const result = this._managers.find(m => m.user_email == manager_email);
        if (!result) return null;
        return result;
    }

    isManager(manager_email: string): boolean {
        return this.getManagerByEmail(manager_email) != null
    }

    notifyOwners(message: string): void {
        [this.original_owner].concat(this.owners).forEach(
            o => NotificationAdapter.getInstance().notify(o.user_email, message)
        )
    }

    getPermissions(user_email: string): string | string[] {
        if (this.isOwner(user_email)) return [JSON.stringify(new ManagerPermissions([true, true, true, true, true, true]))]
        const manager = this.getManagerByEmail(user_email)
        if (manager) return [JSON.stringify(manager.permissions)]
        return `${user_email} is not in shop ${this.shop_id} management`
    }
}