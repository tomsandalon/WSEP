import {SearchTypes, SystemImpl} from "../Domain/System";
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
    system: SystemImpl
    constructor(reset?: boolean) {
        this.system = SystemImpl.getInstance(reset)
    }
    init(): Promise<void> {
        // return Promise.resolve()
        return this.system.init();
    }

    public initData() {
        const immediate: Purchase_Type = Purchase_Type.Immediate
        const offer: Purchase_Type = Purchase_Type.Offer
        this.system.performRegister("Liorpev@gmail.com", "123456")
        this.system.performRegister("Mark@gmail.com", "123456")
        this.system.performRegister("TomAndSons@gmail.com", "123456") // Owner
        this.system.performRegister("Tomer@gmail.com", "123456") // Manager
        this.system.performRegister("a@gmail.com", "123456")
        this.system.performRegister("b@gmail.com", "123456")

        const tom_id = this.system.performLogin("TomAndSons@gmail.com", "123456")
        if (typeof tom_id === "string")
            return
        const nvidia_id = this.addShop(tom_id, "INVIDIA", "BEST GPU 4 Ever", 'Taiwan', "Taiwan 4 ever")
        const zara_id = this.addShop(tom_id, "ZARA", "Best style in UK", 'China', "Budaa 4 ever")
        if (typeof nvidia_id === "string" || typeof zara_id === "string")
            return
        this.addPurchaseType(tom_id, nvidia_id, Purchase_Type.Offer)
        this.addProduct(tom_id, nvidia_id, "GTX 1060", "6GB RAM", 50, ["GPU"], 1000, immediate)
        this.addProduct(tom_id, nvidia_id, "RTX 3080", "Best performance", 10, ["GPU"], 2000, offer)
        this.addProduct(tom_id, nvidia_id, "RTX 2080", "Best power consumption", 0, ["GPU"], 3000, offer)
        this.addProduct(tom_id, nvidia_id, "GTX 280", "Innovative tech", 30, ["GPU"], 4000, immediate)
        this.addProduct(tom_id, nvidia_id, "GTX 980", "Economic power device", 10, ["GPU"], 5000, immediate)
        this.addDiscount(tom_id, nvidia_id, 0.5)
        this.addConditionToDiscount(tom_id, nvidia_id, 0, Condition.Amount, "3")
        this.addDiscount(tom_id, nvidia_id, 0.2)

        this.addProduct(tom_id, zara_id, "Leather Jacket", "Leather from black mamba", 500, ["Winter", "Men"], 1000, immediate)
        this.addProduct(tom_id, zara_id, "Fur for lady", "From white fox", 400, ["Winter", "Evening"], 1000, immediate)
        this.addProduct(tom_id, zara_id, "Lycra shirt", "made in Japan", 100, ["Evening", "Men"], 1000, immediate)
        this.addProduct(tom_id, zara_id, "Boots", "made in USA", 70, ["Shoes"], 1000, immediate)
        this.addProduct(tom_id, zara_id, "Shoes", "Made form plastic", 800, ["Shoes"], 1000, immediate)

        const someone = this.system.performLogin("a@gmail.com", "123456") as number
        this.makeOffer(someone, nvidia_id, 1, 2, 3)

        this.addPurchasePolicy(tom_id, nvidia_id, ConditionType.GreaterAmount, "4")
        this.logout(tom_id);
        this.logout(someone)
    }

    addConditionToDiscount(user_id: number, shop_id: number, id: number, condition: Condition, condition_param: string): string | boolean {
        return this.system.addConditionToDiscount(user_id, shop_id, id, condition, condition_param);
    }

    addDiscount(user_id: number, shop_id: number, value: number): string | boolean {
        return this.system.addDiscount(user_id, shop_id, value)
    }

    addLogicComposeDiscount(user_id: number, shop_id: number, operation: LogicComposition, d_id1: number, d_id2: number): string | boolean {
        return this.system.addLogicComposeDiscount(user_id, shop_id, operation, d_id1, d_id2)
    }

    addNumericComposeDiscount(user_id: number, shop_id: number, operation: NumericOperation, d_id1: number, d_id2: number): string | boolean {
        return this.system.addNumericComposeDiscount(user_id, shop_id, operation, d_id1, d_id2);
    }

    addPurchasePolicy(user_id: number, shop_id: number, condition: ConditionType, value: string): string[] | string {
        return this.system.addPurchasePolicy(user_id, shop_id, condition, value)
    }

    composePurchasePolicy(user_id: number, shop_id: number, policy_id1: number, policy_id2: number, operator: Operator): boolean | string {
        return this.system.composePurchasePolicy(user_id, shop_id, policy_id1, policy_id2, operator)
    }

    removeOwner(user_id: number, shop_id: number, target: string): string | boolean {
        return this.system.removeOwner(user_id, shop_id, target)
    }

    removePurchasePolicy(user_id: number, shop_id: number, policy_id: number): string | boolean {
        return this.system.removePurchasePolicy(user_id, shop_id, policy_id)
    }

    addItemToBasket(user_id: number, product_id: number, shop_id: number, amount: number): string | void {
        return this.system.addItemToBasket(user_id, product_id, shop_id, amount);
    }

    addPermissions(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        return this.system.addPermissions(user_id, shop_id, target_email, action)
    }

    addProduct(user_id: number, shop_id: number, name: string, description: string, amount: number, categories: string[], base_price: number, purchase_type?: Purchase_Type): boolean | string {
        return this.system.addProduct(user_id, shop_id, name, description, amount, categories, base_price, purchase_type)
    }

    addShop(user_id: number, name: string, description: string, location: string, bank_info: string): number | string {
        return this.system.addShop(user_id, name, description, location, bank_info)
    }

    adminDisplayShopHistory(admin: number, shop_id: number): string | string[] {
        return this.system.adminDisplayShopHistory(admin, shop_id)
    }

    adminDisplayUserHistory(admin: number, target_id: number): string | string[] {
        return this.system.adminDisplayUserHistory(admin, target_id)
    }

    appointManager(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        return this.system.appointManager(user_id, shop_id, appointee_user_email)
    }

    appointOwner(user_id: number, shop_id: number, appointee_user_email: string): string | boolean {
        return this.system.appointOwner(user_id, shop_id, appointee_user_email)
    }

    closeSession(user_id: number): void {
        return this.system.closeSession(user_id)
    }

    displayShoppingCart(user_id: number): string | string[][] {
        return this.system.displayShoppingCart(user_id)
    }

    displayShops(): string | string[] {
        return this.system.displayShops()
    }

    displayStaffInfo(user_id: number, shop_id: number): string[] | string {
        return this.system.displayStaffInfo(user_id, shop_id)
    }

    editPermissions(user_id: number, shop_id: number, target_email: string, actions: Action[]): string | boolean {
        return this.system.editPermissions(user_id, shop_id, target_email, actions)
    }

    editProduct(user_id: number, shop_id: number, product_id: number, action: Item_Action, value: string): string | boolean {
        return this.system.editProduct(user_id, shop_id, product_id, action, value)
    }

    editShoppingCart(user_id: number, shop_id: number, product_id: number, amount: number): string | void {
        return this.system.editShoppingCart(user_id, shop_id, product_id, amount)
    }

    removeItemFromBasket(user_id: number, shop_id: number, product_id: number): string | void {
        return this.system.editShoppingCart(user_id, shop_id, product_id, 0)
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
        return this.system.filterSearch(search_type, search_term, filters)
    }

    getItemsFromShop(shop_id: number): any {
        return this.system.getItemsFromShop(shop_id)
    }

    getShopInfo(shop_id: number): string | string[] {
        return this.system.getShopInfo(shop_id);
    }

    logout(user_id: number): string | boolean {
        return this.system.logout(user_id);
    }

    openSession(): number {
        return this.system.openSession()
    }

    performGuestLogin(): number {
        return this.system.performGuestLogin()
    }

    performLogin(user_email: string, password: string): string | number {
        return this.system.performLogin(user_email, password)
    }

    performRegister(user_email: string, password: string, age: string): boolean {
        return this.system.performRegister(user_email, password, age.length == 0 || isNaN(Number(age)) ? undefined : Number(age))
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
        return this.system.purchaseCart(user_id, Service.getPurchaseInfoOrString(payment_info))
    }

    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string): Promise<string | boolean> {
        return this.system.purchaseShoppingBasket(user_id, shop_id, Service.getPurchaseInfoOrString(payment_info))
    }

    removeManager(user_id: number, shop_id: number, target: string): string | boolean {
        return this.system.removeManager(user_id, shop_id, target)
    }

    removeProduct(user_id: number, shop_id: number, product_id: number): boolean | string {
        return this.system.removeProduct(user_id, shop_id, product_id)
    }

    searchItemFromShops(search_type: SearchTypes, search_term: string): any {
        return this.system.searchItemFromShops(search_type, search_term)
    }

    shopOrderHistory(user_id: number, shop_id: number): string | string[] {
        return this.system.shopOrderHistory(user_id, shop_id)
    }

    userOrderHistory(user_id: number): string | string[] {
        return this.system.userOrderHistory(user_id)
    }

    getAllDiscounts(user_id: number, shop_id: number): string | string[] {
        return this.system.getAllDiscounts(user_id, shop_id);
    }

    getAllPurchasePolicies(user_id: number, shop_id: number): string | string[] {
        return this.system.getAllPurchasePolicies(user_id, shop_id)
    }

    removeDiscount(user_id: number, shop_id: number, id: number): string | boolean {
        return this.system.removeDiscount(user_id, shop_id, id)
    }

    getAllShops(user_id: number): string | string[] {
        return this.system.getAllShops(user_id)
    }

    isAdmin(user_id: number): boolean {
        return (this.system.isAdmin(user_id) as boolean);
    }

    isManager(user_id: number): boolean {
        return (this.system.isManager(user_id) as boolean)
    }

    isOwner(user_id: number): boolean {
        return (this.system.isOwner(user_id) as boolean)
    }

    getAllUsers(user_id: number): string | string[] {
        return this.system.getAllUsers(user_id);
    }

    getManagingShops(user_id: number): string | string[] {
        return this.system.getManagingShops(user_id)
    }

    getPermissions(user_id: number, shop_id: number): string | string[] {
        return this.system.getPermissions(user_id, shop_id)
    }

    isLoggedIn(user_id: number): boolean {
        return (this.system.isLoggedIn(user_id) as boolean)
    }

    getAllCategories(user_id: number): string | string [] {
        return this.system.getAllCategories(user_id)
    }

    rateProduct(user_id: number, shop_id: number, product_id: number, rating: number): string | boolean {
        return this.system.rateProduct(user_id, shop_id, product_id, rating)
    }

    removePermission(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        return this.system.removePermission(user_id, shop_id, target_email, action)
    }

    //string is bad, string[] is good and the answer is at [0]
    getUserEmailFromUserId(user_id: number): string | string[] {
        return this.system.getUserEmailFromUserId(user_id);
    }

    isAvailable(): boolean {
        return true
    }

    connectToDB() {

    }

    makeOffer(user_id: number, shop_id: number, product_id: number, amount: number, price_per_unit: number): string | boolean {
        return this.system.makeOffer(user_id, shop_id, product_id, amount, price_per_unit)
    }

    getActiveOffersAsUser(user_id: number): string | string[] {
        return this.system.getActiveOffersAsUser(user_id)
    }

    getActiveOfferForShop(user_id: number, shop_id: number): string | string[] {
        return this.system.getActiveOfferForShop(user_id, shop_id)
    }

    acceptOfferAsManagement(user_id: number, shop_id: number, offer_id: number): string | boolean {
        return this.system.acceptOfferAsManagement(user_id, shop_id, offer_id)
    }

    denyOfferAsManagement(user_id: number, shop_id: number, offer_id: number): string | boolean {
        return this.system.denyOfferAsManagement(user_id, shop_id, offer_id)
    }

    counterOfferAsManager(user_id: number, shop_id: number, offer_id: number, new_price_per_unit: number): string | boolean {
        return this.system.counterOfferAsManager(user_id, shop_id, offer_id, new_price_per_unit)
    }

    denyCounterOfferAsUser(user_id: number, offer_id: number): string | boolean {
        return this.system.denyCounterOfferAsUser(user_id, offer_id)
    }

    offerIsPurchasable(user_id: number, shop_id: number, offer_id: number): string | boolean {
        return this.system.offerIsPurchasable(user_id, shop_id, offer_id)
    }

    purchaseOffer(user_id: number, offer_id: number, payment_info: string): Promise<string | boolean> {
        return this.system.purchaseOffer(user_id, offer_id, Service.getPurchaseInfoOrString(payment_info))
    }

    removePurchaseType(user_id: number, shop_id: number, purchase_type: Purchase_Type): string | boolean {
        return this.system.removePurchaseType(user_id, shop_id, purchase_type)
    }

    addPurchaseType(user_id: number, shop_id: number, purchase_type: Purchase_Type): string | boolean {
        return this.system.addPurchaseType(user_id, shop_id, purchase_type)
    }

    counterOfferAsUser(user_id: number, shop_id: number, offer_id: number, new_price_per_unit: number): string | boolean {
        return this.system.counterOfferAsUser(user_id, shop_id, offer_id, new_price_per_unit)
    }

    getPurchaseTypes(user_id: number, shop_id: number): string | number[] {
        return [0, 1];
    }
}