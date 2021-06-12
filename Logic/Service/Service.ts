import {SearchTypes, System, SystemImpl} from "../Domain/System";
import {Filter, Filter_Type, Item_Action, Purchase_Type} from "../Domain/Shop/ShopInventory";
import {Action} from "../Domain/ShopPersonnel/Permissions";
import {Condition} from "../Domain/Shop/DiscountPolicy/ConditionalDiscount";
import {LogicComposition} from "../Domain/Shop/DiscountPolicy/LogicCompositionDiscount";
import {NumericOperation} from "../Domain/Shop/DiscountPolicy/NumericCompositionDiscount";
import {ConditionType} from "../Domain/Shop/PurchasePolicy/SimpleCondition";
import {Operator} from "../Domain/Shop/PurchasePolicy/CompositeCondition";
import {Purchase_Info} from "../../ExternalApiAdapters/PaymentAndSupplyAdapter";

// import {PurchaseType} from "../Domain/PurchaseProperties/PurchaseType";

export class Service {
    private _system: System

    constructor(reset?: boolean) {
        this._system = SystemImpl.getInstance(reset);
    }

    init(): Promise<void> {
        return this._system.init();
    }

    public initData() {
        // const no_to_all: DiscountType = {
        //     percent: 0.5, // 0 <= percent <= 1
        //     expiration_date: new Date(),
        //     can_be_applied: value => true,
        //     applyDiscount: value => 0.5
        // }
        const dummy: Purchase_Type = Purchase_Type.Immediate
        this._system.performRegister("Liorpev@gmail.com", "123456")
        this._system.performRegister("Mark@gmail.com", "123456")
        this._system.performRegister("TomAndSons@gmail.com", "123456") // Owner
        this._system.performRegister("Tomer@gmail.com", "123456") // Manager
        this._system.performRegister("a@gmail.com", "123456")
        this._system.performRegister("b@gmail.com", "123456")

        const tom_id = this._system.performLogin("TomAndSons@gmail.com", "123456")
        if (typeof tom_id === "string")
            return
        const nvidia_id = this.addShop(tom_id, "INVIDIA", "BEST GPU 4 Ever", 'Taiwan', "Taiwan 4 ever")
        const zara_id = this.addShop(tom_id, "ZARA", "Best style in UK", 'China', "Budaa 4 ever")
        if (typeof nvidia_id === "string" || typeof zara_id === "string")
            return
        this.addProduct(tom_id, nvidia_id, "GTX 1060", "6GB RAM", 50, ["GPU"], 1000, dummy)
        this.addProduct(tom_id, nvidia_id, "RTX 3080", "Best performance", 1, ["GPU"], 2000, dummy)
        this.addProduct(tom_id, nvidia_id, "RTX 2080", "Best power consumption", 0, ["GPU"], 3000, dummy)
        this.addProduct(tom_id, nvidia_id, "GTX 280", "Innovative tech", 30, ["GPU"], 4000, dummy)
        this.addProduct(tom_id, nvidia_id, "GTX 980", "Economic power device", 10, ["GPU"], 5000, dummy)
        this.addDiscount(tom_id, nvidia_id, 0.5)
        this.addConditionToDiscount(tom_id, nvidia_id, 0, Condition.Amount, "3")
        this.addDiscount(tom_id, nvidia_id, 0.2)

        this.addProduct(tom_id, zara_id, "Leather Jacket", "Leather from black mamba", 500, ["Winter", "Men"], 1000, dummy)
        this.addProduct(tom_id, zara_id, "Fur for lady", "From white fox", 400, ["Winter", "Evening"], 1000, dummy)
        this.addProduct(tom_id, zara_id, "Lycra shirt", "made in Japan", 100, ["Evening", "Men"], 1000, dummy)
        this.addProduct(tom_id, zara_id, "Boots", "made in USA", 70, ["Shoes"], 1000, dummy)
        this.addProduct(tom_id, zara_id, "Shoes", "Made form plastic", 800, ["Shoes"], 1000, dummy)

        this.addPurchasePolicy(tom_id, nvidia_id, ConditionType.GreaterAmount, "4")
        this.logout(tom_id);
    }

    addConditionToDiscount(user_id: number, shop_id: number, id: number, condition: Condition, condition_param: string): string | boolean {
        return this._system.addConditionToDiscount(user_id, shop_id, id, condition, condition_param);
    }

    addDiscount(user_id: number, shop_id: number, value: number): string | boolean {
        return this._system.addDiscount(user_id, shop_id, value)
    }

    addLogicComposeDiscount(user_id: number, shop_id: number, operation: LogicComposition, d_id1: number, d_id2: number): string | boolean {
        return this._system.addLogicComposeDiscount(user_id, shop_id, operation, d_id1, d_id2)
    }

    addNumericComposeDiscount(user_id: number, shop_id: number, operation: NumericOperation, d_id1: number, d_id2: number): string | boolean {
        return this._system.addNumericComposeDiscount(user_id, shop_id, operation, d_id1, d_id2);
    }

    addPurchasePolicy(user_id: number, shop_id: number, condition: ConditionType, value: string): string[] | string {
        return this._system.addPurchasePolicy(user_id, shop_id, condition, value)
    }

    composePurchasePolicy(user_id: number, shop_id: number, policy_id1: number, policy_id2: number, operator: Operator): boolean | string {
        return this._system.composePurchasePolicy(user_id, shop_id, policy_id1, policy_id2, operator)
    }

    removeOwner(user_id: number, shop_id: number, target: string): string | boolean {
        return this._system.removeOwner(user_id, shop_id, target)
    }

    removePurchasePolicy(user_id: number, shop_id: number, policy_id: number): string | boolean {
        return this._system.removePurchasePolicy(user_id, shop_id, policy_id)
    }
    addItemToBasket(user_id: number, product_id: number, shop_id: number, amount: number): string | void {
        return this._system.addItemToBasket(user_id, product_id, shop_id, amount);
    }

    addPermissions(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        return this._system.addPermissions(user_id, shop_id, target_email, action)
    }

    addProduct(user_id: number, shop_id: number, name: string, description: string, amount: number, categories: string[], base_price: number, purchase_type?: Purchase_Type): boolean | string {
        return this._system.addProduct(user_id, shop_id, name, description, amount, categories, base_price, purchase_type)
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

    removeItemFromBasket(user_id: number, shop_id: number, product_id: number): string | void {
        return this._system.editShoppingCart(user_id, shop_id, product_id, 0)
    }

    filterSearch(category_list: string, min_price: number, max_price: number,
                 rating: number, name_search_term: string): string[] {
        const search_type = SearchTypes.name
        const search_term = name_search_term
        const categories = category_list.split(",")
        let filters: Filter[] = []
        if (categories.length > 0 && category_list.length > 0) {
            categories.forEach(c => {
                filters = filters.concat([{filter_type: Filter_Type.Category, filter_value: c}])
            })
        }
        if (min_price > 0) {
            filters = filters.concat([{filter_type: Filter_Type.AbovePrice, filter_value: min_price.toString()}])
        }
        if (max_price > 0) {
            filters = filters.concat([{filter_type: Filter_Type.AbovePrice, filter_value: max_price.toString()}])
        }
        //ignore rating
        return this._system.filterSearch(search_type, search_term, filters)
    }

    getItemsFromShop(shop_id: number): any {
        return this._system.getItemsFromShop(shop_id)
    }

    getShopInfo(shop_id: number): string | string[] {
        return this._system.getShopInfo(shop_id);
    }

    logout(user_id: number): string | boolean {
        return this._system.logout(user_id);
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

    performRegister(user_email: string, password: string, age: string): boolean {
        return this._system.performRegister(user_email, password, age.length == 0 || isNaN(Number(age)) ? undefined : Number(age))
    }

    private static isValidPurchaseInfo(info: Purchase_Info): boolean {
        return info.payment_info != undefined &&
            info.payment_info.ccv != undefined &&
            info.payment_info.year != undefined &&
            info.payment_info.month != undefined &&
            info.payment_info.card_number != undefined &&
            info.payment_info.holder_id != undefined &&
            info.payment_info.holder_name != undefined &&
            info.delivery_info.name != undefined &&
            info.delivery_info.zip != undefined &&
            info.delivery_info.city != undefined &&
            info.delivery_info.address != undefined &&
            info.delivery_info.country != undefined
    }

    private static getPurchaseInfoOrString(payment_info: string): string | Purchase_Info {
        try {
            const parsed_info: Purchase_Info = JSON.parse(payment_info);
            if (Service.isValidPurchaseInfo(parsed_info)) return parsed_info
            return payment_info
        } catch (e) {
            return payment_info
        }
    }

    purchaseCart(user_id: number, payment_info: string): Promise<string | boolean> {
        return this._system.purchaseCart(user_id, Service.getPurchaseInfoOrString(payment_info))
    }

    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string): Promise<string | boolean> {
        console.log(typeof Service.getPurchaseInfoOrString(payment_info));
        return this._system.purchaseShoppingBasket(user_id, shop_id, Service.getPurchaseInfoOrString(payment_info))
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

    getAllDiscounts(user_id: number, shop_id: number): string | string[] {
        return this._system.getAllDiscounts(user_id, shop_id);
    }

    getAllPurchasePolicies(user_id: number, shop_id: number): string | string[] {
        return this._system.getAllPurchasePolicies(user_id, shop_id)
    }

    removeDiscount(user_id: number, shop_id: number, id: number): string | boolean {
        return this._system.removeDiscount(user_id, shop_id, id)
    }

    getAllShops(user_id: number): string | string[] {
        return this._system.getAllShops(user_id)
    }

    isAdmin(user_id: number): boolean {
        return (this._system.isAdmin(user_id) as boolean);
    }

    isManager(user_id: number): boolean {
        return (this._system.isManager(user_id) as boolean)
    }

    isOwner(user_id: number): boolean {
        return (this._system.isOwner(user_id) as boolean)
    }

    getAllUsers(user_id: number): string | string[] {
        return this._system.getAllUsers(user_id);
    }

    getManagingShops(user_id: number): string | string[] {
        return this._system.getManagingShops(user_id)
    }

    getPermissions(user_id: number, shop_id: number): string | string[] {
        return this._system.getPermissions(user_id, shop_id)
    }

    isLoggedIn(user_id: number): boolean {
        return (this._system.isLoggedIn(user_id) as boolean)
    }

    getAllCategories(user_id: number): string | string [] {
        return this._system.getAllCategories(user_id)
    }

    rateProduct(user_id: number, shop_id: number, product_id: number, rating: number): string | boolean {
        return this._system.rateProduct(user_id, shop_id, product_id, rating)
    }

    removePermission(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        return this._system.removePermission(user_id, shop_id, target_email, action)
    }

    //string is bad, string[] is good and the answer is at [0]
    getUserEmailFromUserId(user_id: number): string | string[] {
        return this._system.getUserEmailFromUserId(user_id);
    }

    isAvailable(): boolean {
        return true
    }

    connectToDB() {

    }
}