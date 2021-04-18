//TODO Initialize the system and needed objects.
//TODO create admin on init


import {User} from "./Users/User";
import {Shop} from "./Shop/Shop";
import {logger} from "./Logger";
import {LoginImpl} from "./Users/Login";
import {RegisterImpl} from "./Users/Register";
import {filter} from "./Shop/ShopInventory";
import {Action} from "./ShopPersonnel/Permissions";
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
    displayShops():any
    getItemsFromShop(shop_id:number): any
    searchItemFromShops(search_type:SearchTypes, search_term: string):any
    filterSearch(search_type:SearchTypes, search_term: string, filter:filter):any
    addItemToBasket(user_id:number, product_id: number, shop_id:number, amount:number):any
    displayShoppingCart(user_id:number):any
    editShoppingCart(user_id:number, shop_id:number, product_id:number, amount:number):any
    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info:string):any
    purchaseCart(user_id: number, payment_info:string):any
    addShop(user_email: string, name: string, description: string,
            location: string, bank_info:string): number | string
    UserOrderHistory(user_id: number):any
    addProducts(user_id:number,shop_id:number):any//TODO
    appointManager(user_id:number,shop_id:number, appointee_user_email:string):any
    appointOwner(user_id:number,shop_id:number, appointee_user_email:string):any
    addPermissions(user_id:number, shop_id:number, target_email:string,action:Action):any
    editPermissions(user_id:number, shop_id:number, target_email:string,actions:Action[]):any
    displayStaffInfo(user_id:number,shop_id:number):any
    shopOrderHistory(user_id:number,shop_id:number):any

    adminDisplayShopHistory(user_id:number):any
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

    adminDisplayShopHistory(user_id: number) {
        throw new Error("Method not implemented.");
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
        throw new Error("Method not implemented.");
    }
    addProducts(user_id: number) {
        //TODO
    }

    searchItemFromShops(search_type: SearchTypes, search_term: string) {
        throw new Error("Method not implemented.");
    }
    filterSearch(search_type: SearchTypes, search_term: string, filter: filter) {
        throw new Error("Method not implemented.");
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
    displayShops() {
        //display user all the available shops in the system
    }
    getItemsFromShop(shop_id:number){
        // display items of selected shop
    }

    addShop(user_email: string, name: string, description: string, location: string, bank_info: string): number | string {
        if(this._register.verifyUserEmail(user_email)){
            return ""
        }
        return ""
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

    addPermissions(user_id: number, shop_id: number, target_email: string, action: Action): any {
    }

    appointManager(user_id: number, shop_id: number, appointee_user_email: string): any {
    }

    appointOwner(user_id: number, shop_id: number, appointee_user_email: string): any {
    }

    displayStaffInfo(user_id: number, shop_id: number): any {
    }

    editPermissions(user_id: number, shop_id: number, target_email: string, actions: Action[]): any {
    }

    shopOrderHistory(user_id: number, shop_id: number): any {
    }

}

// //LOGGED EXAMPLES:
// logger.Critical("Critical", "message");
// logger.Debug("Debug", "message");
// logger.Error("Error", "message");
// logger.Info("Info", "message");
// logger.Warn("Warn", "message");
//logger.Trace("message", "with trace");
