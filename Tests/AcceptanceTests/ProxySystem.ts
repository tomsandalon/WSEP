import {TestNotAssociatedWithImplementation} from "./System";
import {AdapterSystem} from "./AdapterSystem";
// import {PurchaseType} from "../../Logic/Domain/PurchaseProperties/PurchaseType";
import {Action} from "../../Logic/Domain/ShopPersonnel/Permissions";
import {Filter, Item_Action, Purchase_Type} from "../../Logic/Domain/Shop/ShopInventory";
import {SearchTypes, System} from "../../Logic/Domain/System";
import {Condition} from "../../Logic/Domain/Shop/DiscountPolicy/ConditionalDiscount";
import {LogicComposition} from "../../Logic/Domain/Shop/DiscountPolicy/LogicCompositionDiscount";
import {NumericOperation} from "../../Logic/Domain/Shop/DiscountPolicy/NumericCompositionDiscount";
import {ConditionType} from "../../Logic/Domain/Shop/PurchasePolicy/SimpleCondition";
import {Operator} from "../../Logic/Domain/Shop/PurchasePolicy/CompositeCondition";

export class ProxySystem implements System{
    private readonly system: AdapterSystem | undefined

    constructor(system: AdapterSystem | undefined) {
        this.system = system;
    }

    init(): Promise<void> {
        if(this.system == undefined){
            return Promise.resolve(undefined);
        }
        return this.system.init();
    }

    isAdmin(user_id: number): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.isAdmin(user_id);
    }

    isManager(user_id: number): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.isManager(user_id);
    }
    isOwner(user_id: number): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.isOwner(user_id);
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

    addProduct(user_id: number, shop_id: number, name: string, description: string, amount: number, categories: string[], base_price: number, purchase_type: any): boolean | string {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.addProduct(user_id, shop_id, name, description, amount, categories, base_price, Purchase_Type.Immediate)
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

    logout(user_id: number): string | boolean {
        if(this.system == undefined){
            return false
        }
        return this.system.logout(user_id)
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

    async purchaseCart(user_id: number, payment_info: string): Promise<string | boolean> {
        if (this.system == undefined) {
            return TestNotAssociatedWithImplementation
        }
        return await this.system.purchaseCart(user_id, payment_info)
    }

    async purchaseShoppingBasket(user_id: number, shop_id: number, payment_info: string): Promise<string | boolean> {
        if (this.system == undefined) {
            return TestNotAssociatedWithImplementation
        }
        //for payment service mock
        if (payment_info.includes('MOCK')) {
            if (payment_info.includes('CRASH'))
                return "Payment service has been crashed";
            if (payment_info.includes('FAIL'))
                return false;
            return true;
        }
        //end mock

        return await this.system.purchaseShoppingBasket(user_id, shop_id, payment_info)
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



    getAllCategories(user_id: number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.getAllCategories(user_id)
    }

    getAllUsers(user_id: number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.getAllUsers(user_id)
    }

    getManagingShops(user_id: number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.getManagingShops(user_id)
    }

    getPermissions(user_id: number, shop_id: number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.getPermissions(user_id, shop_id)
    }

    isLoggedIn(user_id: number): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.isLoggedIn(user_id)
    }

    addConditionToDiscount(user_id: number, shop_id: number, id: number, condition: Condition, condition_param: string): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.addConditionToDiscount(user_id, shop_id, id, condition, condition_param)
    }

    addDiscount(user_id: number, shop_id: number, value: number): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.addDiscount(user_id, shop_id, value)
    }

    addLogicComposeDiscount(user_id: number, shop_id: number, operation: LogicComposition, d_id1: number, d_id2: number): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.addLogicComposeDiscount(user_id, shop_id, operation, d_id1, d_id2)
    }

    addNumericComposeDiscount(user_id: number, shop_id: number, operation: NumericOperation, d_id1: number, d_id2: number): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.addNumericComposeDiscount(user_id, shop_id, operation, d_id1, d_id2)
    }

    addPurchasePolicy(user_id: number, shop_id: number, condition: ConditionType, value: string): string[] | string {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.addPurchasePolicy(user_id, shop_id, condition, value)
    }

    composePurchasePolicy(user_id: number, shop_id: number, policy_id1: number, policy_id2: number, operator: Operator): boolean | string {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.composePurchasePolicy(user_id, shop_id, policy_id1, policy_id2, operator)
    }

    getAllDiscounts(user_id: number, shop_id: number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.getAllDiscounts(user_id, shop_id)
    }

    getAllPurchasePolicies(user_id: number, shop_id: number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.getAllPurchasePolicies(user_id, shop_id)
    }

    getAllShops(user_id: number): string | string[] {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.getAllShops(user_id)
    }

    rateProduct(user_id: number, shop_id: number, product_id: number, rating: number): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.rateProduct(user_id, shop_id, product_id, rating)
    }

    removeDiscount(user_id: number, shop_id: number, id: number): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.removeDiscount(user_id, shop_id, id)
    }

    removeOwner(user_id: number, shop_id: number, target: string): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.removeOwner(user_id, shop_id, target)
    }

    removePermission(user_id: number, shop_id: number, target_email: string, action: Action): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.removePermission(user_id, shop_id, target_email, action)
    }

    removePurchasePolicy(user_id: number, shop_id: number, policy_id: number): string | boolean {
        if(this.system == undefined){
            return TestNotAssociatedWithImplementation
        }
        return this.system.removePurchasePolicy(user_id, shop_id, policy_id)
    }

    getUserEmailFromUserId(user_id: number): string | string[] {
        if (this.system == undefined) {
            return TestNotAssociatedWithImplementation
        }
        return this.system.getUserEmailFromUserId(user_id)
    }

    //mock
    spellCheck(input : string ): string | string[]{
        if (input.includes('CRASH'))
            return "spell checker service has been crashed";
        else if (input.includes('FAEEEL'))
            return ['404'];
        else if (input.includes('FAIEL')){
            return ['FAIL'];
        }
        return 'panic: spell checker';
    }

    //mock
    deliverItem(product_id : number, amount: number, shop_id: number, to: string ,transaction_id : boolean | string): boolean {
        if (product_id < 0 || amount < 0 || shop_id < 0 || to.includes("Drop table") || (typeof transaction_id == 'string') )
            return false;
        else
            return true;
    }
}