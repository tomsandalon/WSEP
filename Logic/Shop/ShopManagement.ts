import {ShopInventory} from "./ShopInventory";
import {Manager} from "../ShopPersonnel/Manager";
import {Owner} from "../ShopPersonnel/Owner";

export interface ShopManagement {
    shop_id: number //TODO remove if unused
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
     * @return true iff the appointment was successful
     */
    appointNewOwner(appointer_email: string, appointee_email: string): boolean

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
    editPermissions(appointer_email: string, appointee_email: string, permissions: string[]): boolean

    /**
     * @param appointer_email email of the appointer
     * @param appointee_email email of the  appointee
     * @param permissions new permissions to add to the appointee
     * @return true iff the addition was successful
     */
    addPermissions(appointer_email: string, appointee_email: string, permissions: string[]): boolean

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
        this._shop_inventory = shop_inventory;
        
        //TODO with users guy
        this._original_owner = undefined; 
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

    private isAllowed(user_email: string, permission: string) {
        return this.isOwner(user_email) || this._managers.some((m: Manager) => m.user_email == user_email && m.permissions.example); //TODO add permission condition to this filter
    }
    
    addPermissions(appointer_email: string, appointee_email: string, permissions: string[]): boolean {
        return false; //TODO with users guy
    }

    allowedAddItemToShop(user_email: string): boolean {
        return this.isAllowed(user_email, "allowedAddItemToShop");
    }

    allowedManagePolicies(user_email: string): boolean {
        return this.isAllowed(user_email, "allowedManagePolicies");
    }

    allowedRemoveItemFromShop(user_email: string): boolean {
        return this.isAllowed(user_email, "allowedRemoveItemFromShop");
    }

    allowedToViewShopHistory(user_email: string): boolean {
        return this.isAllowed(user_email, "allowedToViewShopHistory");
    }

    appointNewManager(appointer_email: string, appointee_email: string): boolean {
        if (this._managers.some((m: Manager) => m.user_email == appointee_email)) return false;
        this._managers = this.managers.concat([undefined]) //TODO with users guy
        return true;
    }

    appointNewOwner(appointer_email: string, appointee_email: string): boolean {
        if (this._owners.some((o: Owner) => o.user_email == appointee_email)) return false;
        this._owners = this._owners.concat([undefined]) //TODO with users guy
        this._managers = this._managers.filter(m => m.user_email != appointee_email)
        return true;
    }

    editPermissions(appointer_email: string, appointee_email: string, permissions: string[]): boolean {
        const result = this._managers.filter((m: Manager) => m.user_email == appointee_email);
        if (result.length == 0) return false;
        const manager = result[0];
        //TODO set permissions here
        return true;
    }

    getStaffInfo(user_email: string, staff_id?: string[]): string[] {
        if (!this.isAllowed(user_email, "allowedGetStaffInfo")) return [];
        const owners = !(staff_id) ? [this._original_owner].concat(this._owners) :
            [this._original_owner].concat(this._owners)
            .filter(o => staff_id.some(id => id == o.user_email));
        const managers = !(staff_id) ? this._managers :
            this._managers
            .filter((m) => staff_id.some(id => id == m.user_email));
        return owners.map(owner => "hi").concat(managers.map(manager => "hi"))  //replace "hi" with get info function
    }

    removeManager(appointer_email: string, appointee_email: string): boolean {
        const find_manager = this._managers.filter(m => m.user_email == appointee_email);
        if (find_manager.length == 0) return false;
        const manager = find_manager[0];
        if (manager.appointer_user_email != appointer_email) return false;
        this._managers = this._managers.filter(m => m.user_email != appointee_email)
        return true;
    }
}