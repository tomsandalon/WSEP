import {SearchTypes, SystemImpl} from "../Domain/System";
import {Filter, Filter_Type, Purchase_Type} from "../Domain/Shop/ShopInventory";
import {Condition} from "../Domain/Shop/DiscountPolicy/ConditionalDiscount";
import {ConditionType} from "../Domain/Shop/PurchasePolicy/SimpleCondition";
import {Purchase_Info} from "../../ExternalApiAdapters/PaymentAndSupplyAdapter";
import * as db from "../Domain/DBCommand";

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

    public initData(resume?: boolean) {
        // if (resume) return;
        db.turnBlockDBON();
        const immediate: Purchase_Type = Purchase_Type.Immediate
        const offer: Purchase_Type = Purchase_Type.Offer
        SystemImpl.getInstance().performRegister("liorpev@gmail.com", "123456")
        SystemImpl.getInstance().performRegister("Mark@gmail.com", "123456")
        SystemImpl.getInstance().performRegister("TomAndSons@gmail.com", "123456") // Owner
        SystemImpl.getInstance().performRegister("Tomer@gmail.com", "123456") // Manager
        SystemImpl.getInstance().performRegister("a@gmail.com", "123456")
        SystemImpl.getInstance().performRegister("b@gmail.com", "123456")

        const tom_id = SystemImpl.getInstance().performLogin("TomAndSons@gmail.com", "123456")
        if (typeof tom_id === "string")
            return
        const nvidia_id = this.addShop(tom_id, "NVIDIA", "BEST GPU 4 Ever", 'Taiwan', "Taiwan 4 ever").toString()
        const zara_id = this.addShop(tom_id, "ZARA", "Best style in UK", 'China', "Budaa 4 ever").toString()
        this.addPurchaseType(tom_id, nvidia_id, Purchase_Type.Offer.toString())
        this.addProduct(tom_id, nvidia_id, "GTX 1060", "6GB RAM", "50", ["GPU"], String(1000), immediate.toString())
        this.addProduct(tom_id, nvidia_id, "RTX 3080", "Best performance", "10", ["GPU"], String(2000), offer.toString())
        this.addProduct(tom_id, nvidia_id, "RTX 2080", "Best power consumption", "0", ["GPU"], String(3000), offer.toString())
        this.addProduct(tom_id, nvidia_id, "GTX 280", "Innovative tech", "30", ["GPU"], String(4000), immediate.toString())
        this.addProduct(tom_id, nvidia_id, "GTX 980", "Economic power device", "10", ["GPU"], String(5000), immediate.toString())
        this.addDiscount(tom_id, nvidia_id, "0.5")
        this.addConditionToDiscount(tom_id, nvidia_id, "0", Condition.Amount.toString(), "3")
        this.addDiscount(tom_id, nvidia_id, "0.2")

        this.addPurchaseType(tom_id, zara_id, Purchase_Type.Offer.toString())
        this.addProduct(tom_id, zara_id, "Leather Jacket", "Leather from black mamba", "500", ["Winter", "Men"], "1000", offer.toString())
        this.addProduct(tom_id, zara_id, "Fur for lady", "From white fox", "400", ["Winter", "Evening"], "1000", immediate.toString())
        this.addProduct(tom_id, zara_id, "Lycra shirt", "made in Japan", "100", ["Evening", "Men"], "1000", immediate.toString())
        this.addProduct(tom_id, zara_id, "Boots", "made in USA", "70", ["Shoes"], "1000", immediate.toString())
        this.addProduct(tom_id, zara_id, "Shoes", "Made form plastic", "800", ["Shoes"], "1000", immediate.toString())

        const someone = SystemImpl.getInstance().performLogin("a@gmail.com", "123456") as number
        this.makeOffer(someone, nvidia_id, "1", "2", "3")

        this.addPurchasePolicy(tom_id, nvidia_id, ConditionType.GreaterAmount.toString(), "4")
        this.logout(tom_id);
        this.logout(someone)
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param id ID of the condition
     * @param condition String value of the enum {@link Condition}
     * @param condition_param Value for the condition
     */
    addConditionToDiscount(user_id: number, shop_id: string, id: string, condition: string, condition_param: string): string | boolean {
        return SystemImpl.getInstance().addConditionToDiscount(user_id, Number(shop_id), Number(id), Number(condition), condition_param);
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param value Value for the discount [0...1]
     */
    addDiscount(user_id: number, shop_id: string, value: string): string | boolean {
        return SystemImpl.getInstance().addDiscount(user_id, Number(shop_id), Number(value))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param operation String value of enum {@link LogicComposition}
     * @param d_id1 ID of the first discount
     * @param d_id2 ID of the second discount
     */
    addLogicComposeDiscount(user_id: number, shop_id: string, operation: string, d_id1: string, d_id2: string): string | boolean {
        return SystemImpl.getInstance().addLogicComposeDiscount(user_id, Number(shop_id), Number(operation), Number(d_id1), Number(d_id2))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param operation String value of enum {@link NumericOperation}
     * @param d_id1 ID of the first discount
     * @param d_id2 ID of the second discount
     */
    addNumericComposeDiscount(user_id: number, shop_id: string, operation: string, d_id1: string, d_id2: string): string | boolean {
        return SystemImpl.getInstance().addNumericComposeDiscount(user_id, Number(shop_id), Number(operation), Number(d_id1), Number(d_id2));
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param condition String value of enum {@link ConditionType}
     * @param value Value for the codntion
     */
    addPurchasePolicy(user_id: number, shop_id: string, condition: string, value: string): string[] | string {
        return SystemImpl.getInstance().addPurchasePolicy(user_id, Number(shop_id), Number(condition), value)
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param policy_id1 ID of the first policy
     * @param policy_id2 ID of the second policy
     * @param operator String value of enum {@link CompositeCondition.Operator}
     */
    composePurchasePolicy(user_id: number, shop_id: string, policy_id1: string, policy_id2: string, operator: string): boolean | string {
        return SystemImpl.getInstance().composePurchasePolicy(user_id, Number(shop_id), Number(policy_id1), Number(policy_id2), Number(operator))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param target_email Email of the target user
     */
    removeOwner(user_id: number, shop_id: string, target_email: string): string | boolean {
        return SystemImpl.getInstance().removeOwner(user_id, Number(shop_id), target_email)
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param policy_id ID of the policy
     */
    removePurchasePolicy(user_id: number, shop_id: string, policy_id: string): string | boolean {
        return SystemImpl.getInstance().removePurchasePolicy(user_id, Number(shop_id), Number(policy_id))
    }

    /**
     *
     * @param user_id ID of the user
     * @param product_id ID of the product
     * @param shop_id ID of the shop
     * @param amount The amount to add
     */
    addItemToBasket(user_id: number, product_id: string, shop_id: string, amount: string): string | void {
        return SystemImpl.getInstance().addItemToBasket(user_id, Number(product_id), Number(shop_id), Number(amount));
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param target_email Email of the target user
     * @param action String value of enum {@link Action}
     */
    addPermissions(user_id: number, shop_id: string, target_email: string, action: string): string | boolean {
        return SystemImpl.getInstance().addPermissions(user_id, Number(shop_id), target_email, Number(action))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param name Name of the product
     * @param description Description of the product
     * @param amount Initial amount for the product
     * @param categories A list of categories
     * @param base_price The base price of the product
     * @param purchase_type String value of enum {@link Purchase_Type}
     */
    addProduct(user_id: number, shop_id: string, name: string, description: string, amount: string, categories: string[], base_price: string, purchase_type?: string): boolean | string {
        return SystemImpl.getInstance().addProduct(user_id, Number(shop_id), name, description, Number(amount), categories, Number(base_price), purchase_type != undefined ? Number(purchase_type) : undefined)
    }

    /**
     *
     * @param user_id ID of the user
     * @param name Name of the shop
     * @param description Description of the shop
     * @param location The location of the shop
     * @param bank_info The bank info of the shop
     */
    addShop(user_id: number, name: string, description: string, location: string, bank_info: string): number | string {
        return SystemImpl.getInstance().addShop(user_id, name, description, location, bank_info)
    }

    adminDisplayShopHistory(admin: number, shop_id: string): string | string[] {
        return SystemImpl.getInstance().adminDisplayShopHistory(admin, Number(shop_id))
    }

    adminDisplayUserHistory(admin: number, target_id: string): string | string[] {
        return SystemImpl.getInstance().adminDisplayUserHistory(admin, Number(target_id))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param appointee_user_email Email of the appointee
     */
    appointManager(user_id: number, shop_id: string, appointee_user_email: string): string | boolean {
        return SystemImpl.getInstance().appointManager(user_id, Number(shop_id), appointee_user_email)
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param appointee_user_email Email of the appointee
     */
    appointOwner(user_id: number, shop_id: string, appointee_user_email: string): string | boolean {
        return SystemImpl.getInstance().appointOwner(user_id, Number(shop_id), appointee_user_email)
    }

    closeSession(user_id: number): void {
        return SystemImpl.getInstance().closeSession(user_id)
    }

    displayShoppingCart(user_id: number): string | string[][] {
        return SystemImpl.getInstance().displayShoppingCart(user_id)
    }

    displayShops(): string | string[] {
        return SystemImpl.getInstance().displayShops()
    }

    displayStaffInfo(user_id: number, shop_id: string): string[] | string {
        return SystemImpl.getInstance().displayStaffInfo(user_id, Number(shop_id))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param target_email Email of the target user
     * @param actions The actions to permit {@link Action}
     */
    editPermissions(user_id: number, shop_id: string, target_email: string, actions: string[]): string | boolean {
        return SystemImpl.getInstance().editPermissions(user_id, Number(shop_id), target_email, actions.map(a => Number(a)))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param product_id ID of the product
     * @param action The action to perform on the item {@link Item_Action}
     * @param value The value of the action to perform
     */
    editProduct(user_id: number, shop_id: string, product_id: string, action: string, value: string): string | boolean {
        return SystemImpl.getInstance().editProduct(user_id, Number(shop_id), Number(product_id), Number(action), value)
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param product_id ID of the product
     * @param amount The amount to set for the product in the basket
     */
    editShoppingCart(user_id: number, shop_id: string, product_id: string, amount: string): string | void {
        return SystemImpl.getInstance().editShoppingCart(user_id, Number(shop_id), Number(product_id), Number(amount))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param product_id ID of the product
     */
    removeItemFromBasket(user_id: number, shop_id: string, product_id: string): string | void {
        return SystemImpl.getInstance().editShoppingCart(user_id, Number(shop_id), Number(product_id), 0)
    }

    filterSearch(category_list: string, _min_price: string, _max_price: string,
                 rating: string, name_search_term: string): string[] {
        const min_price = Number(_min_price)
        const max_price = Number(_max_price)
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
        return SystemImpl.getInstance().filterSearch(search_type, search_term, filters)
    }

    getItemsFromShop(shop_id: string): any {
        return SystemImpl.getInstance().getItemsFromShop(Number(shop_id))
    }

    getShopInfo(shop_id: string): string | string[] {
        return SystemImpl.getInstance().getShopInfo(Number(shop_id));
    }

    /**
     *
     * @param user_id ID of the user
     */
    logout(user_id: number): string | boolean {
        return SystemImpl.getInstance().logout(user_id);
    }

    openSession(): number {
        return SystemImpl.getInstance().openSession()
    }

    performGuestLogin(): number {
        return SystemImpl.getInstance().performGuestLogin()
    }

    /**
     *
     * @param user_email Email of the user
     * @param password Password of the user
     */
    performLogin(user_email: string, password: string): string | number {
        return SystemImpl.getInstance().performLogin(user_email, password)
    }

    /**
     *
     * @param user_email Email of the user
     * @param password Password of the user
     * @param age Age of the user
     */
    performRegister(user_email: string, password: string, age: string): boolean {
        return SystemImpl.getInstance().performRegister(user_email, password, age == undefined || age.length == 0 || isNaN(Number(age)) ? undefined : Number(age))
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

    private static getPurchaseInfoOrString(payment_info): string | Purchase_Info {
        try {
            let info;
            if (typeof payment_info == "string") info = payment_info
            else info = JSON.stringify(info)
            const parsed_info: Purchase_Info = JSON.parse(info);
            // console.log("parsed info - ", parsed_info);
            if (Service.isValidPurchaseInfo(parsed_info)) return parsed_info
            return payment_info
        } catch (e) {
            console.log("error", e);
            return payment_info
        }
    }

    /**
     *
     * @param user_id ID of the user
     * @param payment_info Stringified JSON of the payment info of the user {@link Purchase_Info}
     */
    purchaseCart(user_id: number, payment_info: string): Promise<string | boolean> {
        return SystemImpl.getInstance().purchaseCart(user_id, Service.getPurchaseInfoOrString(payment_info))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param payment_info Stringified JSON of the payment info of the user {@link Purchase_Info}
     */
    purchaseShoppingBasket(user_id: number, shop_id: string, payment_info: string): Promise<string | boolean> {
        return SystemImpl.getInstance().purchaseShoppingBasket(user_id, Number(shop_id), Service.getPurchaseInfoOrString(payment_info))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param target Email of the target account
     */
    removeManager(user_id: number, shop_id: string, target: string): string | boolean {
        return SystemImpl.getInstance().removeManager(user_id, Number(shop_id), target)
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param product_id ID of the product
     */
    removeProduct(user_id: number, shop_id: string, product_id: string): boolean | string {
        return SystemImpl.getInstance().removeProduct(user_id, Number(shop_id), Number(product_id))
    }

    searchItemFromShops(search_type: number, search_term: string): any {
        return SystemImpl.getInstance().searchItemFromShops(Number(search_type), search_term)
    }

    shopOrderHistory(user_id: number, shop_id: string): string | string[] {
        return SystemImpl.getInstance().shopOrderHistory(user_id, Number(shop_id))
    }

    userOrderHistory(user_id: number): string | string[] {
        return SystemImpl.getInstance().userOrderHistory(user_id)
    }

    getAllDiscounts(user_id: number, shop_id: string): string | string[] {
        return SystemImpl.getInstance().getAllDiscounts(user_id, Number(shop_id));
    }

    getAllPurchasePolicies(user_id: number, shop_id: string): string | string[] {
        return SystemImpl.getInstance().getAllPurchasePolicies(user_id, Number(shop_id))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param id ID of the discount to remove
     */
    removeDiscount(user_id: number, shop_id: string, id: string): string | boolean {
        return SystemImpl.getInstance().removeDiscount(user_id, Number(shop_id), Number(id))
    }

    getAllShops(user_id: number): string | string[] {
        return SystemImpl.getInstance().getAllShops(user_id)
    }

    isAdmin(user_id: number): boolean {
        return (SystemImpl.getInstance().isAdmin(user_id) as boolean);
    }

    isManager(user_id: number): boolean {
        return (SystemImpl.getInstance().isManager(user_id) as boolean)
    }

    isOwner(user_id: number): boolean {
        return (SystemImpl.getInstance().isOwner(user_id) as boolean)
    }

    getAllUsers(user_id: number): string | string[] {
        return SystemImpl.getInstance().getAllUsers(user_id);
    }

    getManagingShops(user_id: number): string | string[] {
        return SystemImpl.getInstance().getManagingShops(user_id)
    }

    getPermissions(user_id: number, shop_id: string): string | string[] {
        return SystemImpl.getInstance().getPermissions(user_id, Number(shop_id))
    }

    isLoggedIn(user_id: number): boolean {
        return (SystemImpl.getInstance().isLoggedIn(user_id) as boolean)
    }

    getAllCategories(user_id: number): string | string [] {
        return SystemImpl.getInstance().getAllCategories(user_id)
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param product_id ID of the product
     * @param rating The rating for the product [0..5]
     */
    rateProduct(user_id: number, shop_id: string, product_id: string, rating: string): string | boolean {
        return SystemImpl.getInstance().rateProduct(user_id, Number(shop_id), Number(product_id), Number(rating))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param target_email Email of the target user
     * @param action The permission to remove {@link Action}
     */
    removePermission(user_id: number, shop_id: string, target_email: string, action: string): string | boolean {
        return SystemImpl.getInstance().removePermission(user_id, Number(shop_id), target_email, Number(action))
    }

    //string is bad, string[] is good and the answer is at [0]
    getUserEmailFromUserId(user_id: number): string | string[] {
        return SystemImpl.getInstance().getUserEmailFromUserId(user_id);
    }

    isAvailable(): boolean {
        return true
    }

    connectToDB() {

    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param product_id ID of the product
     * @param amount The amount to purchase
     * @param price_per_unit The price for each unit
     */
    makeOffer(user_id: number, shop_id: string, product_id: string, amount: string, price_per_unit: string): string | boolean {
        return SystemImpl.getInstance().makeOffer(user_id, Number(shop_id), Number(product_id), Number(amount), Number(price_per_unit))
    }

    getActiveOffersAsUser(user_id: number): string | string[] {
        return SystemImpl.getInstance().getActiveOffersAsUser(user_id)
    }

    getActiveOfferForShop(user_id: number, shop_id: string): string | string[] {
        return SystemImpl.getInstance().getActiveOfferForShop(user_id, Number(shop_id))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param offer_id The ID of the offer
     */
    acceptOfferAsManagement(user_id: number, shop_id: string, offer_id: string): string | boolean {
        return SystemImpl.getInstance().acceptOfferAsManagement(user_id, Number(shop_id), Number(offer_id))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param offer_id The ID of the offer
     */
    denyOfferAsManagement(user_id: number, shop_id: string, offer_id: string): string | boolean {
        return SystemImpl.getInstance().denyOfferAsManagement(user_id, Number(shop_id), Number(offer_id))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param offer_id The ID of the offer
     * @param new_price_per_unit The new price per unit to offer
     */
    counterOfferAsManager(user_id: number, shop_id: string, offer_id: string, new_price_per_unit: string): string | boolean {
        return SystemImpl.getInstance().counterOfferAsManager(user_id, Number(shop_id), Number(offer_id), Number(new_price_per_unit))
    }

    /**
     *
     * @param user_id ID of the user
     * @param offer_id The ID of the offer
     */
    denyCounterOfferAsUser(user_id: number, offer_id: string): string | boolean {
        return SystemImpl.getInstance().denyCounterOfferAsUser(user_id, Number(offer_id))
    }

    offerIsPurchasable(user_id: number, shop_id: string, offer_id: string): string | boolean {
        return SystemImpl.getInstance().offerIsPurchasable(user_id, Number(shop_id), Number(offer_id))
    }

    /**
     *
     * @param user_id ID of the user
     * @param offer_id The ID of the offer
     * @param payment_info Stringified JSON of the payment info of the user {@link Purchase_Info}
     */
    purchaseOffer(user_id: number, offer_id: string, payment_info: string): Promise<string | boolean> {
        return SystemImpl.getInstance().purchaseOffer(user_id, Number(offer_id), Service.getPurchaseInfoOrString(payment_info))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param purchase_type The purchase type to remove {@link Purchase_Type}
     */
    removePurchaseType(user_id: number, shop_id: string, purchase_type: string): string | boolean {
        return SystemImpl.getInstance().removePurchaseType(user_id, Number(shop_id), Number(purchase_type))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param purchase_type The purchase type to add {@link Purchase_Type}
     */
    addPurchaseType(user_id: number, shop_id: string, purchase_type: string): string | boolean {
        return SystemImpl.getInstance().addPurchaseType(user_id, Number(shop_id), Number(purchase_type))
    }

    /**
     *
     * @param user_id ID of the user
     * @param shop_id ID of the shop
     * @param offer_id The ID of the offer
     * @param new_price_per_unit The new price per unit to offer
     */
    counterOfferAsUser(user_id: number, shop_id: string, offer_id: string, new_price_per_unit: string): string | boolean {
        return SystemImpl.getInstance().counterOfferAsUser(user_id, Number(shop_id), Number(offer_id), Number(new_price_per_unit))
    }

    getAllShopsInSystem(): string | string[] {
        return SystemImpl.getInstance().getAllShopsInSystem()
    }

    getPurchaseTypesOfShop(shop_id: string): number[] | string {
        return SystemImpl.getInstance().getPurchaseTypesOfShop(Number(shop_id))
    }
}