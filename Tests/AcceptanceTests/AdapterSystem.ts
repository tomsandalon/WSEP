import {SearchTypes, System} from "../../Logic/Domain/System";
import {Action} from "../../Logic/Domain/ShopPersonnel/Permissions";
// import {PurchaseType} from "../../Logic/Domain/PurchaseProperties/PurchaseType";
import {Filter, Item_Action, Purchase_Type} from "../../Logic/Domain/Shop/ShopInventory";
import {Condition} from "../../Logic/Domain/Shop/DiscountPolicy/ConditionalDiscount";
import {LogicComposition} from "../../Logic/Domain/Shop/DiscountPolicy/LogicCompositionDiscount";
import {NumericOperation} from "../../Logic/Domain/Shop/DiscountPolicy/NumericCompositionDiscount";
import {ConditionType} from "../../Logic/Domain/Shop/PurchasePolicy/SimpleCondition";
import {Operator} from "../../Logic/Domain/Shop/PurchasePolicy/CompositeCondition";
import {Purchase_Info} from "../../ExternalApiAdapters/PaymentAndSupplyAdapter";

export class AdapterSystem implements System {

    private system: System;

    public constructor(system: System) {
        this.system = system
    }

    init(): Promise<void> {
        return this.system.init();
    }

    userOrderHistory(user_id: number): string | string[] {
        return this.system.userOrderHistory(user_id);
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

    adminDisplayShopHistory(user_id: number, shop_id: number): string | string[] {
        return this.system.adminDisplayShopHistory(user_id, shop_id);
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

    displayShops(): any {
        return this.system.displayShops()
    }

    displayStaffInfo(user_id: number, shop_id: number): string[] | string {
        return this.system.displayStaffInfo(user_id, shop_id)
    }

    editPermissions(user_id: number, shop_id: number, target_email: string, actions: Action[]): string | boolean {
        return this.system.editPermissions(user_id, shop_id, target_email, actions)
    }

    editShoppingCart(user_id: number, shop_id: number, product_id: number, amount: number): string | void {
        return this.system.editShoppingCart(user_id, shop_id, product_id, amount)
    }

    filterSearch(search_type: SearchTypes, search_term: string, filters: Filter[]): string[] {
        return this.system.filterSearch(search_type, search_term, filters)
    }

    getItemsFromShop(shop_id: number): any {
        return this.system.getItemsFromShop(shop_id)
    }

    logout(user_id: number): string | boolean { //what happens where?
        return this.system.logout(user_id)
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

    performRegister(user_email: string, password: string): boolean {
        return this.system.performRegister(user_email, password)
    }

    async purchaseCart(user_id: number, payment_info: string | Purchase_Info): Promise<string | boolean> {
        return await this.system.purchaseCart(user_id, payment_info)
    }

    async purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string | Purchase_Info): Promise<string | boolean> {
        return await this.system.purchaseShoppingBasket(user_id, shop_id, payment_info)
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

    editProduct(user_id: number, shop_id: number, product_id: number, action: Item_Action, value: string): string | boolean {
        return this.system.editProduct(user_id, shop_id, product_id, action, value);
    }

    getShopInfo(shop_id: number): string | string[] {
        return this.system.getShopInfo(shop_id);
    }

    removeManager(user_id: number, shop_id: number, target: string): string | boolean {
        return this.system.removeManager(user_id, shop_id, target)
    }

    spellCheck(input: string): string | string[] {
        return ''
    }

    isAdmin(user_id: number): string | boolean {
        return this.system.isAdmin(user_id);
    }

    isManager(user_id: number): string | boolean {
        return this.system.isManager(user_id);
    }

    isOwner(user_id: number): string | boolean {
        return this.system.isOwner(user_id);
    }

    addConditionToDiscount(user_id: number, shop_id: number, id: number, condition: Condition, condition_param: string): string | boolean {
        return this.system.addConditionToDiscount(user_id, shop_id, id, condition, condition_param)
    }

    addDiscount(user_id: number, shop_id: number, value: number): string | boolean {
        return this.system.addDiscount(user_id, shop_id, value)
    }

    addLogicComposeDiscount(user_id: number, shop_id: number, operation: LogicComposition, d_id1: number, d_id2: number): string | boolean {
        return this.system.addLogicComposeDiscount(user_id, shop_id, operation, d_id1, d_id2)
    }

    addNumericComposeDiscount(user_id: number, shop_id: number, operation: NumericOperation, d_id1: number, d_id2: number): string | boolean {
        return this.system.addNumericComposeDiscount(user_id, shop_id, operation, d_id1, d_id2)
    }

    addPurchasePolicy(user_id: number, shop_id: number, condition: ConditionType, value: string): string[] | string {
        return this.system.addPurchasePolicy(user_id, shop_id, condition, value)
    }

    composePurchasePolicy(user_id: number, shop_id: number, policy_id1: number, policy_id2: number, operator: Operator): boolean | string {
        return this.system.composePurchasePolicy(user_id, shop_id, policy_id1, policy_id2, operator)
    }

    getAllCategories(user_id: number): string | string[] {
        return this.system.getAllCategories(user_id)
    }

    getAllDiscounts(user_id: number, shop_id: number): string | string[] {
        return this.system.getAllDiscounts(user_id, shop_id)
    }

    getAllPurchasePolicies(user_id: number, shop_id: number): string | string[] {
        return this.system.getAllPurchasePolicies(user_id, shop_id)
    }

    getAllShops(user_id: number): string | string[] {
        return this.system.getAllShops(user_id)
    }

    getAllUsers(user_id: number): string | string[] {
        return this.system.getAllUsers(user_id)
    }

    getManagingShops(user_id: number): string | string[] {
        return this.system.getManagingShops(user_id)
    }

    getPermissions(user_id: number, shop_id: number): string | string[] {
        return this.system.getPermissions(user_id, shop_id)
    }

    isLoggedIn(user_id: number): string | boolean {
        return this.system.isLoggedIn(user_id)
    }

    removeDiscount(user_id: number, shop_id: number, id: number): string | boolean {
        return this.system.removeDiscount(user_id, shop_id, id)
    }

    removeOwner(user_id: number, shop_id: number, target: string): string | boolean {
        return this.system.removeOwner(user_id, shop_id, target)
    }

    removePurchasePolicy(user_id: number, shop_id: number, policy_id: number): string | boolean {
        return this.system.removePurchasePolicy(user_id, shop_id, policy_id)
    }

    rateProduct(user_id: number, shop_id: number, product_id: number, rating: number): string | boolean {
        return this.system.rateProduct(user_id, shop_id, product_id, rating);
    }

    removePermission(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        return this.system.removePermission(user_id, shop_id, target_email, action);
    }

    getUserEmailFromUserId(user_id: number): string | string[] {
        return this.system.getUserEmailFromUserId(user_id);
    }

    acceptOfferAsManagement(user_id: number, shop_id: number, offer_id: number): string | boolean {
        return this.system.acceptOfferAsManagement(user_id, shop_id, offer_id)
    }

    addPurchaseType(user_id: number, shop_id: number, purchase_type: Purchase_Type) {
        return this.system.addPurchaseType(user_id, shop_id, purchase_type)
    }

    counterOfferAsManager(user_id: number, shop_id: number, offer_id: number, new_price_per_unit: number): string | boolean {
        return this.system.counterOfferAsManager(user_id, shop_id, offer_id, new_price_per_unit)
    }

    denyCounterOfferAsUser(user_id: number, offer_id: number): string | boolean {
        return this.system.denyCounterOfferAsUser(user_id, offer_id)
    }

    denyOfferAsManagement(user_id: number, shop_id: number, offer_id: number): string | boolean {
        return this.system.denyOfferAsManagement(user_id, shop_id, offer_id)
    }

    getActiveOfferForShop(user_id: number, shop_id: number): string | string[] {
        return this.system.getActiveOfferForShop(user_id, shop_id)
    }

    getActiveOffersAsUser(user_id: number): string | string[] {
        return this.system.getActiveOffersAsUser(user_id)
    }

    makeOffer(user_id: number, shop_id: number, product_id: number, amount: number, price_per_unit: number): string | boolean {
        return this.system.makeOffer(user_id, shop_id, product_id, amount, price_per_unit)
    }

    offerIsPurchasable(user_id: number, shop_id: number, offer_id: number): string | boolean {
        return this.system.offerIsPurchasable(user_id, shop_id, offer_id)
    }

    purchaseOffer(user_id: number, offer_id: number, payment_info: string | Purchase_Info): Promise<string | boolean> {
        return this.system.purchaseOffer(user_id, offer_id, payment_info)
    }

    removePurchaseType(user_id: number, shop_id: number, purchase_type: Purchase_Type) {
        return this.system.removePurchaseType(user_id, shop_id, purchase_type)
    }

    counterOfferAsUser(user_id: number, shop_id: number, offer_id: number, new_price_per_unit: number): string | boolean {
        return this.system.counterOfferAsUser(user_id, shop_id, offer_id, new_price_per_unit)
    }
}