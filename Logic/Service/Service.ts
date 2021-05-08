import {SearchTypes, System, SystemImpl} from "../Domain/System";
import {Filter, Filter_Type, Item_Action, Purchase_Type} from "../Domain/Shop/ShopInventory";
import {Action} from "../Domain/ShopPersonnel/Permissions";
import {Condition} from "../Domain/Shop/DiscountPolicy/ConditionalDiscount";
import {LogicComposition} from "../Domain/Shop/DiscountPolicy/LogicCompositionDiscount";
import {NumericOperation} from "../Domain/Shop/DiscountPolicy/NumericCompositionDiscount";
import {ConditionType} from "../Domain/Shop/PurchasePolicy/SimpleCondition";
import {Operator} from "../Domain/Shop/PurchasePolicy/CompositeCondition";

// import {PurchaseType} from "../Domain/PurchaseProperties/PurchaseType";

class Service {
    private _system: System

    constructor(reset?: boolean) {
        this._system = SystemImpl.getInstance(reset);
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

    addProduct(user_id: number, shop_id: number, name: string, description: string, amount: number, categories: string[], base_price: number, purchase_type: Purchase_Type): boolean | string {
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


    // [19:52, 5/7/2021] ליאור ניתוצ: //(category_name[]strings, min_price:number,max_price:number,rating:number,search_name_term:string)
    //     [19:53, 5/7/2021] ליאור ניתוצ: default value for rating,minprice,maxprice is 0 meaning no need to filter by them
    // [19:53, 5/7/2021] ליאור ניתוצ: default value for search_name is '' meaning no need to filter by it
    // [19:53, 5/7/2021] ליאור ניתוצ: default value for category [] is empty array meaning no need to filter by it
    filterSearch(categories: string[], min_price: number, max_price: number,
                 rating: number, name_search_term: string): string[] {
        const search_type = SearchTypes.name
        const search_term = name_search_term
        let filters: Filter[] = []
        if (categories.length > 0) {
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

    getAllDiscounts(user_id: number, shop_id: number): string | string[] {
        return this._system.getAllDiscounts(user_id, shop_id);
    }

    getAllPurchasePolicies(user_id: number, shop_id: number): string | string[] {
        return this._system.getAllPurchasePolicies(user_id, shop_id)
    }

    removeDiscount(user_id: number, shop_id: number, id: number): string | boolean {
        return this._system.removeDiscount(user_id, shop_id, id)
    }

}