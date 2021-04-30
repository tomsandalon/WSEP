import {SearchTypes, System, SystemImpl} from "../Domain/System";
import {Filter, Item_Action} from "../Domain/Shop/ShopInventory";
import {Action} from "../Domain/ShopPersonnel/Permissions";
import {PurchaseType} from "../Domain/PurchaseProperties/PurchaseType";
import {DiscountType} from "../Domain/PurchaseProperties/DiscountType";

class Service implements System {
    private _system: System

    constructor(reset?: boolean) {
        this._system = SystemImpl.getInstance(reset);
    }

    addItemToBasket(user_id: number, product_id: number, shop_id: number, amount: number): string | void {
        return this._system.addItemToBasket(user_id, product_id, shop_id, amount);
    }

    addPermissions(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        return this._system.addPermissions(user_id, shop_id, target_email, action)
    }

    addProduct(user_id: number, shop_id: number, name: string, description: string, amount: number, categories: string[], base_price: number, discount_type: DiscountType, purchase_type: PurchaseType): boolean | string {
        return this._system.addProduct(user_id, shop_id, name, description, amount, categories, base_price, discount_type, purchase_type)
    }

    addShop(user_id: number, name: string, description: string, location: string, bank_info: string): number | string {
        return this._system.addShop(user_id, name, description, location, bank_info)
    }

    adminDisplayShopHistory(admin: number, shop_id: number): string | string[] {
        return this._system.adminDisplayShopHistory(admin, shop_id)
    }

    adminDisplayUserHistory(admin: number, target_id: number): string | string[] {
        return this._system.adminDisplayUserHistory(admin, target_id)
    }

    appointManager(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        return this._system.appointManager(user_id, shop_id, appointee_user_email)
    }

    appointOwner(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        return this._system.appointOwner(user_id, shop_id, appointee_user_email)
    }

    closeSession(user_id: number): void {
        return this._system.closeSession(user_id)
    }

    displayShoppingCart(user_id: number): string | string[][] {
        return this._system.displayShoppingCart(user_id)
    }

    displayShops(): string | string[] {
        return this._system.displayShops()
    }

    displayStaffInfo(user_id: number, shop_id: number): string[] | string {
        return this._system.displayStaffInfo(user_id, shop_id)
    }

    editPermissions(user_id: number, shop_id: number, target_email: string, actions: Action[]): string | boolean {
        return this._system.editPermissions(user_id, shop_id, target_email, actions)
    }

    editProduct(user_id: number, shop_id: number, product_id: number, action: Item_Action, value: string): string | boolean {
        return this._system.editProduct(user_id, shop_id, product_id, action, value)
    }

    editShoppingCart(user_id: number, shop_id: number, product_id: number, amount: number): string | void {
        return this._system.editShoppingCart(user_id, shop_id, product_id, amount)
    }

    filterSearch(search_type: SearchTypes, search_term: string, filters: Filter[]): string[] {
        return this._system.filterSearch(search_type, search_term, filters)
    }

    getItemsFromShop(shop_id: number): any {
        return this._system.getItemsFromShop(shop_id)
    }

    getShopInfo(shop_id: number): string | string[] {
        return this._system.getShopInfo(shop_id);
    }

    logout(user_email: string): number {
        return this._system.logout(user_email)
    }

    openSession(): number {
        return this._system.openSession()
    }

    performGuestLogin(): number {
        return this._system.performGuestLogin()
    }

    performLogin(user_email: string, password: string): string | number {
        return this._system.performLogin(user_email, password)
    }

    performRegister(user_email: string, password: string): boolean {
        return this._system.performRegister(user_email, password)
    }

    purchaseCart(user_id: number, payment_info: string): string | boolean {
        return this._system.purchaseCart(user_id, payment_info)
    }

    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string): string | boolean {
        return this._system.purchaseShoppingBasket(user_id, shop_id, payment_info)
    }

    removeManager(user_id: number, shop_id: number, target: string): string | boolean {
        return this._system.removeManager(user_id, shop_id, target)
    }

    removeProduct(user_id: number, shop_id: number, product_id: number): boolean | string {
        return this._system.removeProduct(user_id, shop_id, product_id)
    }

    searchItemFromShops(search_type: SearchTypes, search_term: string): any {
        return this._system.searchItemFromShops(search_type, search_term)
    }

    shopOrderHistory(user_id: number, shop_id: number): string | string[] {
        return this._system.shopOrderHistory(user_id, shop_id)
    }

    userOrderHistory(user_id: number): string | string[] {
        return this._system.userOrderHistory(user_id)
    }

}