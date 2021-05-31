import {UserImpl} from "./Users/User";
import {Shop, ShopImpl} from "./Shop/Shop";
import {LoginImpl} from "./Users/Login";
import {RegisterImpl} from "./Users/Register";
import {Filter, id_counter, Item_Action, Purchase_Type} from "./Shop/ShopInventory";
import {Action, ManagerPermissions, permission_to_numbers} from "./ShopPersonnel/Permissions";
import {ProductImpl} from "./ProductHandling/Product";
// import {PurchaseType} from "./PurchaseProperties/PurchaseType";
import {PurchaseImpl} from "./ProductHandling/Purchase";
import {ConditionType, SimpleCondition} from "./Shop/PurchasePolicy/SimpleCondition";
import {Operator} from "./Shop/PurchasePolicy/CompositeCondition";
import {SimpleDiscount} from "./Shop/DiscountPolicy/SimpleDiscount";
import {Condition} from "./Shop/DiscountPolicy/ConditionalDiscount";
import {NumericOperation} from "./Shop/DiscountPolicy/NumericCompositionDiscount";
import {LogicComposition} from "./Shop/DiscountPolicy/LogicCompositionDiscount";
import {NotificationAdapter} from "./Notifications/NotificationAdapter";
import {logger} from "./Logger";
import {Authentication} from "./Users/Authentication";
import {
    AddDiscount,
    AddItemToBasket,
    AddProduct,
    AddPurchasePolicy,
    AddShop,
    AppointManager,
    AppointOwner,
    DeleteItemInBasket,
    RateProduct,
    RegisterUser,
    RemainingManagement,
    removeDiscount,
    RemoveManager,
    RemoveProduct,
    removePurchasePolicy,
    UpdateItemInBasket,
    UpdatePermissions
} from "../DataAccess/API";
import {DiscountHandler} from "./Shop/DiscountPolicy/DiscountHandler";
import {PublisherImpl} from "./Notifications/PublisherImpl";
import {
    GetNotifications,
    GetPurchases,
    GetShopsInventory,
    GetShopsManagement,
    GetShopsRaw,
    GetUsers
} from "../DataAccess/Getters";
import {UserPurchaseHistoryImpl} from "./Users/UserPurchaseHistory";

export enum SearchTypes {
    name,
    category,
    keyword
}

export interface System {

    openSession(): number

    closeSession(user_id: number): void

    performRegister(user_email: string, password: string, age?: number): boolean

    performLogin(user_email: string, password: string): string | number

    performGuestLogin(): number

    logout(user_id: number): string | boolean

    displayShops(): string | string[]

    getItemsFromShop(shop_id: number): any

    searchItemFromShops(search_type: SearchTypes, search_term: string): any

    filterSearch(search_type: SearchTypes, search_term: string, filters: Filter[]): string[]

    addItemToBasket(user_id: number, product_id: number, shop_id: number, amount: number): string | void

    displayShoppingCart(user_id: number): string | string[][]

    editShoppingCart(user_id: number, shop_id: number, product_id: number, amount: number): string | void

    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string): Promise<string | boolean>

    purchaseCart(user_id: number, payment_info: string): Promise<string | boolean>

    addShop(user_id: number, name: string, description: string,
            location: string, bank_info: string): number | string

    userOrderHistory(user_id: number): string | string[]

    addProduct(user_id: number, shop_id: number, name: string, description: string, amount: number, categories: string[],
               base_price: number, purchase_type?: Purchase_Type): boolean | string

    removeProduct(user_id: number, shop_id: number, product_id: number): boolean | string

    appointManager(user_id: number, shop_id: number, appointee_user_email: string): string | boolean

    removeManager(user_id: number, shop_id: number, target: string): string | boolean

    appointOwner(user_id: number, shop_id: number, appointee_user_email: string): string | boolean

    removeOwner(user_id: number, shop_id: number, target: string): string | boolean

    addPermissions(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean

    editPermissions(user_id: number, shop_id: number, target_email: string, actions: Action[]): string | boolean

    removePermission(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean

    displayStaffInfo(user_id: number, shop_id: number): string[] | string

    shopOrderHistory(user_id: number, shop_id: number): string | string[]

    adminDisplayShopHistory(admin: number, shop_id: number): string | string[]

    adminDisplayUserHistory(admin: number, target_id: number): string | string[]

    editProduct(user_id: number, shop_id: number, product_id: number, action: Item_Action, value: string): string | boolean

    getShopInfo(shop_id: number): string | string[]

    addPurchasePolicy(user_id: number, shop_id: number, condition: ConditionType, value: string): string[] | string

    removePurchasePolicy(user_id: number, shop_id: number, policy_id: number): string | boolean

    composePurchasePolicy(user_id: number, shop_id: number, policy_id1: number, policy_id2: number, operator: Operator): boolean | string

    getAllPurchasePolicies(user_id: number, shop_id: number): string | string[]

    addDiscount(user_id: number, shop_id: number, value: number): string | boolean

    addConditionToDiscount(user_id: number, shop_id: number, id: number, condition: Condition, condition_param: string): string | boolean

    addNumericComposeDiscount(user_id: number, shop_id: number, operation: NumericOperation, d_id1: number, d_id2: number): string | boolean

    addLogicComposeDiscount(user_id: number, shop_id: number, operation: LogicComposition, d_id1: number, d_id2: number): string | boolean

    removeDiscount(user_id: number, shop_id: number, id: number): string | boolean

    getAllDiscounts(user_id: number, shop_id: number): string | string[]

    getAllShops(user_id: number): string | string[]

    isAdmin(user_id: number): string | boolean

    isManager(user_id: number): string | boolean

    isOwner(user_id: number): string | boolean

    getManagingShops(user_id: number): string | string[]

    getPermissions(user_id: number, shop_id: number): string | string[]

    getAllUsers(user_id: number): string | string[]

    isLoggedIn(user_id: number): string | boolean

    getAllCategories(user_id: number): string | string[];

    rateProduct(user_id: number, shop_id: number, product_id: number, rating: number): string | boolean

    // addPurchaseType(user_id: number, shop_id: number, purchase_type: Purchase_Type)

    //string is bad, string[] is good and the answer is at [0]
    getUserEmailFromUserId(user_id: number): string | string[]

}

export class SystemImpl implements System {
    private static instance: SystemImpl;

    private constructor(reset?: boolean) {
        if (reset) SystemImpl.reset()
        this._login = LoginImpl.getInstance(reset);
        this._register = RegisterImpl.getInstance();
        this._shops = []
    }

    private _login: LoginImpl;

    get login(): LoginImpl {
        return this._login;
    }

    set login(value: LoginImpl) {
        this._login = value;
    }

    private _register: RegisterImpl;

    get register(): RegisterImpl {
        return this._register;
    }

    set register(value: RegisterImpl) {
        this._register = value;
    }

    private _shops: Shop[];

    get shops(): Shop[] {
        return this._shops;
    }

    set shops(value: Shop[]) {
        this._shops = value;
    }

    public static getInstance(reset?: boolean): SystemImpl {
        if (this.instance == undefined || reset) {
            this.instance = new SystemImpl(reset);
        }
        return this.instance;
    }

    static async rollback() {
         await GetUsers().then(users => {
             this.deleteData();
             this.reloadShop(users);
             this.reloadShopPersonnel(users);
             this.reloadItems();
             this.reloadPurchases();
             this.reloadUsers(users);
             this.reloadNotifications();
             this.terminateAllConnections();
         }
        )
    }

    private static deleteData() {
        PublisherImpl.getInstance(true)
        SystemImpl.getInstance(true)
    }

    private static reset() {
        ShopImpl.resetIDs()
        UserImpl.resetIDs()
        ProductImpl.resetIDs()
        PurchaseImpl.resetIDs()
        NotificationAdapter.getInstance(true)
    }

    adminDisplayShopHistory(admin_id: number, shop_id: number): string | string[] {
        const result = this.getShopAndUser(admin_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        const user = this._login.retrieveUser(admin_id);
        if (typeof user == "string") //can't happen
            return user
        else if (user.is_admin)
            return shop.adminGetShopHistory(user_email)
        else
            return `Email ${user.user_email} is not an admin`;
    }

    adminDisplayUserHistory(admin_id: number, target_id: number) {
        const admin = this.login.retrieveUser(admin_id)
        const target = this.login.retrieveUser(target_id)
        if (typeof admin == "string") return admin
        if (typeof target == "string") return target
        if (!admin.is_admin) return `${admin.user_email} is not an admin`
        return target.getOrderHistory()
    }

    displayShoppingCart(user_id: number): string | string[][] {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string") {
            return user
        } else {
            return user.displayBaskets()
        }

    }

    editShoppingCart(user_id: number, shop_id: number, product_id: number, amount: number): string | void {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string") {
            return user
        }
        const shop = this.getShopById(shop_id);
        if (typeof shop == "undefined")
            return `Shop id ${shop_id} doesnt exist`
        const edit_cart = user.editBasketItem(shop.inventory, product_id, amount)
        if (typeof edit_cart == "string")
            return edit_cart
        if (amount > 0)
            UpdateItemInBasket({
                user_id: user_id,
                shop_id: shop_id,
                product_id: product_id,
                amount: amount
            }).then(r => {
                if (!r) SystemImpl.rollback()
            })
        else
            DeleteItemInBasket({
                user_id: user_id,
                shop_id: shop_id,
                product_id: product_id,
                amount: amount
            }).then(r => {
                if (!r) SystemImpl.rollback()
            })
    }

    async purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string): Promise<string | boolean> {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string") return user
        return user.purchaseBasket(shop_id, payment_info)
            .then(purchase_basket => {
                    if (typeof purchase_basket == "string")
                        return purchase_basket
                    return purchase_basket
                }
            )

    }

    async purchaseCart(user_id: number, payment_info: string): Promise<string | boolean> {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string") {
            return user
        }
        return user.purchaseCart(payment_info)
            .then(result => {
                if (typeof result === "boolean")
                    return result
                return result.toString()
            })
    }

    addProduct(user_id: number, shop_id: number, name: string, description: string, amount: number, categories: string[],
               base_price: number, purchase_type?: Purchase_Type): boolean | string {
        const shop = this.getShopById(shop_id)
        if (!shop) return `Shop ${shop_id} not found`
        const user = this.login.retrieveUser(user_id);
        if (typeof user == "string")
            return user
        if (!this._register.verifyUserEmail(user.user_email)) return `User id ${user_id} is not registered`
        const result = shop.addItem(user.user_email, name, description, amount, categories, base_price, purchase_type)
        if (typeof result != 'string')
            AddProduct({
                shop_id: shop_id,
                name: name,
                description: description,
                amount: amount,
                categories: categories.join(","),
                base_price: base_price,
                purchase_type: purchase_type ? purchase_type : Purchase_Type.Immediate,
                product_id: shop.getAllItems()
                    .reduce((acc, cur) => acc.product_id > cur.product_id ? acc : cur).product_id
            }).then(r => {
                if (!r) SystemImpl.rollback()
            })
        return result
    }

    searchItemFromShops(search_type: SearchTypes, search_term: string): string[] {
        const search = (shop: Shop) => {
            return (search_type == SearchTypes.name) ? shop.search(search_term, undefined, undefined) :
                (search_type == SearchTypes.category) ? shop.search(undefined, search_term, undefined) :
                    shop.search(undefined, undefined, search_term)
        }
        return this._shops.map(shop => JSON.stringify({
            shop_id: shop.shop_id,
            shop_name: shop.name,
            products: search(shop)
        })).filter(result => JSON.parse(result).products.length > 0)
    }

    filterSearch(search_type: SearchTypes, search_term: string, filters: Filter[]): string[] {
        const search = (shop: Shop) => {
            return (search_type == SearchTypes.name) ? shop.filter(shop.search(search_term, undefined, undefined), filters) :
                (search_type == SearchTypes.category) ? shop.filter(shop.search(undefined, search_term, undefined), filters) :
                    (search_type == SearchTypes.keyword) ? shop.filter(shop.search(undefined, undefined, search_term), filters) :
                        [] //should not get here
        }
        return this._shops.map(shop => JSON.stringify({
            shop_id: shop.shop_id,
            shop_name: shop.name,
            products: search(shop)
        })).filter(result => JSON.parse(result).products.length > 0)
    }

    addItemToBasket(user_id: number, product_id: number, shop_id: number, amount: number): string | void {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string") {
            return user;
        }
        const shop = this.getShopById(shop_id);
        if (typeof shop == "undefined")
            return `Shop id ${shop_id} doesnt exist`
        const add_basket = user.addToBasket(shop.inventory, product_id, amount)
        if (typeof add_basket == "string")
            return add_basket
        AddItemToBasket({
            user_id: user_id,
            shop_id: shop_id,
            product_id: product_id,
            amount: amount
        }).then(r => {
            if (!r) SystemImpl.rollback()
        })
    }

    openSession(): number {
        return this.performGuestLogin();
    }

    closeSession(user_id: number): void {
        this.login.exit(user_id)
    }

    displayShops(): string[] {
        return this.shops.map(shop => shop.displayItems())
    }

    getItemsFromShop(shop_id: number): string | string[] {
        const shop: Shop | undefined = this.getShopById(shop_id)
        if (shop == undefined) return "Shop not found"
        return shop.getAllItems().map(item => item.toString())
    }

    addShop(user_id: number, name: string, description: string, location: string, bank_info: string): number | string {
        const user = this.login.retrieveUser(user_id);
        if (typeof user == "string")
            return user
        if (!this._register.verifyUserEmail(user.user_email)) return "User is not registered"
        const shop = ShopImpl.create(user.user_email, bank_info, description, location, name)
        if (typeof shop == "string") return shop
        this._shops = this._shops.concat(shop)
        AddShop({
            shop_id: shop.shop_id,
            user_id: user_id,
            description: description,
            bank_info: bank_info,
            location: location,
            active: true,
            name: name,
        }).then(r => {
            if (!r) SystemImpl.rollback()
        })
        return shop.shop_id
    }

    logout(user_id: number): string | boolean {
        const user = this.login.retrieveUser(user_id);
        if (typeof user == "string")
            return "Not a user";
        if (user.is_guest)
            return "Guest can't preform a logout"
        this._login.logout(user.user_email);
        return true;
    }

    performLogin(user_email: string, password: string): string | number {
        const logged_user = this._login.login(user_email, password);
        if (typeof logged_user == "string") {
            return logged_user;
        }
        return logged_user;
    }

    performGuestLogin(): number {
        return this._login.guestLogin();
    }

    performRegister(user_email: string, password: string, age?: number): boolean {
        const result = this._register.register(user_email, password, age)
        if (!result) return result
        const hashed_pass = Authentication.getInstance().hash(password)
        this.performLogin(user_email, hashed_pass)
        const user_id = this.login.getUserId(user_email) as number
        this.logout(user_id)
        RegisterUser({
            user_id: user_id,
            email: user_email,
            password: hashed_pass,
            age: age ? age : -1,
        }).then(r => {
            if (!r) SystemImpl.rollback()
        })
        return true
    }

    userOrderHistory(user_id: number): string | string[] {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string") {
            return user
        } else {
            return user.getOrderHistory();
        }
    }

    addPermissions(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if (!this._register.verifyUserEmail(target_email))
            return `Target email ${target_email} doesnt belong to a registered user`
        const ret = shop.addPermissions(user_email, target_email, [action])
        if (typeof ret != 'string')
            UpdatePermissions(user_id, shop_id, permission_to_numbers(shop.getRealPermissions(user_email)))
                .then(r => {
                    if (!r) SystemImpl.rollback()
                })
        return ret
    }

    removePermission(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if (!this._register.verifyUserEmail(target_email))
            return `Target email ${target_email} doesnt belong to a registered user`
        const ret = shop.removePermission(user_email, target_email, action)
        if (typeof ret != 'string')
            UpdatePermissions(user_id, shop_id, permission_to_numbers(shop.getRealPermissions(user_email)))
                .then(r => {
                    if (!r) SystemImpl.rollback()
                })
        return ret
    }

    appointManager(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if (!this._register.verifyUserEmail(appointee_user_email))
            return `Target email ${appointee_user_email} doesnt belong to a registered user`
        const ret = shop.appointNewManager(user_email, appointee_user_email)
        if (typeof ret != 'string')
            AppointManager(appointee_user_email, user_email, shop_id, permission_to_numbers(new ManagerPermissions()))
                .then(r => {
                    if (!r) SystemImpl.rollback()
                })
        return ret
    }

    appointOwner(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if (!this._register.verifyUserEmail(appointee_user_email))
            return `Target email ${appointee_user_email} doesnt belong to a registered user`
        const ret = shop.appointNewOwner(user_email, appointee_user_email)
        if (typeof ret != 'string') AppointOwner(appointee_user_email, user_email, shop_id).then(r => {
            if (!r) SystemImpl.rollback()
        })
        return ret
    }

    displayStaffInfo(user_id: number, shop_id: number): string[] | string {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.getStaffInfo(user_email)
    }

    editPermissions(user_id: number, shop_id: number, target_email: string, actions: Action[]): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if (!this._register.verifyUserEmail(target_email))
            return `Target email ${target_email} doesnt belong to a registered user`
        const ret = shop.editPermissions(user_email, target_email, actions)
        if (typeof ret != 'string')
            UpdatePermissions(user_id, shop_id, permission_to_numbers(shop.getRealPermissions(user_email)))
                .then(r => {
                    if (!r) SystemImpl.rollback()
                })
        return ret
    }

    shopOrderHistory(user_id: number, shop_id: number): string | string[] {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.getShopHistory(user_email)
    }

    removeProduct(user_id: number, shop_id: number, product_id: number): boolean | string {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        const ret = shop.removeItem(user_email, product_id)
        if (typeof ret != 'string') RemoveProduct(product_id).then(r => {
            if (!r) SystemImpl.rollback()
        })
        return ret
    }

    editProduct(user_id: number, shop_id: number, product_id: number, action : Item_Action, value: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.editProduct(user_email, product_id, action, value)
    }

    getShopInfo(shop_id: number): string | string[] {
        const shop = this.getShopById(shop_id)
        if (shop == undefined)
            return `Shop ${shop_id} doesn't exist`
        return [shop.toString()];
    }

    removeManager(user_id: number, shop_id: number, target: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if (!this._register.verifyUserEmail(target))
            return `Target email ${target} doesnt belong to a registered user`
        const ret = shop.removeManager(user_email, target)
        if (typeof ret != 'string') RemoveManager(target, shop_id).then(r => {
            if (!r) SystemImpl.rollback()
        })
        return ret
    }

    addPurchasePolicy(user_id: number, shop_id: number, condition: ConditionType, value: string): string[] | string {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        switch (condition) {
            case ConditionType.AfterTime:
            case ConditionType.BeforeTime:
                if (isNaN(Date.parse(value))) return `Invalid date ${value}`
                break;
            case ConditionType.GreaterAmount:
            case ConditionType.LowerAmount:
                if (isNaN(Number(value)) || Number(value) < 0) return `${value} is an invalid amount`
                break;
        }
        const ret = shop.addPolicy(user_email, SimpleCondition.create(condition, value))
        if (typeof ret != 'string')
            AddPurchasePolicy(shop_id, id_counter - 1, {
                value: value,
                purchase_condition: condition
            }).then(r => {
                if (!r) SystemImpl.rollback()
            })
        return ret
    }

    removeOwner(user_id: number, shop_id: number, target: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if (!this._register.verifyUserEmail(target))
            return `Target email ${target} doesnt belong to a registered user`
        const ret = shop.removeOwner(user_email, target)
        if (typeof ret != 'string') RemainingManagement(
            shop.getAllManagementEmail(), shop_id
        ).then(r => {
            if (!r) SystemImpl.rollback()
        })
        return ret
    }

    removePurchasePolicy(user_id: number, shop_id: number, policy_id: number): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        const ret = shop.removePolicy(user_email, policy_id)
        if (typeof ret == 'string')
            removePurchasePolicy(shop_id, policy_id).then(r => {
                if (!r) SystemImpl.rollback()
            })
        return ret
    }

    composePurchasePolicy(user_id: number, shop_id: number, policy_id1: number, policy_id2: number, operator: Operator): boolean | string {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        const ret = shop.composePurchasePolicies(user_email, policy_id1, policy_id2, operator)
        if (typeof ret != 'string')
            AddPurchasePolicy(shop_id, id_counter - 1, {
                first_policy: policy_id1,
                second_policy: policy_id2,
                operator: operator
            }).then(r => {
                if (!r) SystemImpl.rollback()
            })
        return ret
    }

    addDiscount(user_id: number, shop_id: number, value: number): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if (value > 1 || value < 0) return `Illegal discount value`
        const ret = shop.addDiscount(user_email, SimpleDiscount.create(value))
        if (typeof ret != 'string')
            AddDiscount(shop_id, DiscountHandler.discountCounter - 1, value).then(r => r ? {} : SystemImpl.rollback())
        return ret
    }

    addConditionToDiscount(user_id: number, shop_id: number, id: number, condition: Condition, condition_param: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        switch (condition) {
            case Condition.Amount:
                if (isNaN(Number(condition_param))) return "Not a valid parameter"
                break
            case Condition.Shop:
                break
            default:
                if (condition_param == "") return "Can't have empty condition parameter"
        }
        const ret = shop.addConditionToDiscount(user_email, id, condition, condition_param)
        if (typeof ret != 'string')
            AddDiscount(shop_id, DiscountHandler.discountCounter - 1, {
                discount_param: condition_param,
                discount_condition: condition,
                operand_discount: id
            }).then(r => r ? {} : SystemImpl.rollback())
        return ret
    }

    addNumericComposeDiscount(user_id: number, shop_id: number, operation: NumericOperation, d_id1: number, d_id2: number): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        const ret = shop.addNumericCompositionDiscount(user_email, operation, d_id1, d_id2)
        if (typeof ret != 'string')
            AddDiscount(shop_id, DiscountHandler.discountCounter - 1, {
                first_policy: d_id1,
                second_policy: d_id2,
                operator: operation
            }).then(r => r ? {} : SystemImpl.rollback())
        return ret
    }

    addLogicComposeDiscount(user_id: number, shop_id: number, operation: LogicComposition, d_id1: number, d_id2: number): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        const ret = shop.addLogicCompsoitionDiscount(user_email, operation, d_id1, d_id2)
        if (typeof ret != 'string')
            AddDiscount(shop_id, DiscountHandler.discountCounter - 1, {
                first_policy: d_id1,
                second_policy: d_id2,
                operator: NumericOperation.__LENGTH + operation
            }).then(r => r ? {} : SystemImpl.rollback())
        return ret
    }

    removeDiscount(user_id: number, shop_id: number, id: number): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        const ret = shop.removeDiscount(user_email, id)
        if (typeof ret != 'string')
            removeDiscount(shop_id, id).then(r => r ? {} : SystemImpl.rollback())
        return ret
    }

    getAllDiscounts(user_id: number, shop_id: number): string | string[] {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.getAllDiscounts(user_id)
    }

    getAllPurchasePolicies(user_id: number, shop_id: number): string | string[] {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.getAllPurchasePolicies(user_id)
    }

    getAllShops(user_id: number): string | string[] {
        const user = this.login.retrieveUser(user_id);
        if (typeof user == "string")
            return user
        const user_email = user.user_email;
        const my_shops_as_owner = this.shops.filter(shop => shop.management.owners.concat([shop.management.original_owner]).some(owner => owner.user_email == user_email))
        const my_shops_as_manager = this.shops.filter(shop => shop.management.managers.some(manager => manager.user_email == user_email))
        return JSON.stringify(
            my_shops_as_manager
                .concat(my_shops_as_owner)
                .map(
                    shop => {
                        shop_id: shop.shop_id
                        name: shop.name
                    }))
    }

    isAdmin(user_id: number): string | boolean {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string") //can't happen
            return user
        return (user.is_admin)
    }

    isManager(user_id: number): string | boolean {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string") //can't happen
            return user
        return this.shops.some(shop => shop.isManager(user.user_email))
    }

    isOwner(user_id: number): string | boolean {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string") //can't happen
            return user
        return this.shops.some(shop => shop.isOwner(user.user_email))
    }

    getPermissions(user_id: number, shop_id: number): string | string[] {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.getPermissions(user_email)
    }

    getManagingShops(user_id: number): string | string[] {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string")
            return user
        const result: Shop[] = (this.isAdmin(user_id)) ? this.shops :
            this.shops.filter(shop => shop.isOwner(user.user_email) || shop.isManager(user.user_email))
        return result.map(shop => JSON.stringify({
            shop_id: shop.shop_id,
            shop_name: shop.name
        }))
    }

    getAllUsers(user_id: number): string | string[] {
        if (!this.isAdmin(user_id)) return `${user_id} is not an admin`
        return this.login.existing_users.map(user => JSON.stringify({
            user_id: user.user_id,
            user_email: user.user_email
        }))
    }

    isLoggedIn(user_id: number): string | boolean {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string")
            return user
        return this.login.isLoggedIn(user.user_email)
    }

    getAllCategories(user_id: number): string | string[] {
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string")
            return user
        logger.Info(`${user.user_email} requested all categories`)
        const categories = new Set(this.shops.flatMap(shop => shop.getAllCategories()))
        return Array.from(categories.values())
    }

    rateProduct(user_id: number, shop_id: number, product_id: number, rating: number): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        const user = this._login.retrieveUser(user_id);
        if (typeof user == "string")
            return user
        const ret = shop.rateProduct(user_email, user_id, product_id, rating)
        if (typeof ret == "string") return ret
        user.logRating(product_id, shop_id, rating)
        RateProduct({user_id: user_id, product_id: product_id, rate: rating}).then(r => r ? {} : SystemImpl.rollback())
        return true
    }

    getUserEmailFromUserId(user_id: number): string | string[] {
        const result = this.login.retrieveUser(user_id)
        if (typeof result == "string") return result
        return [result.user_email]
    }

    private getShopById(shop_id: number): Shop | undefined {
        return this.shops.find(s => s.shop_id == shop_id)
    }

    private getShopAndUser(user_id: number, shop_id: number): string | { shop: Shop, user_email: string } {
        const shop = this.getShopById(shop_id)
        if (shop == undefined) return "Shop not found"
        const user = this.login.retrieveUser(user_id);
        if (typeof user == "string")
            return user
        const user_email = user.user_email;
        if (!this._register.verifyUserEmail(user_email))
            return `User id ${user_id} is not a registered user`
        return {shop, user_email}
    }

    // addPurchaseType(user_id: number, shop_id: number, purchase_type: Purchase_Type) {
    //     const result = this.getShopAndUser(user_id, shop_id)
    //     if (typeof result == "string") return result
    //     const {shop, user_email} = result
    //     const user = this._login.retrieveUser(user_id);
    //     if (typeof user == "string")
    //         return user
    // }

    private static reloadUsers(users) {
        //update login
        users.forEach(entry => {
            LoginImpl.getInstance().reloadUser(entry)
        })
    }

    private static reloadShop(users) {
        GetShopsRaw().then(result =>
            result.forEach(entry => {
                SystemImpl.getInstance().addShopFromDB(entry, users)
            }))
    }

    private addShopFromDB(entry, users) {
        const newEntry = entry.map(e => {
            return {
                shop_id: e._shop_id,
                original_owner: SystemImpl.getEmailFromIDFromList(users, e.original_owner),
                name: e.name,
                description: e.description,
                location: e.location,
                bank_info: e.bank_info,
                active: e.is_active
            }
        })
        this.shops.push(ShopImpl.createFromDB(newEntry))
    }

    private static getEmailFromIDFromList(users, target_id) {
        return users.find(u => u.user_id == target_id).email as string
    }

    private static reloadShopPersonnel(users) {
        GetShopsManagement().then(result => {
            result.map(s => {
                return {
                    shop_id: s.shop_id,
                    owners: s.owners.map(o => {
                        return {
                            owner_email: this.getEmailFromIDFromList(users, o.owner_id),
                            appointer_email: this.getEmailFromIDFromList(users, o.appointer_id)
                        }
                    }),
                    managers: s.managers.map(m => { return {
                        manager_email: this.getEmailFromIDFromList(users, m.manager_id),
                        appointer_id: this.getEmailFromIDFromList(users, m.appointer_id),
                        permissions: m.permissions
                    }})
                }
            }).forEach(entry => {
                const shop = SystemImpl.getInstance().shops.find(s => s.shop_id == entry.shop_id) as ShopImpl
                shop.addManagement(entry.owners, entry.managers)
            })
        })
    }

    private static reloadNotifications() {
        GetNotifications().then(result => {
            PublisherImpl.getInstance().addNotificationsFromDB(result)
        })
    }

    private static reloadItems() {
       GetShopsInventory().then(inventory => {
           inventory.forEach(i => {
               const shop = SystemImpl.getInstance().shops.find(s => s.shop_id == i.shop_id) as ShopImpl
               shop.addInventoryFromDB(i)
           })
       })
    }

    private static reloadPurchases() {
        GetPurchases().then(purchases => UserPurchaseHistoryImpl.getInstance().reloadPurchasesFromDB(purchases))
    }

    private static terminateAllConnections() {
        //TODO with mark
    }
}
