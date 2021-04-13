//TODO Initialize the system and needed objects.
//TODO create admin on init


import {User} from "./Users/User";
import {Shop, ShopImpl} from "./Shop/Shop";
import {logger} from "./Logger";
import {LoginImpl} from "./Users/Login";
import {RegisterImpl} from "./Users/Register";
import {Filter} from "./Shop/ShopInventory";
import {Action} from "./ShopPersonnel/Permissions";
import {Product} from "./ProductHandling/Product";
import {DiscountType} from "./PurchaseProperties/DiscountType";
import {PurchaseType} from "./PurchaseProperties/PurchaseType";
export enum SearchTypes {
    name,
    category,
    keyword
}

interface System{

    openSession(): void //TODO add guest to the system.
    closeSession(): void //TODO remove quest from system, if use logout.
    displayMenu():void // TODO UI JUST FOR US
    performRegister(user_email:string, password: string): boolean
    performLogin(user_email:string, password: string): string | number
    logout(user_email: string): void //TODO after logout switch to guest, openSession?
    displayShops(): string[]
    getItemsFromShop(shop_id:number): string | string[]
    searchItemFromShops(search_type:SearchTypes, search_term: string): string[]
    filterSearch(search_type:SearchTypes, search_term: string, filters: Filter[]): string[]
    addItemToBasket(user_id:number, product_id: number, shop_id:number, amount:number):any
    displayShoppingCart(user_id:number):any
    editShoppingCart(user_id:number, shop_id:number, product_id:number, amount:number):any
    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info:string):any
    purchaseCart(user_id: number, payment_info:string):any
    addShop(user_id: number, name: string, description: string,
            location: string, bank_info:string): number | string
    UserOrderHistory(user_id: number):any
    addProduct(user_id: number, shop_id: shop_id, name: string, description: string, amount: number, categories: string[],
               base_price: null, discount_type: DiscountType, purchase_type: PurchaseType): boolean | string
    removeProduct(user_id: number, shop_id: number, product_id: number): boolean | string
    appointManager(user_id:number,shop_id:number, appointee_user_email:string): string | boolean
    appointOwner(user_id:number,shop_id:number, appointee_user_email:string): string | boolean
    addPermissions(user_id:number, shop_id:number, target_email:string,action:Action): string | boolean
    editPermissions(user_id:number, shop_id:number, target_email:string,actions:Action[]): string | boolean
    displayStaffInfo(user_id:number,shop_id:number): string[] | string
    shopOrderHistory(user_id:number,shop_id:number): string | string[]

    adminDisplayShopHistory(user_id:number, shop_id: number): string | string[]
    adminDisplayUserHistory(user_id:number):any

    //shop_id: number
    //     name: string
    //     description: string
    //     location: string
    //     bank_info: string
    //     inventory: ShopInventory
    //     management: ShopManagement

}

export class SystemImpl implements System {
    private _login: LoginImpl;
    private _register: RegisterImpl;
    private _shops: Shop[];

    constructor() {
        this._login = LoginImpl.getInstance();
        this._register = RegisterImpl.getInstance();
        this._shops = []
        //TODO create admin user , correctense requierment 2

    }

    adminDisplayShopHistory(user_id: number, shop_id: number) {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        //TODO check if user is admin
        return shop.adminGetShopHistory(user_email)
    }
    adminDisplayUserHistory(user_id: number) {
        throw new Error("Method not implemented.");
    }

    displayShoppingCart(user_id: number) {
        throw new Error("Method not implemented.");
    }
    editShoppingCart(user_id: number, shop_id: number, product_id: number, amount: number) {
        throw new Error("Method not implemented.");
    }
    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string) {
        throw new Error("Method not implemented.");
    }
    purchaseCart(user_id: number, payment_info: string) {
        throw new Error("Method not implemented.");
    }
    orderHistory(user_id: number) {

    }
    addProduct(user_id: number, shop_id: shop_id, name: string, description: string, amount: number, categories: string[],
               base_price: null, discount_type: DiscountType, purchase_type: PurchaseType): boolean | string {
        const shop = this.getShopById(shop_id)
        if (!shop) return `Shop ${shop_id} not found`
        if(!this._register.verifyUserEmail(String(user_id))) return "User is not registered" //TODO fix verify
        const user_email = "temp" //TODO replace with getter
        return shop.addItem(user_email, name, description, amount, categories, base_price, discount_type, purchase_type)
    }

    searchItemFromShops(search_type: SearchTypes, search_term: string): string[] {
        const search = (shop: Shop) => {
            return (search_type == SearchTypes.name) ? shop.search(search_term, undefined, undefined) :
                (search_type == SearchTypes.category) ? shop.search(undefined, search_term, undefined) :
                    shop.search(undefined, undefined, search_term)
        }
        return this._shops.flatMap(shop => search(shop)).map(product => product.toString()) //TODO product toString
    }

    filterSearch(search_type: SearchTypes, search_term: string, filters: Filter[]): string[]{
        const search = (shop: Shop) => {
            return (search_type == SearchTypes.name) ? shop.filter(shop.search(search_term, undefined, undefined), filters) :
                (search_type == SearchTypes.category) ? shop.filter(hop.search(undefined, search_term, undefined), filters) :
                (search_type == SearchTypes.keyword) ? shop.filter(shop.search(undefined, undefined, search_term), filters) :
                [] //should not get here
        }
        return this._shops.flatMap(shop => search(shop)).map(product => product.toString()) //TODO product toString
    }

    addItemToBasket(user_id: number, product_id: number, shop_id: number, amount: number) {
        //TODO add user_id and to with mark
    }

    openSession(): void {
        throw new Error("Method not implemented.");
    }
    closeSession(): void {
        throw new Error("Method not implemented.");
    }

    displayShops(): string[] {
        return this.shops.map(shop => shop.toString())
    }

    private getShopById(shop_id: number): Shop | undefined {
        return this.shops.filter(s => s.shop_id == shop_id)[0]
    }

    getItemsFromShop(shop_id:number): string | string[]{
        const shop: Shop | undefined = this.getShopById(shop_id)
        if (shop == undefined) return "Shop not found"
        return shop.getAllItems().map(item => item.toString()) //TODO add toString to product
    }

    private getShopAndUser(shop_id: number, user_id: number): string | {shop: Shop, user_email: string} {//TODO show lior
        const shop = this.getShopById(shop_id)
        if (shop == undefined) return "Shop not found"
        const user_email = "" //TODO show lior
        if (false) return "User not found"
        return {shop, user_email}
    }

    addShop(user_id: number, name: string, description: string, location: string, bank_info: string): number | string {
        if(!this._register.verifyUserEmail(user_id)) return "User is not registered"
        const shop = new ShopImpl("temp", bank_info, description, location, name) //TODO replace temp with email getter
        this._shops = this._shops.concat(shop)
        return shop.shop_id
    }

    displayMenu(): void {
    }


    logout(user_email:string): void {
        this._login.logout(user_email);
    }

    performLogin(user_email:string, password: string): string | number {
        const logged_user = this._login.login(user_email, password);
        if(typeof logged_user == "string"){
            return logged_user;
        }
        //TODO add id's to user as a number
        return logged_user.user_email;
    }

    performRegister(user_email:string, password: string): boolean {
        return this._register.register(user_email,password)
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

    UserOrderHistory(user_id: number): any {
    }

    addPermissions(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        //TODO verify that target email is real
        return shop.addPermissions(user_email, target_email, [action])
    }

    appointManager(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        //verify that appointee email is real
        return shop.appointNewManager(user_email, appointee_user_email)
    }

    appointOwner(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        const result = this.getShopAndUser(user_id, shop_id)
        if (typeof result == "string") return result
        const {shop, user_email} = result
        //verify that appointee email is real
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
        //TODO verify that target email is real
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
}

// //LOGGED EXAMPLES:
// logger.Critical("Critical", "message");
// logger.Debug("Debug", "message");
// logger.Error("Error", "message");
// logger.Info("Info", "message");
// logger.Warn("Warn", "message");
//logger.Trace("message", "with trace");
