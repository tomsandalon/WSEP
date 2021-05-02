import {System, TestNotAssociatedWithImplementation} from "./System";
import {AdapterSystem} from "./AdapterSystem";
import {DiscountType} from "../../Logic/Domain/PurchaseProperties/DiscountType";
// import {PurchaseType} from "../../Logic/Domain/PurchaseProperties/PurchaseType";
import {Action} from "../../Logic/Domain/ShopPersonnel/Permissions";
import {Filter, Item_Action, Purchase_Type} from "../../Logic/Domain/Shop/ShopInventory";
import {SearchTypes} from "../../Logic/Domain/System";

export class ProxySystem implements System{
    private readonly system: AdapterSystem | undefined

    constructor(system: AdapterSystem | undefined) {
        this.system = system;
    }

    userOrderHistory(user_id: number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.userOrderHistory(user_id);
    }

    addItemToBasket(user_id: number, product_id: number, shop_id: number, amount: number): string | void {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.addItemToBasket(user_id, product_id, shop_id, amount);
    }

    addPermissions(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.addPermissions(user_id, shop_id, target_email, action)
    }

    addProduct(user_id: number, shop_id: number, name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: any): boolean | string {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.addProduct(user_id, shop_id, name, description, amount, categories, base_price, discount_type, Purchase_Type.Immediate)
    }

    addShop(user_id: number, name: string, description: string, location: string, bank_info: string): number | string {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.addShop(user_id, name, description, location, bank_info)
    }

    adminDisplayShopHistory(user_id: number, shop_id: number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.adminDisplayShopHistory(user_id, shop_id);
    }

    adminDisplayUserHistory(admin:number, target_id:number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.adminDisplayUserHistory(admin, target_id)
    }

    appointManager(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.appointManager(user_id, shop_id, appointee_user_email)
    }

    appointOwner(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.appointOwner(user_id, shop_id, appointee_user_email)
    }

    closeSession(user_id: number): void {
        if(this.system == undefined){
            return
        }
        return this.system.closeSession(user_id)
    }

    displayShoppingCart(user_id: number): string | string[][] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.displayShoppingCart(user_id)
    }

    displayShops(): any {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.displayShops()
    }

    displayStaffInfo(user_id: number, shop_id: number): string[] | string {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.displayStaffInfo(user_id, shop_id)
    }

    editPermissions(user_id: number, shop_id: number, target_email: string, actions: Action[]): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.editPermissions(user_id, shop_id, target_email, actions)
    }

    editShoppingCart(user_id: number, shop_id: number, product_id: number, amount: number): string | void {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.editShoppingCart(user_id, shop_id, product_id, amount)
    }

    filterSearch(search_type: SearchTypes, search_term: string, filters: Filter[]): string[] {
        if(this.system == undefined){
            return [TestNotAssociatedWithImplementation]
        }
        return this.system.filterSearch(search_type, search_term, filters)
    }

    getItemsFromShop(shop_id: number): any {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.getItemsFromShop(shop_id)
    }

    logout(user_email: string): number {
        if(this.system == undefined){
            return -1
        }
        return this.system.logout(user_email)
    }

    openSession(): number {
        if(this.system == undefined){
            return -1
        }
        return this.system.openSession()
    }

    performGuestLogin(): number {
        if(this.system == undefined){
            return -1
        }
        return this.system.performGuestLogin()
    }

    performLogin(user_email: string, password: string): string | number {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.performLogin(user_email, password)
    }

    performRegister(user_email: string, password: string): boolean {
        if(this.system == undefined){
            return false
        }
        return this.system.performRegister(user_email, password)
    }

    purchaseCart(user_id: number, payment_info: string): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.purchaseCart(user_id, payment_info)
    }

    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.purchaseShoppingBasket(user_id, shop_id, payment_info)
    }

    removeProduct(user_id: number, shop_id: number, product_id: number): boolean | string {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.removeProduct(user_id, shop_id, product_id)
    }

    searchItemFromShops(search_type: SearchTypes, search_term: string): any {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.searchItemFromShops(search_type, search_term)
    }

    shopOrderHistory(user_id: number, shop_id: number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.shopOrderHistory(user_id, shop_id)
    }

    editProduct(user_id: number, shop_id: number, product_id: number, action: Item_Action, value: string): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.editProduct(user_id, shop_id, product_id, action, value)
    }

    getShopInfo(shop_id: number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.getShopInfo(shop_id);
    }

    removeManager(user_id: number, shop_id: number, target: string): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.removeManager(user_id, shop_id, target);
    }
}