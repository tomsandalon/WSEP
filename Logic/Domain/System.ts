import {UserImpl} from "./Users/User";
import {Shop, ShopImpl} from "./Shop/Shop";
import {LoginImpl} from "./Users/Login";
import {RegisterImpl} from "./Users/Register";
import {Filter, Item_Action, Purchase_Type} from "./Shop/ShopInventory";
import {Action} from "./ShopPersonnel/Permissions";
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

export enum SearchTypes {
    name,
    category,
    keyword
}

export interface System{

    openSession(): number
    closeSession(user_id: number): void
    performRegister(user_email:string, password: string): boolean
    performLogin(user_email:string, password: string): string | number
    performGuestLogin():number
    logout(user_id: number): string | boolean
    displayShops():string | string[]
    getItemsFromShop(shop_id:number): any
    searchItemFromShops(search_type:SearchTypes, search_term: string):any
    filterSearch(search_type:SearchTypes, search_term: string, filters:Filter[]):string[]
    addItemToBasket(user_id:number, product_id: number, shop_id:number, amount:number):string | void
    displayShoppingCart(user_id:number): string | string[][]
    editShoppingCart(user_id:number, shop_id:number, product_id:number, amount:number):string | void
    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info:string):string | boolean
    purchaseCart(user_id: number, payment_info:string): string | boolean
    addShop(user_id: number, name: string, description: string,
            location: string, bank_info:string): number | string
    userOrderHistory(user_id: number):string | string[]
    addProduct(user_id: number, shop_id: number, name: string, description: string, amount: number, categories: string[],
               base_price: number, purchase_type?: Purchase_Type): boolean | string
    removeProduct(user_id: number, shop_id: number, product_id: number): boolean | string
    appointManager(user_id:number,shop_id:number, appointee_user_email:string): string | boolean
    removeManager(user_id: number, shop_id: number, target: string): string | boolean
    appointOwner(user_id:number,shop_id:number, appointee_user_email:string): string | boolean
    removeOwner(user_id: number, shop_id: number, target: string): string | boolean
    addPermissions(user_id:number, shop_id:number, target_email:string,action:Action): string | boolean
    editPermissions(user_id:number, shop_id:number, target_email:string,actions:Action[]): string | boolean
    displayStaffInfo(user_id:number,shop_id:number): string[] | string
    shopOrderHistory(user_id:number,shop_id:number): string | string[]
    adminDisplayShopHistory(admin:number, shop_id: number): string | string[]
    adminDisplayUserHistory(admin:number, target_id: number): string | string[]
    editProduct(user_id: number, shop_id: number, product_id: number, action: Item_Action, value: string): string | boolean
    getShopInfo(shop_id: number) : string | string[]

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
}

//TODO add toggle underaged

export class SystemImpl implements System {
    private static instance: SystemImpl;

    private _login: LoginImpl;
    private _register: RegisterImpl;
    private _shops: Shop[];
    private static reset() {
        ShopImpl.resetIDs()
        UserImpl.resetIDs()
        ProductImpl.resetIDs()
        PurchaseImpl.resetIDs()
        NotificationAdapter.getInstance(true)
    }

    private constructor(reset?: boolean) {
        if (reset) SystemImpl.reset()
        this._login = LoginImpl.getInstance(reset);
        this._register = RegisterImpl.getInstance();
        this._shops = []
    }

    public static getInstance(reset? : boolean): System{
        if(this.instance == undefined || reset){
            this.instance = new SystemImpl(reset);
        }
        return this.instance;
    }

    adminDisplayShopHistory(admin_id: number, shop_id: number):string | string[] {
        const result = this.getShopAndUser(admin_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        const user = this._login.retrieveUser(admin_id);
        if(typeof user == "string") //can't happen
            return user
        else if(user.is_admin)
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
        if(typeof user == "string"){
            return user
        }
        else{
            return user.displayBaskets()
        }

    }

    editShoppingCart(user_id: number, shop_id: number, product_id: number, amount: number):string | void {
        const user = this._login.retrieveUser(user_id);
        if(typeof user == "string"){
            return user
        }
        else{
            const shop = this.getShopById(shop_id);
            if(typeof shop == "undefined")
                return `Shop id ${shop_id} doesnt exist`
            const edit_cart = user.editBasketItem(shop.inventory, product_id, amount)
            if(typeof edit_cart == "string")
                return edit_cart
        }
    }

    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string):string | boolean {
        const user = this._login.retrieveUser(user_id);
        if(typeof user == "string"){
            return user
        }
        else{
            const purchase_basket = user.purchaseBasket(shop_id,payment_info);
            if(typeof purchase_basket == "string")
                return purchase_basket
            return purchase_basket
        }
    }

    purchaseCart(user_id: number, payment_info: string): string | boolean{
        const user = this._login.retrieveUser(user_id);
        if(typeof user == "string"){
            return user
        }
        else{
            const result = user.purchaseCart(payment_info);
            if(typeof result === "boolean")
                return result
            return result.toString()
        }
    }

    addProduct(user_id: number, shop_id:  number, name: string, description: string, amount: number, categories: string[],
               base_price: number, purchase_type?: Purchase_Type): boolean | string {
        const shop = this.getShopById(shop_id)
        if (!shop) return `Shop ${shop_id} not found`
        const user = this.login.retrieveUser(user_id);
        if(typeof user == "string")
            return user
        if(!this._register.verifyUserEmail(user.user_email)) return `User id ${user_id} is not registered`
        return shop.addItem(user.user_email, name, description, amount, categories, base_price, purchase_type)
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

    filterSearch(search_type: SearchTypes, search_term: string, filters: Filter[]):string[] {
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
    addItemToBasket(user_id: number, product_id: number, shop_id: number, amount: number):string | void{
        const user = this._login.retrieveUser(user_id);
        if(typeof user == "string"){
            return user;
        }
        else{
            const shop = this.getShopById(shop_id);
            if(typeof shop == "undefined")
                return `Shop id ${shop_id} doesnt exist`
            const add_basket = user.addToBasket(shop.inventory, product_id, amount)
            if(typeof add_basket == "string")
                return add_basket
        }
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

    private getShopById(shop_id: number): Shop | undefined {
        return this.shops.find(s => s.shop_id == shop_id)
    }

    getItemsFromShop(shop_id:number): string | string[]{
        const shop: Shop | undefined = this.getShopById(shop_id)
        if (shop == undefined) return "Shop not found"
        return shop.getAllItems().map(item => item.toString())
    }

    private getShopAndUser(user_id: number, shop_id: number): string | {shop: Shop, user_email: string} {
        const shop = this.getShopById(shop_id)
        if (shop == undefined) return "Shop not found"
        const user = this.login.retrieveUser(user_id);
        if(typeof user == "string")
            return user
        const user_email = user.user_email;
        if(!this._register.verifyUserEmail(user_email))
            return `User id ${user_id} is not a registered user`
        return {shop, user_email}
    }

    addShop(user_id: number, name: string, description: string, location: string, bank_info: string): number | string {
        const user = this.login.retrieveUser(user_id);
        if(typeof user == "string")
            return user
        if(!this._register.verifyUserEmail(user.user_email)) return "User is not registered"
        const shop = ShopImpl.create(user.user_email, bank_info, description, location, name)
        if (typeof shop == "string") return shop
        this._shops = this._shops.concat(shop)
        return shop.shop_id
    }
    logout(user_id:number): string | boolean {
        const user = this.login.retrieveUser(user_id);
        if(typeof user == "string")
            return "Not a user";
        if(user.is_guest)
            return "Guest can't preform a logout"
        this._login.logout(user.user_email);
        return true;
    }

    performLogin(user_email:string, password: string): string | number {
        const logged_user = this._login.login(user_email, password);
        if(typeof logged_user == "string"){
            return logged_user;
        }
        return logged_user;
    }

    performGuestLogin():number{
        return this._login.guestLogin();
    }

    performRegister(user_email:string, password: string): boolean {
        return this._register.register(user_email,password)
    }

    userOrderHistory(user_id: number): string | string[] {
        const user = this._login.retrieveUser(user_id);
        if(typeof user == "string"){
            return user
        }
        else{
            return user.getOrderHistory();
        }
    }

    addPermissions(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if(!this._register.verifyUserEmail(target_email))
            return `Target email ${target_email} doesnt belong to a registered user`
        return shop.addPermissions(user_email, target_email, [action])
    }

    appointManager(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if(!this._register.verifyUserEmail(appointee_user_email))
            return `Target email ${appointee_user_email} doesnt belong to a registered user`
        return shop.appointNewManager(user_email, appointee_user_email)
    }

    appointOwner(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if(!this._register.verifyUserEmail(appointee_user_email))
            return `Target email ${appointee_user_email} doesnt belong to a registered user`
        return shop.appointNewOwner(user_email, appointee_user_email)
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
        if(!this._register.verifyUserEmail(target_email))
            return `Target email ${target_email} doesnt belong to a registered user`
        return shop.editPermissions(user_email, target_email, actions)
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
        return shop.removeItem(user_email, product_id)
    }

    get login(): LoginImpl {
        return this._login;
    }

    set login(value: LoginImpl) {
        this._login = value;
    }

    get register(): RegisterImpl {
        return this._register;
    }

    set register(value: RegisterImpl) {
        this._register = value;
    }

    get shops(): Shop[] {
        return this._shops;
    }

    set shops(value: Shop[]) {
        this._shops = value;
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
        if(!this._register.verifyUserEmail(target))
            return `Target email ${target} doesnt belong to a registered user`
        return shop.removeManager(user_email, target)
    }

    addPurchasePolicy(user_id: number, shop_id: number, condition: ConditionType, value: string): string[] | string {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        switch (condition){
            case ConditionType.AfterTime:
            case ConditionType.BeforeTime:
                if (isNaN(Date.parse(value))) return `Invalid date ${value}`
                break;
            case ConditionType.GreaterAmount:
            case ConditionType.LowerAmount:
                if (isNaN(Number(value)) || Number(value) < 0) return `${value} is an invalid amount`
                break;
        }
        return shop.addPolicy(user_email, new SimpleCondition(condition, value))
    }

    removeOwner(user_id: number, shop_id: number, target: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        if(!this._register.verifyUserEmail(target))
            return `Target email ${target} doesnt belong to a registered user`
        return shop.removeOwner(user_email, target)
    }

    removePurchasePolicy(user_id: number, shop_id: number, policy_id: number): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.removePolicy(user_email, policy_id)
    }

    composePurchasePolicy(user_id: number, shop_id: number, policy_id1: number, policy_id2: number, operator: Operator): boolean | string {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.composePurchasePolicies(user_email, policy_id1, policy_id2, operator)
    }

    addDiscount(user_id: number, shop_id: number, value: number): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.addDiscount(user_email, new SimpleDiscount(value))
    }

    addConditionToDiscount(user_id: number, shop_id: number, id: number, condition: Condition, condition_param: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        switch (condition){
            case Condition.Amount:
                if (isNaN(Number(condition_param))) return "Not a valid parameter"
                break
            case Condition.Shop:
                break
            default:
                if (condition_param == "") return "Can't have empty condition parameter"
        }
        return shop.addConditionToDiscount(user_email, id, condition, condition_param)
    }

    addNumericComposeDiscount(user_id: number, shop_id: number, operation: NumericOperation, d_id1: number, d_id2: number): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.addNumericCompositionDiscount(user_email, operation, d_id1, d_id2)
    }

    addLogicComposeDiscount(user_id: number, shop_id: number, operation: LogicComposition, d_id1: number, d_id2: number): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.addLogicCompsoitionDiscount(user_email, operation, d_id1, d_id2)
    }

    removeDiscount(user_id: number, shop_id: number, id: number): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        return shop.removeDiscount(user_email, id)
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
        if(typeof user == "string")
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
        if(typeof user == "string") //can't happen
            return user
        return (user.is_admin)
    }

    isManager(user_id: number): string | boolean {
        const user = this._login.retrieveUser(user_id);
        if(typeof user == "string") //can't happen
            return user
        return this.shops.some(shop => shop.isManager(user.user_email))
    }

    isOwner(user_id: number): string | boolean {
        const user = this._login.retrieveUser(user_id);
        if(typeof user == "string") //can't happen
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
        if(typeof user == "string")
            return user
        return this.shops.filter(shop => shop.isOwner(user.user_email) || shop.isManager(user.user_email))
            .map(shop => JSON.stringify({
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
        if(typeof user == "string")
            return user
        return this.login.isLoggedIn(user.user_email)
    }

    getAllCategories(user_id: number): string | string[] {
        const user = this._login.retrieveUser(user_id);
        if(typeof user == "string")
            return user
        logger.Info(`${user.user_email} requested all categories`)
        const categories = new Set(this.shops.flatMap(shop => shop.getAllCategories()))
        return Array.from(categories.values())
    }
}
