import {Filter, Item_Action, ShopInventory, ShopInventoryImpl} from "./ShopInventory";
import {ShopManagement, ShopManagementImpl} from "./ShopManagement";
import {Product} from "../ProductHandling/Product";
import {Category} from "../ProductHandling/Category";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchaseType} from "../PurchaseProperties/PurchaseType";
import {logger} from "../Logger";
import {Action} from "../ShopPersonnel/Permissions";

let id_counter: number = 0;
const generateId = () => id_counter++;

export interface Shop {
    shop_id: number
    name: string
    description: string
    location: string
    bank_info: string
    inventory: ShopInventory
    management: ShopManagement
    is_active: boolean

    /**
     * @Requirement 2.5
     * @return product list of the items currently sold in the store
     */
    getAllItems(): Product[]

    /**
     * @Requirement 2.5
     * @return information regarding the store
     */
    getInfo(): string

    /**
     * @Requirement 2.6
     * @param name Product name
     * @param category Product category
     * @param keyword Keywords
     * @return product list of products list in the shop which match the search parameters
     */
    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[]

    /**
     * @Requirement 2.6
     * @param products Product list to filter from
     * @param filters comprised of @filter_name and @filter_value
     * @filter-param filter_name type of filter
     * @filter-param filter_value the value of the filter
     * @return the products from @param products which match the filter
     */
    filter(products: Product[], filters: Filter[]): Product[]

    /**
     * @Requirement 4.1
     * @param user_email email of the user trying to add
     * @param name name of the product
     * @param description description of the product
     * @param amount amount available for selling
     * @param categories categories of the product
     * @param base_price base price for the product
     * @param discount_type discount type available for the product
     * @param purchase_type purchase purchase type available for the product
     * @return true if the add was successful, or a string containing the error message otherwise
     */
    addItem(user_email: string, name: string, description:string, amount: number,
            categories: string[], base_price: number,
            discount_type: DiscountType, purchase_type: PurchaseType): boolean | string

    /**
     * @Requirement 4.1
     * @param user_email email of the user trying to remove
     * @param product_id product id of the item
     * @return true if the removal was successful, or a string containing the error message otherwise
     */
    removeItem(user_email: string, product_id: number): boolean | string

    /**
     * @Requirement 4.2
     * @param user_email email of the user trying to add
     * @param purchase_policy the policy to add
     * @return true if the add was successful, or a string containing the error message otherwise
     */
    addPolicy(user_email: string, purchase_policy: any): boolean | string

    /**
     * @Requirement 4.2
     * @param user_email email of the user trying to add
     * @param purchase_policy the policy to remove
     * @return true if the removal was successful, or a string containing the error message otherwise
     */
    removePolicy(user_email: string, purchase_policy: any): boolean | string

    /**
     * @Requirement 4.2
     * @param user_email email of the user trying to edit
     * @param purchase_policy the policy to edit
     * @return true if the edit was successful, or a string containing the error message otherwise
     */
    editPolicy(user_email: string, purchase_policy: any): boolean | string

    /**
     * @Requirement 4.3
     * @param appointer_email email of the appointer
     * @param appointee_email email of the appointee
     * @return true if the appointing was successful, or a string containing the error message otherwise
     */
    appointNewOwner(appointer_email: string, appointee_email: string): boolean | string

    /**
     * @Requirement 4.5
     * @param appointer_email email of the appointer
     * @param appointee_email email of the appointee
     * @return true if the appointing was successful, or a string containing the error message otherwise
     */
    appointNewManager(appointer_email: string, appointee_email: string): boolean | string

    /**
     * @Requirement 4.6
     * @param appointer_email email of the appointer
     * @param appointee_email email of the appointee
     * @param permissions permissions to add
     * @return true if the edit was successful, or a string containing the error message otherwise
     */
    editPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean | string

    /**
     * @Requirement 4.6
     * @param appointer_email email of the appointer
     * @param appointee_email email of the appointee
     * @param permissions permission list to add for the appointee
     * @return true if the edit was successful, or a string containing the error message otherwise
     */
    addPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean | string

    /**
     * @Requirement 4.7
     * @param appointer_email email of the appointer
     * @param appointee_email email of the appointee
     * @return true if the removal was successful, or a string containing the error message otherwise
     */
    removeManager(appointer_email: string, appointee_email: string): boolean | string

    /**
     * @Requirement 4.11
     * @param user_email email of the user trying to get info about the purchases
     * @return a string list representation of the shop purchase history, or a string containing the error message otherwise
     */
    getShopHistory(user_email: string): string[] | string

    /**
     * @Requirement 2.5
     * @param user_email email of the user trying to get info about the staff
     * @param staff_email (optional) email of specific staff to view
     * @return staff info if the function was successful, or a string containing the error message otherwise
     */
    getStaffInfo(user_email: string, staff_email?: string[]): string[] | string

    /**
     * @Requirement 6.4
     * @param user_email email of the admin
     * @return a string list representation of the shop purchase history
     */
    adminGetShopHistory(user_email: string): string[]

    /**
     *
     * @param user_email email of the user trying to edit the item
     * @param product_id id of the product
     * @param action the action to perform
     * @param value the value to apply to the action
     * @return true if the edit was successful, or a string containing the error message otherwise
     */
    editProduct(user_email: string, product_id: number, action: Item_Action, value: string | number): string | boolean
}

export class ShopImpl implements Shop {
    private _bank_info: string;
    private _description: string;
    private readonly _inventory: ShopInventory;
    private _location: string;
    private readonly _management: ShopManagement;
    private _name: string;
    private readonly _shop_id: number;
    private readonly _is_active: boolean;

    /**
     * @Requirement 3.2
     * @param user_email
     * @param bank_info
     * @param description
     * @param location
     * @param name
     */
    constructor(user_email: string, bank_info: string, description: string, location: string, name: string) {
        this._shop_id = generateId();
        this._bank_info = bank_info;
        this._description = description;
        this._location = location;
        this._name = name;
        this._management = new ShopManagementImpl(this.shop_id, user_email)
        this._inventory = new ShopInventoryImpl(this.shop_id, this._management, name, bank_info)
        this._management.shop_inventory = this._inventory;
        this._is_active = true;
    }

    get bank_info(): string {
        return this._bank_info;
    }

    set bank_info(value: string) {
        this._bank_info = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get inventory(): ShopInventory {
        return this._inventory;
    }

    get location(): string {
        return this._location;
    }

    set location(value: string) {
        this._location = value;
    }

    get management(): ShopManagement {
        return this._management;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get shop_id(): number {
        return this._shop_id;
    }

    get is_active(): boolean {
        return this._is_active;
    }

    addItem(user_email: string, name: string, description: string, amount: number, categories: string[], base_price: number,
            discount_type: DiscountType, purchase_type: PurchaseType): boolean | string {
        const failure_message: string = `${user_email} failed to add product ${name} to shop ${this._shop_id}`
        const success_message: string = `${user_email} successfully added product ${name} to shop ${this._shop_id}`

        if (!this._management.allowedEditItems(user_email)) {
            logger.Error(`${failure_message}. Permission denied`);
            return "Permission denied";
        }

        const ret = this._inventory.addItem(name, description, amount, categories, base_price,
            discount_type, purchase_type)
        if (typeof ret === "string") {
            const error = `${failure_message}. ` + ret
            logger.Error(error);
            return error
        }
        logger.Info(success_message);
        return ret;
    }

    addPolicy(user_email: string, purchase_policy: any): boolean | string {
        return "We don't have any policies yet :("; //TODO
    }

    editPolicy(user_email: string, purchase_policy: any): boolean | string {
        return "We dont have policies"; //TODO
    }

    filter(products: Product[], filters: Filter[]): Product[] {
        const ret = this._inventory.filter(products, filters);
        logger.Info(`A filter was performed in shop ${this._shop_id} with the following filters: ${filters}`);
        return ret;
    }

    getAllItems(): Product[] {
        const ret = this._inventory.getAllItems();
        logger.Info(`All items were requested for shop ${this._shop_id}`);
        return ret;
    }

    getInfo(): string {
        const ret = `Shop ID: ${this._shop_id}\nShop name: ${this._name}\nDescription: ${this._description}\nLocation:${this._location}`
        logger.Info(`All items were requested for shop ${this._shop_id}`);
        return ret;
    }

    removeItem(user_email: string, product_id: number): boolean | string {
        const failure_message: string = `${user_email} failed to remove product ${product_id} from shop ${this._shop_id}`
        const success_message: string = `${user_email} successfully removed product ${product_id} from shop ${this._shop_id}`
        if (!this._management.allowedRemoveItemFromShop(user_email)) {
            logger.Error(`${failure_message}. Permission denied.`);
            return "Insufficient permissions";
        }
        const ret = this._inventory.removeItem(product_id);
        if (!ret) {
            const error = `${failure_message}. Item doesn't exist.`
            logger.Error(error);
            return error
        }
        logger.Info(success_message);
        return ret;
    }

    removePolicy(user_email: string, purchase_policy: any): boolean | string {
        return "We don't have any policies yet :("; //TODO
    }

    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[] {
        const ret = this._inventory.search(name, category, keyword);
        logger.Info(`A search was performed in shop ${this._shop_id}: ${
            (name) ? `name: ${name}` :
            (category) ? `category: ${category}` :
            (keyword) ? `keyword: ${keyword}` : null}\t number of results: ${ret.length}`)
        return ret;
    }

    addPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean | string {
        const ret = this._management.addPermissions(appointer_email, appointee_email, permissions);
        if (ret) {
            logger.Info(`Permissions ${permissions.map(p => Action[p])} granted to ${appointee_email} by ${appointer_email}`)
            return ret
        }
        const error = `Failed to grant ${permissions.map(p => Action[p])} to ${appointee_email} by ${appointer_email}`
        logger.Error(error)
        return error;
    }

    appointNewManager(appointer_email: string, appointee_email: string): boolean {
        const ret = this._management.appointNewManager(appointer_email, appointee_email);
        if (ret) logger.Info(`${appointee_email} was made manager by ${appointer_email}`)
        else logger.Error(`Failed to make ${appointee_email} a manager by ${appointer_email}`)
        return ret;
    }

    appointNewOwner(appointer_email: string, appointee_email: string): boolean | string {
        const ret = this._management.appointNewOwner(appointer_email, appointee_email);
        if (ret) logger.Info(`${appointee_email} was made manager by ${appointer_email}`)
        else logger.Error(`Failed to make ${appointee_email} a manager by ${appointer_email}`)
        return ret;
    }

    editPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean | string {
        const ret = this._management.editPermissions(appointer_email, appointee_email, permissions);
        if (ret) {
            logger.Info(`${appointer_email} gave ${appointee_email} permissions: ${permissions.map(p => Action[p])}`)
            return ret
        }
        logger.Error(`Failed to grant ${permissions.map(p => Action[p])} to ${appointee_email} by ${appointer_email}`)
        return "Insufficient permissions";
    }

    getStaffInfo(user_email: string, staff_email?: string[]): string[] | string {
        const ret = this._management.getStaffInfo(user_email, staff_email);
        if (Array.isArray(ret)) {
            logger.Info(`${user_email} requested information regarding ${
                staff_email !== undefined ? staff_email : "all the shop staff"
            }`)
            return ret;
        }
        logger.Error(`Failed to view all staff by ${user_email}. Permission denied.`)
        return ret;
    }

    removeManager(appointer_email: string, appointee_email: string): boolean | string {
        const ret = this._management.removeManager(appointer_email, appointee_email);
        if (ret) {
            logger.Info(`${appointer_email} removed ${appointee_email} from management`)
            return ret
        }
        const error = `${appointer_email} failed to remove ${appointer_email} from management`
        logger.Error(error)
        return error;
    }

    getShopHistory(user_email: string): string[] | string {
        const failure_message: string = `${user_email} failed to get shop history from shop ${this._shop_id}`
        const success_message: string = `${user_email} successfully got shop history from shop ${this._shop_id}`

        if (!this._management.allowedToViewShopHistory(user_email)) {
            logger.Error(`${failure_message}. Permission denied.`);
            return "Insufficient permissions";
        }

        const ret = this._inventory.getShopHistory();
        logger.Info(success_message);
        return ret;
    }

    adminGetShopHistory(user_email: string): string[] {
        const ret = this._inventory.getShopHistory()
        logger.Info(`Admin ${user_email} searched for shop ${this.shop_id} order history`)
        return ret;
    }

    toString(): string {
        return `Shop name: ${this._name}\t` +
            `Shop id: ${this._shop_id}\t` +
            `Description: ${this._description}\t` +
            `Status: ${this._is_active ? "Active" : "Inactive"}\t` +
            // `Owner: ${this._management.original_owner.user_email}\t`
            `${this.management.toString()}`
    }

    editProduct(user_email: string, product_id: number, action: Item_Action, value: string | number): string | boolean {
        const failure_message: string = `${user_email} failed to edit product ${product_id} in shop ${this._shop_id}`
        const success_message: string = `${user_email} successfully edited product ${product_id} in shop ${this._shop_id}. 
        EditType: ${action}\tValue: ${String(value)}`

        if (!this._management.allowedEditItems(user_email)) {
            logger.Error(`${failure_message}. Permission denied`);
            return "Permission denied";
        }

        const ret = this._inventory.editItem(product_id, action, value)
        if (typeof ret === "string") {
            const error = `${failure_message}. ` + ret
            logger.Error(error);
            return error
        }
        logger.Info(success_message);
        return ret;
    }
}