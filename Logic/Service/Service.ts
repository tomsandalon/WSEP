import {SearchTypes} from "../Domain/System";
import {Filter, Item_Action} from "../Domain/Shop/ShopInventory";
import {Action} from "../Domain/ShopPersonnel/Permissions";
import {PurchaseType} from "../Domain/PurchaseProperties/PurchaseType";
import {DiscountType} from "../Domain/PurchaseProperties/DiscountType";
import {System} from "../Domain/System";
import {SystemImpl} from "../Domain/System.impl";

export class Service {
    private _system: System

    constructor(reset?: boolean) {
        this._system = SystemImpl.getInstance(reset);
    }
    public initData(){
        const no_to_all: DiscountType = {
            percent: 0.5, // 0 <= percent <= 1
            expiration_date: new Date(),
            can_be_applied: value => true,
            applyDiscount: value => 0.5
        }
        const dummy: PurchaseType = {}
        this._system.performRegister("Liorpev@gmail.com", "123456")
        this._system.performRegister("Mark@gmail.com", "123456")
        this._system.performRegister("TomAndSons@gmail.com", "123456") // Owner
        this._system.performRegister("Tomer@gmail.com", "123456") // Manager

        const tom_id = this._system.performLogin("TomAndSons@gmail.com", "123456")
        if (typeof tom_id === "string")
            return
        const nvidia_id = this.addShop(tom_id, "INVIDIA", "BEST GPU 4 Ever", 'Taiwan', "Taiwan 4 ever")
        const zara_id = this.addShop(tom_id, "ZARA", "Best style in UK", 'China', "Budaa 4 ever")
        if (typeof nvidia_id === "string" || typeof zara_id === "string")
            return
        this.addProduct(tom_id, nvidia_id, "GTX 1060", "6GB RAM", 50, ["GPU"], 1000, no_to_all, dummy)
        this.addProduct(tom_id, nvidia_id, "RTX 3080", "Best performance", 1, ["GPU"], 2000, no_to_all, dummy)
        this.addProduct(tom_id, nvidia_id, "RTX 2080", "Best power consumption", 0, ["GPU"], 3000, no_to_all, dummy)
        this.addProduct(tom_id, nvidia_id, "GTX 280", "Innovative tech", 30, ["GPU"], 4000, no_to_all, dummy)
        this.addProduct(tom_id, nvidia_id, "GTX 980", "Economic power device", 10, ["GPU"], 5000, no_to_all, dummy)

        this.addProduct(tom_id, nvidia_id, "Leather Jacket", "Leather from black mamba", 500, ["Winter", "Men"], 1000, no_to_all, dummy)
        this.addProduct(tom_id, nvidia_id, "Fur for lady", "From white fox", 400, ["Winter", "Evening"], 1000, no_to_all, dummy)
        this.addProduct(tom_id, nvidia_id, "Lycra shirt", "made in Japan", 100, ["Evening", "Men"], 1000, no_to_all, dummy)
        this.addProduct(tom_id, nvidia_id, "Boots", "made in USA", 70, ["Shoes"], 1000, no_to_all, dummy)
        this.addProduct(tom_id, nvidia_id, "Shoes", "Made form plastic", 800, ["Shoes"], 1000, no_to_all, dummy)
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