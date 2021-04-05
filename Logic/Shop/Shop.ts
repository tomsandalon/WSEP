import {ShopInventory, ShopInventoryImpl} from "./ShopInventory";
import {ShopManagement, ShopManagementImpl} from "./ShopManagement";
import {Product} from "../ProductHandling/Product";
import {Category} from "../ProductHandling/Category";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchaseType} from "../PurchaseProperties/PurchaseType";
import {logger} from "../Logger";

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

    getAllItems(): Product[]
    getInfo(): string //TODO shop info which we want to display to the user
    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[]
    filter(products: Product[], filters: { filter_name: string, filter_value: string }[]): Product[] //TODO change filter according to req 2.6
    addItem(user_email: string, name: string, description:string, amount: number,
            categories: string[], base_price: number,
            discount_type?: DiscountType, purchase_type?: PurchaseType): boolean | string//TODO calls Shop managment to check permissions and shop inventory to add an item.
    removeItem(user_email: string, product_id: number): boolean | string
    addPolicy(user_email: string, purchase_policy?): boolean | string
    removePolicy(user_email: string, purchase_policy?): boolean | string
    editPolicy(user_email: string, purchase_policy?): boolean | string
    appointNewOwner(appointer_email: string, appointee_email: string): boolean | string
    appointNewManager(appointer_email: string, appointee_email: string): boolean | string
    editPermissions(appointer_email: string, appointee_email: string, permissions: string[]): boolean | string
    addPermissions(appointer_email: string, appointee_email: string, permissions: string[]): boolean | string
    removeManager(appointer_email: string, appointee_email: string): boolean | string
    getStaffInfo(user_email: string, staff_email?: string[]): string[] | string
}

export class ShopImpl implements Shop {
    private _bank_info: string;
    private _description: string;
    private readonly _inventory: ShopInventory;
    private _location: string;
    private readonly _management: ShopManagement;
    private _name: string;
    private readonly _shop_id: number;


    constructor(user_email: string, bank_info: string, description: string, location: string, name: string) {
        this._shop_id = generateId();
        this._bank_info = bank_info;
        this._description = description;
        this._location = location;
        this._name = name;
        this._management = new ShopManagementImpl(this.shop_id, user_email)
        this._inventory = new ShopInventoryImpl(this.shop_id, this._management)
        this._management.shop_inventory = this._inventory;
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

    addItem(user_email: string, name: string, description: string, amount: number, categories: string[], base_price: number,
            discount_type?: DiscountType, purchase_type?: PurchaseType): boolean | string {
        const failure_message: string = `${user_email} failed to add product ${name} to shop ${this._shop_id}`
        const success_message: string = `${user_email} successfully added product ${name} to shop ${this._shop_id}`

        if (!this._management.allowedAddItemToShop(user_email)) {
            logger.Error(`${failure_message}. Permission denied`);
            return "Permission denied";
        }

        const ret = this._inventory.addItem(name, description, amount, categories, base_price,
            discount_type, purchase_type)
        if (!ret) logger.Error(`${failure_message}. Item probably exists`);
        else logger.Info(success_message);
        return ret;
    }

    addPolicy(user_email: string, purchase_policy?): boolean | string {
        return undefined; //TODO
    }

    editPolicy(user_email: string, purchase_policy?): boolean | string {
        return undefined; //TODO
    }

    filter(products: Product[], filters: { filter_name: string, filter_value: string }[]): Product[] {
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
        if (!ret) logger.Error(`${failure_message}. Item doesn't exist.`);
        else logger.Info(success_message);
        return ret;
    }

    removePolicy(user_email: string, purchase_policy?): boolean | string {
        return undefined; //TODO
    }

    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[] {
        const ret = this._inventory.search(name, category, keyword);
        logger.Info(`A search was performed in shop ${this._shop_id}: name: ${name}\tcategory: ${category}\tkeyword: ${keyword}`);
        return ret;
    }

    addPermissions(appointer_email: string, appointee_email: string, permissions: string[]): boolean | string {
        const ret = this._management.addPermissions(appointer_email, appointee_email, permissions);
        if (ret) logger.Info(`Permissions ${permissions} granted to ${appointee_email} by ${appointer_email}`)
        else logger.Error(`Failed to grant ${permissions} to ${appointee_email} by ${appointer_email}`)
        return ret;
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

    editPermissions(appointer_email: string, appointee_email: string, permissions: string[]): boolean | string {
        const ret = this._management.editPermissions(appointer_email, appointee_email, permissions);
        if (ret) logger.Info(`${appointer_email} gave ${appointee_email} permissions: ${permissions}`)
        else logger.Error(`Failed to grant ${permissions} to ${appointee_email} by ${appointer_email}`)
        return ret;
    }

    getStaffInfo(user_email: string, staff_email?: string[]): string[] | string {
        const ret = this._management.getStaffInfo(user_email, staff_email);
        if (ret.length > 0) logger.Info(`${user_email} requested information regarding ${
            staff_email !== undefined ? staff_email : "all the shop staff" 
        }`)
        else logger.Error(`Failed to view all staff by ${user_email}. Permission denied.`)
        return ret;
    }

    removeManager(appointer_email: string, appointee_email: string): boolean | string {
        const ret = this._management.removeManager(appointer_email, appointee_email);
        if (ret) logger.Info(`${appointer_email} removed ${appointee_email} from management`)
        else logger.Error(`${appointer_email} failed to remove ${appointer_email} from management`)
        return ret;
    }
}