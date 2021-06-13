import {Filter, Item_Action, Purchase_Type, ShopInventory, ShopInventoryImpl} from "./ShopInventory";
import {ShopManagement, ShopManagementImpl} from "./ShopManagement";
import {Product} from "../ProductHandling/Product";
// import {PurchaseType} from "../PurchaseProperties/PurchaseType";
import {logger} from "../Logger";
import {Action, Permissions} from "../ShopPersonnel/Permissions";
import {DiscountHandler} from "./DiscountPolicy/DiscountHandler";
import {Discount} from "./DiscountPolicy/Discount";
import {PurchaseCondition} from "./PurchasePolicy/PurchaseCondition";
import {Operator} from "./PurchasePolicy/CompositeCondition";
import {Condition} from "./DiscountPolicy/ConditionalDiscount";
import {NumericOperation} from "./DiscountPolicy/NumericCompositionDiscount";
import {LogicComposition} from "./DiscountPolicy/LogicCompositionDiscount";
// import {DiscountPolicyHandler} from "../PurchaseProperties/DiscountPolicyHandler";
import {OfferDTO, ShopRich} from "../../DataAccess/Getters"
import {UserImpl} from "../Users/User";

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
     * @param purchase_type purchase purchase type available for the product
     * @return true if the add was successful, or a string containing the error message otherwise
     */
    addItem(user_email: string, name: string, description: string, amount: number,
            categories: string[], base_price: number, purchase_type?: Purchase_Type): boolean | string

    /**
     * @Requirement 4.1
     * @param user_email email of the user trying to remove
     * @param product_id product id of the item
     * @return true if the removal was successful, or a string containing the error message otherwise
     */
    removeItem(user_email: string, product_id: number): boolean | string

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
    editProduct(user_email: string, product_id: number, action: Item_Action, value: string): string | boolean

    /**
     * @param user_email
     * @param discount
     */
    addDiscount(user_email: string, discount: Discount): boolean | string

    /**
     * @param user_email
     * @param discountId
     */
    removeDiscount(user_email: string, discountId: number): string | boolean

    showAllDiscounts(user_email: String): string

    displayItems(): string

    showAllDiscounts(user_email: string): string

    addPolicy(user_email: string, policy: PurchaseCondition): string[] | string

    removePolicy(user_email: string, id: number): boolean | string

    showAllPolicies(user: string): string

    composePurchasePolicies(user_email: string, id1: number, id2: number, operator: Operator): string | boolean

    removeOwner(user_email: string, target: string): string | boolean;

    addConditionToDiscount(user_email: string, discount_id: number, condition: Condition, condition_param: string): string | boolean;

    addNumericCompositionDiscount(user_email: string, operation: NumericOperation, d_id1: number, d_id2: number): string | boolean;

    addLogicCompsoitionDiscount(user_email: string, operation: LogicComposition, d_id1: number, d_id2: number): string | boolean;

    getAllDiscounts(user_id: number): string | string[];

    getAllPurchasePolicies(user_id: number): string | string[];

    isManager(user_email: string): boolean;

    isOwner(user_email: string): boolean;

    getPermissions(user_email: string): string | string[];

    getAllCategories(): string | string[];

    removePermission(user_email: string, target_email: string, action: Action): string | boolean;

    rateProduct(user_email: string, user_id: number, product_id: number, rating: number): string | boolean;

    getAllManagementEmail(): string[];

    getRealPermissions(user_email: string): Permissions;

    addPurchaseType(user_email: string, purchase_type: Purchase_Type): string | boolean;

    getActiveOffers(user_email: string): string | string[];

    acceptOfferAsManagement(user_email: string, offer_id: number): string | boolean;

    denyOfferAsManagement(user_email: string, offer_id: number): string | boolean;

    counterOfferAsManagement(user_email: string, offer_id: number, new_price_per_unit: number): string | boolean;

    removePurchaseType(user_email: string, purchase_type: Purchase_Type): string | boolean;
}

export class ShopImpl implements Shop {
    private readonly _inventory: ShopInventory;
    private readonly _shop_id: number;
    private readonly _management: ShopManagement;
    private readonly _is_active: boolean;

    /**
     * @Requirement 3.2
     * @param shop_id
     * @param bank_info
     * @param description
     * @param location
     * @param name
     * @param management
     * @param inventory
     * @param is_active
     */
    constructor(shop_id: number, bank_info: string, description: string, location: string, name: string, management: ShopManagement, inventory: ShopInventory, is_active: boolean) {
        this._shop_id = shop_id
        this._bank_info = bank_info;
        this._description = description;
        this._location = location;
        this._name = name;
        this._management = management
        this._inventory = inventory
        this._is_active = is_active;
    }
    // static check(user_email: string, bank_info: string, description: string, location: string, name: string): string | ShopImpl {
    //     if (bank_info.length == 0) return "Bank info can't be empty"
    //     if (location.length == 0) return "Location can't be empty"
    //     if (name.length == 0) return "Name can't be empty"
    //     return ShopImpl.create(user_email, bank_info, description, location, name)
    // }

    private _bank_info: string;

    get bank_info(): string {
        return this._bank_info;
    }

    set bank_info(value: string) {
        this._bank_info = value;
    }

    private _description: string;

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    private _location: string;

    get location(): string {
        return this._location;
    }

    set location(value: string) {
        this._location = value;
    }

    private _name: string;

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get inventory(): ShopInventory {
        return this._inventory;
    }

    get management(): ShopManagement {
        return this._management;
    }

    get shop_id(): number {
        return this._shop_id;
    }

    get is_active(): boolean {
        return this._is_active;
    }

    static resetIDs = () => {
        id_counter = 0
        DiscountHandler.discountCounter = 0
    }

    static create(user_email: string, bank_info: string, description: string, location: string, name: string) {
        // const result = this.check(user_email, bank_info, description, location, name)
        // if (typeof  result == "string") return result
        let _shop_id = generateId();
        let _bank_info = bank_info;
        let _description = description;
        let _location = location;
        let _name = name;
        let _management = new ShopManagementImpl(_shop_id, user_email)
        let _inventory = new ShopInventoryImpl(_shop_id, _management, name, bank_info, [Purchase_Type.Immediate], [])
        _management.shop_inventory = _inventory;
        let _is_active = true;
        return new ShopImpl(_shop_id, _bank_info, _description, _location, _name, _management, _inventory, _is_active)
    }

    static createFromDB(entry: { shop_id: any; bank_info: string; name: string; description: string; active: any; location: string; original_owner: string }) {
        id_counter = Math.max(id_counter, entry.shop_id + 1)
        let _management = new ShopManagementImpl(entry.shop_id, entry.original_owner)
        let _inventory = new ShopInventoryImpl(entry.shop_id, _management, entry.name, entry.bank_info, [Purchase_Type.Immediate], [])
        return new ShopImpl(entry.shop_id, entry.bank_info, entry.description, entry.location, entry.name, _management, _inventory, entry.active);
    }

    static shopsAreEquals(s1: Shop, s2: Shop) {
        return s1.shop_id == s2.shop_id &&
            s1.name == s2.name &&
            s1.location == s2.location &&
            s1.bank_info == s2.bank_info &&
            s1.description == s2.description &&
            ShopInventoryImpl.shopsAreEqual(s1.inventory, s2.inventory) &&
            ShopManagementImpl.shopsAreEqual(s1.management, s2.management)
    }

    displayItems(): string {
        return JSON.stringify({
            shopID: this.shop_id,
            name: this.name,
            products: this.inventory.displayItems(),
        })
    }

    addItem(user_email: string, name: string, description: string, amount: number, categories: string[], base_price: number,
            purchase_type?: Purchase_Type): boolean | string {
        const failure_message: string = `${user_email} failed to add product ${name} to shop ${this._shop_id}`
        const success_message: string = `${user_email} successfully added product ${name} to shop ${this._shop_id}`

        if (!this._management.allowedEditItems(user_email)) {
            logger.Error(`${failure_message}. Permission denied`);
            return "Permission denied";
        }

        const ret = this._inventory.addItem(name, description, amount, categories, base_price, purchase_type)
        if (typeof ret === "string") {
            const error = `${failure_message}. ` + ret
            logger.Error(error);
            return error
        }
        logger.Info(success_message);
        return ret;
    }

    addPolicy(user_email: string, policy: PurchaseCondition): string[] | string {
        if (!this.management.allowedEditPolicy(user_email)) {
            logger.Error(`Permission denied. ${user_email} is not allowed to edit policies`)
            return `Permission denied. ${user_email} is not allowed to edit policies`
        }
        this.inventory.addPurchasePolicy(policy)
        logger.Info(`Added purchase policy: ${JSON.stringify(policy)}`)
        return [];
    }

    removePolicy(user_email: string, id: number): boolean | string {
        if (!this.management.allowedEditPolicy(user_email)) {
            logger.Error(`Permission denied. ${user_email} is not allowed to edit policies`)
            return `Permission denied. ${user_email} is not allowed to edit policies`
        }
        const result = this.inventory.removePurchasePolicy(id)
        if (result) logger.Info(`Discount ${id} removed`)
        else logger.Error(`Discount ${id} doesn't exist`)
        return result;
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

    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[] {
        if (!this._is_active) return []
        const ret = this._inventory.search(name, category, keyword);
        logger.Info(`A search was performed in shop ${this._shop_id}: ${
            (name) ? `name: ${name}` :
                (category) ? `category: ${category}` :
                    (keyword) ? `keyword: ${keyword}` : null}\t number of results: ${ret.length}`)
        return ret;
    }

    addPermissions(appointer_email: string, appointee_email: string, permissions: Action[]): boolean | string {
        const ret = this._management.addPermissions(appointer_email, appointee_email, permissions);
        if (typeof ret == "boolean") {
            logger.Info(`Permissions ${permissions.map(p => Action[p])} granted to ${appointee_email} by ${appointer_email}`)
            return ret
        }
        const error = `Failed to grant ${permissions.map(p => Action[p])} to ${appointee_email} by ${appointer_email}. ${ret}`
        logger.Error(error)
        return error;
    }

    removePermission(appointer_email: string, appointee_email: string, permission: Action): string | boolean {
        const ret = this._management.removePermission(appointer_email, appointee_email, permission);
        if (typeof ret == "boolean") {
            logger.Info(`Permissions ${permission} removed from ${appointee_email} by ${appointer_email}`)
            return ret
        }
        const error = `Failed to remove permission ${permission} from ${appointee_email} by ${appointer_email}. ${ret}`
        logger.Error(error)
        return error;
    }

    appointNewManager(appointer_email: string, appointee_email: string): boolean | string {
        const ret = this._management.appointNewManager(appointer_email, appointee_email);
        if (typeof ret == "boolean") {
            logger.Info(`${appointee_email} was made manager by ${appointer_email}`)
            this.inventory.addManagementToExistingOffers(appointee_email)
        } else logger.Error(`Failed to make ${appointee_email} a manager by ${appointer_email}`)
        return ret;
    }

    appointNewOwner(appointer_email: string, appointee_email: string): boolean | string {
        const ret = this._management.appointNewOwner(appointer_email, appointee_email);
        if (typeof ret == "boolean") logger.Info(`${appointee_email} was made manager by ${appointer_email}`)
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
        return JSON.stringify({
            shop_id: this._shop_id,
            bank_info: this.bank_info,
            description: this._description,
            location: this.location,
            name: this.name,
            management: this.management.toString(),
            inventory: this.inventory.toString(),
            is_active: this.is_active
        })

        // this._shop_id = generateId();
        // this._bank_info = bank_info;
        // this._description = description;
        // this._location = location;
        // this._name = name;
        // this._management = new ShopManagementImpl(this.shop_id, user_email)
        // this._inventory = new ShopInventoryImpl(this.shop_id, this._management, name, bank_info)
        // this._management.shop_inventory = this._inventory;
        // this._is_active = true;
        // return `Shop name: ${this._name}\t` +
        //     `Shop id: ${this._shop_id}\t` +
        //     `Description: ${this._description}\t` +
        //     `Status: ${this._is_active ? "Active" : "Inactive"}\n` +
        //     `${this.management.toString()}\n\n` +
        //     `${this.inventory.toString()}\n\n`
    }

    editProduct(user_email: string, product_id: number, action: Item_Action, value: string): string | boolean {
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

    addPurchaseType(user_email: string, purchase_type: Purchase_Type) {
        if (!this.management.allowedEditPolicy(user_email)) {
            const error = `${user_email} tried to add purchase type but doesn't have permissions to do so`
            logger.Error(error);
            return error
        }
        const ret = this.inventory.addPurchaseType(purchase_type)
        if (typeof ret == "string") {
            logger.Error(`${user_email} failed to add purchase type as ${ret}`)
            return ret
        }
        logger.Info(`${user_email} added purchase type successfully`)
        return true
    }

    removeOwner(user_email: string, target: string): string | boolean {
        const ret = this._management.removeOwner(user_email, target);
        if (ret) {
            logger.Info(`${user_email} removed ${target} from management`)
            return ret
        }
        const error = `${user_email} failed to remove ${target} from management`
        logger.Error(error)
        return error;
    }

    addDiscount(user_email: string, discount: Discount): boolean | string {
        if (!this.management.allowedEditPolicy(user_email)) {
            logger.Error(`Permission denied. ${user_email} is not allowed to edit policies`)
            return `Permission denied. ${user_email} is not allowed to edit policies`
        }
        this.inventory.addDiscount(discount)
        logger.Info(`Added discount: ${JSON.stringify(discount)}`)
        return true;
    }

    removeDiscount(user_email: string, discountId: number): string | boolean {
        if (!this.management.allowedEditPolicy(user_email)) {
            logger.Error(`Permission denied. ${user_email} is not allowed to edit policies`)
            return `Permission denied. ${user_email} is not allowed to edit policies`
        }
        const result = this.inventory.removeDiscount(discountId)
        if (result) logger.Info(`Discount ${discountId} removed`)
        else logger.Error(`Discount ${discountId} doesn't exist`)
        return result;
    }

    showAllDiscounts(user_email: string): string {
        logger.Info(user_email + " requested to view all discounts")
        return this.inventory.getAllDiscounts()
    }

    showAllPolicies(user: string): string {
        logger.Info(user + " requested to view all discounts")
        return this.inventory.getAllPurchasePolicies()
    }

    composePurchasePolicies(user_email: string, id1: number, id2: number, operator: Operator): string | boolean {
        if (!this.management.allowedEditPolicy(user_email)) {
            logger.Error(`Permission denied. ${user_email} is not allowed to edit policies`)
            return `Permission denied. ${user_email} is not allowed to edit policies`
        }
        const result = this.inventory.composePurchasePolicies(id1, id2, operator)
        if (result) logger.Info(`Discounts merged`)
        else logger.Error(`Failed to merge discounts`)
        return result;
    }

    addConditionToDiscount(user_email: string, discount_id: number, condition: Condition, condition_param: string): string | boolean {
        if (!this.management.allowedEditPolicy(user_email)) {
            logger.Error(`Permission denied. ${user_email} is not allowed to edit policies`)
            return `Permission denied. ${user_email} is not allowed to edit policies`
        }
        const result = this.inventory.addConditionToDiscount(discount_id, condition, condition_param)
        if (result) logger.Info(`Discounts merged`)
        else logger.Error(`Failed to merge discounts`)
        return result;
    }

    addNumericCompositionDiscount(user_email: string, operation: NumericOperation, d_id1: number, d_id2: number): string | boolean {
        if (!this.management.allowedEditPolicy(user_email)) {
            logger.Error(`Permission denied. ${user_email} is not allowed to edit policies`)
            return `Permission denied. ${user_email} is not allowed to edit policies`
        }
        const result = this.inventory.addNumericCompositionDiscount(operation, d_id1, d_id2)
        if (result) logger.Info(`Discounts merged`)
        else logger.Error(`Failed to merge discounts`)
        return result;
    }

    addLogicCompsoitionDiscount(user_email: string, operation: LogicComposition, d_id1: number, d_id2: number): string | boolean {
        if (!this.management.allowedEditPolicy(user_email)) {
            logger.Error(`Permission denied. ${user_email} is not allowed to edit policies`)
            return `Permission denied. ${user_email} is not allowed to edit policies`
        }
        const result = this.inventory.addLogicCompositionDiscount(operation, d_id1, d_id2)
        if (result) logger.Info(`Discounts merged`)
        else logger.Error(`Failed to merge discounts`)
        return result;
    }

    getAllDiscounts(user_id: number): string | string[] {
        logger.Info(`${user_id} requested all discounts`)
        return [this.inventory.getAllDiscounts()]
    }

    getAllPurchasePolicies(user_id: number): string | string[] {
        logger.Info(`${user_id} requested all policies`)
        return [this.inventory.getAllPurchasePolicies()]
    }

    isManager(user_email: string): boolean {
        logger.Info(`Checked if ${user_email} is manager`)
        return this.management.isManager(user_email)
    }

    isOwner(user_email: string): boolean {
        logger.Info(`Checked if ${user_email} is owner`)
        return this.management.isOwner(user_email)
    }

    getPermissions(user_email: string): string | string[] {
        logger.Info(`Checked for ${user_email} permissions`)
        return this.management.getPermissions(user_email)
    }

    getAllCategories(): string | string[] {
        return this.inventory.getAllItems(true).flatMap(item => item.category.map(c => c.name))
    }

    rateProduct(user_email: string, user_id: number, product_id: number, rating: number): string | boolean {
        if (!this.inventory.getAllItems(true).some(p => p.product_id == product_id)) {
            logger.Error(`${user_email} attempted to rate a non existing product ${product_id}`)
            return `${user_email} attempted to rate a non existing product ${product_id}`
        }
        if (!this.inventory.hasPurchased(user_id, product_id)) {
            logger.Error(`${user_email} attempted to rate product ${product_id} which it never purchased`)
            return `${user_email} attempted to rate product ${product_id} which it never purchased`
        }
        if (this.inventory.alreadyRated(product_id, user_email)) {
            logger.Error(`${user_email} already rated product ${product_id}`)
            return `${user_email} already rated product ${product_id}`
        }
        this.inventory.rateProduct(product_id, rating, user_email)
        return true;
    }

    getAllManagementEmail(): string[] {
        return this.management.getAllManagementEmails();
    }

    getRealPermissions(user_email: string): Permissions {
        return this.management.getRealPermissions(user_email);
    }

    addManagement(owners: {
        owner_email: string,
        appointer_email: string
    }[], managers: {
        manager_email: string,
        appointer_email: string,
        permissions: number[]
    }[]) {
        this.management.addManagement(owners, managers)
    }

    async addInventoryFromDB(inventory: ShopRich): Promise<void> {
        await this.inventory.addInventoryFromDB(inventory)
    }

    getActiveOffers(user_email: string): string | string[] {
        if (!this.management.isManager(user_email) && !this.management.isOwner(user_email)) return `${user_email} is not in management and cannot get active offers`
        return this.inventory.getActiveOffers()
    }

    acceptOfferAsManagement(user_email: string, offer_id: number): string | boolean {
        if (!this.management.isManager(user_email) && !this.management.isOwner(user_email)) return `${user_email} is not in management and cannot accept active offers`
        return this.inventory.acceptOfferAsManagement(user_email, offer_id)
    }

    denyOfferAsManagement(user_email: string, offer_id: number): string | boolean {
        if (!this.management.isManager(user_email) && !this.management.isOwner(user_email)) return `${user_email} is not in management and cannot decline active offers`
        return this.inventory.denyOfferAsManagement(user_email, offer_id)
    }

    counterOfferAsManagement(user_email: string, offer_id: number, new_price_per_unit: number): string | boolean {
        if (!this.management.isManager(user_email) && !this.management.isOwner(user_email)) return `${user_email} is not in management and cannot make counter offers`
        return this.inventory.counterOfferAsManagement(user_email, offer_id, new_price_per_unit)
    }

    removePurchaseType(user_email: string, purchase_type: Purchase_Type): string | boolean {
        if (!this.management.allowedEditPolicy(user_email)) {
            const error = `${user_email} tried to remove purchase type but doesn't have permissions to do so`
            logger.Error(error);
            return error
        }
        const ret = this.inventory.removePurchasePolicy(purchase_type)
        if (typeof ret == "string") {
            logger.Error(`${user_email} failed to remove purchase type as ${ret}`)
            return ret
        }
        if (!ret) {
            logger.Error(`${user_email} failed to remove purchase type as it doesn't exist in the shop`)
        } else {
            logger.Info(`${user_email} removed purchase type successfully`)
        }
        return true
    }


    async addOffersToShopFromDB(offers: OfferDTO[], users: UserImpl[], products: Product[]): Promise<void> {
        return this.inventory.addOffersToShopFromDB(offers, users, products)
    }

    static same_offers(shops1: Shop, shops2: Shop) {
        return ShopInventoryImpl.same_offers(shops1.inventory, shops2.inventory)
    }
}