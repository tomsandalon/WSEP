//TODO Initialize the system and needed objects.
//TODO create admin on init


import {User} from "./Users/User";
import {Shop, ShopImpl} from "./Shop/Shop";
import {logger} from "./Logger";
import {LoginImpl} from "./Users/Login";
import {RegisterImpl} from "./Users/Register";
import {Filter, Item_Action} from "./Shop/ShopInventory";
import {Action} from "./ShopPersonnel/Permissions";
import {Product} from "./ProductHandling/Product";
import {DiscountType} from "./PurchaseProperties/DiscountType";
import {PurchaseType} from "./PurchaseProperties/PurchaseType";
export enum SearchTypes {
    name,
    category,
    keyword
}

export interface System{

    openSession(): void //TODO add guest to the system.
    closeSession(): void //TODO remove quest from system, if use logout.
    displayMenu():void // TODO UI JUST FOR US
    performRegister(user_email:string, password: string): boolean
    performLogin(user_email:string, password: string): string | number
    performGuestLogin():number
    logout(user_email: string): void //TODO after logout switch to guest, openSession? //lior
    displayShops():any
    getItemsFromShop(shop_id:number): any
    searchItemFromShops(search_type:SearchTypes, search_term: string):any
    filterSearch(search_type:SearchTypes, search_term: string, filters:Filter[]):string[]
    addItemToBasket(user_id:number, product_id: number, shop_id:number, amount:number):string | void
    displayShoppingCart(user_id:number): string | string[][]
    editShoppingCart(user_id:number, shop_id:number, product_id:number, amount:number):string | void
    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info:string):string | boolean
    purchaseCart(user_id: number, payment_info:string):string | boolean
    addShop(user_id: number, name: string, description: string,
            location: string, bank_info:string): number | string
    UserOrderHistory(user_id: number):string | string[]
    addProduct(user_id: number, shop_id: number, name: string, description: string, amount: number, categories: string[],
               base_price: number, discount_type: DiscountType, purchase_type: PurchaseType): boolean | string
    removeProduct(user_id: number, shop_id: number, product_id: number): boolean | string
    appointManager(user_id:number,shop_id:number, appointee_user_email:string): string | boolean
    appointOwner(user_id:number,shop_id:number, appointee_user_email:string): string | boolean
    addPermissions(user_id:number, shop_id:number, target_email:string,action:Action): string | boolean
    editPermissions(user_id:number, shop_id:number, target_email:string,actions:Action[]): string | boolean
    displayStaffInfo(user_id:number,shop_id:number): string[] | string
    shopOrderHistory(user_id:number,shop_id:number): string | string[]
    adminDisplayShopHistory(user_id:number, shop_id: number): string | string[]
    adminDisplayUserHistory(user_id:number):any
    editProduct(user_id: number, shop_id: number, product_id: number, action: Item_Action, value: string): string | boolean
    editUserDetails(user_id: number, action: any, value: any): string | boolean
    getShopInfo(shop_id: number) : string | string[]
    //TODO edit user details Lior
    //shop_id: number
    //     name: string
    //     description: string
    //     location: string
    //     bank_info: string
    //     inventory: ShopInventory
    //     management: ShopManagement

}

export class SystemImpl implements System {
    private static instance: SystemImpl;
    private _login: LoginImpl;
    private _register: RegisterImpl;
    private _shops: Shop[];

    private constructor() {
        this._login = LoginImpl.getInstance();
        this._register = RegisterImpl.getInstance();
        this._shops = []
        //TODO create admin user , correctense requierment 2

    }

    public static getInstance(reset? : boolean): System{
        if(this.instance == undefined || reset){
            this.instance = new SystemImpl();
        }
        return this.instance;
    }

    adminDisplayShopHistory(user_id: number, shop_id: number):string | string[] {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        const user = this._login.retrieveUser(user_id);
        if(typeof user == "string") //can't happen
            return user
        else if(user.is_admin)
            return shop.adminGetShopHistory(user_email)
        else
            return `Email ${user.user_email} is not an admin`;
    }
    adminDisplayUserHistory(user_id: number) {
        throw new Error("Method not implemented.");
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
            const purchase_cart = user.purchaseCart(payment_info);
            if(typeof purchase_cart == "string")
                return purchase_cart
            return purchase_cart
        }
    }
    addProduct(user_id: number, shop_id:  number, name: string, description: string, amount: number, categories: string[],
               base_price: number, discount_type: DiscountType, purchase_type: PurchaseType): boolean | string {
        const shop = this.getShopById(shop_id)
        if (!shop) return `Shop ${shop_id} not found`
        const user = this.login.retrieveUser(user_id);
        if(typeof user == "string")
            return user
        if(!this._register.verifyUserEmail(user.user_email)) return `User id ${user_id} is not registered`
        return shop.addItem(user.user_email, name, description, amount, categories, base_price, discount_type, purchase_type)
    }

    searchItemFromShops(search_type: SearchTypes, search_term: string): string[] {
        const search = (shop: Shop) => {
            return (search_type == SearchTypes.name) ? shop.search(search_term, undefined, undefined) :
                (search_type == SearchTypes.category) ? shop.search(undefined, search_term, undefined) :
                    shop.search(undefined, undefined, search_term)
        }
        return this._shops.flatMap(shop => search(shop)).map(product => product.toString())
    }

    filterSearch(search_type: SearchTypes, search_term: string, filters: Filter[]):string[] {
        const search = (shop: Shop) => {
            return (search_type == SearchTypes.name) ? shop.filter(shop.search(search_term, undefined, undefined), filters) :
                (search_type == SearchTypes.category) ? shop.filter(shop.search(undefined, search_term, undefined), filters) :
                    (search_type == SearchTypes.keyword) ? shop.filter(shop.search(undefined, undefined, search_term), filters) :
                        [] //should not get here
        }
        return this._shops.flatMap(shop => search(shop)).map(product => product.toString()) //TODO product toString

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

    openSession(): void {
        const user_guest = this.performGuestLogin();

    }
    closeSession(): void {
        throw new Error("Method not implemented.");
    }

    displayShops(): string[] {
        return this.shops.map(shop => shop.toString())
    }

    private getShopById(shop_id: number): Shop | undefined {
        return this.shops.find(s => s.shop_id == shop_id)
    }

    getItemsFromShop(shop_id:number): string | string[]{
        const shop: Shop | undefined = this.getShopById(shop_id)
        if (shop == undefined) return "Shop not found"
        return shop.getAllItems().map(item => item.toString())
    }

    private getShopAndUser(shop_id: number, user_id: number): string | {shop: Shop, user_email: string} {
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
        const shop = new ShopImpl(user.user_email, bank_info, description, location, name)
        this._shops = this._shops.concat(shop)
        return shop.shop_id
    }

    displayMenu(): void {
        //TODO ??
    }


    logout(user_email:string): void {
        this._login.logout(user_email);
        this.openSession()
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


    UserOrderHistory(user_id: number): string | string[] {
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

    editUserDetails(user_id: number, action: any, value: any): string | boolean {
        return ""; //TODO
    }

    getShopInfo(shop_id: number): string | string[] {
        const shop = this.getShopById(shop_id)
        if (shop == undefined)
            return `Shop ${shop_id} doesn't exist`
        return [shop.toString()]; //TODO
    }
}

// //LOGGED EXAMPLES:
// logger.Critical("Critical", "message");
// logger.Debug("Debug", "message");
// logger.Error("Error", "message");
// logger.Info("Info", "message");
// logger.Warn("Warn", "message");
//logger.Trace("message", "with trace");
