import {Filter, Item_Action} from "../../Logic/Shop/ShopInventory";
import {DiscountType} from "../../Logic/PurchaseProperties/DiscountType";
import {PurchaseType} from "../../Logic/PurchaseProperties/PurchaseType";
import {Action} from "../../Logic/ShopPersonnel/Permissions";
import {SearchTypes} from "../../Logic/System";

export interface System{
    openSession(): void //TODO add guest to the system.
    closeSession(): void //TODO remove quest from system, if use logout.
    displayMenu():void // TODO UI JUST FOR US
    performRegister(user_email:string, password: string): boolean
    performLogin(user_email:string, password: string): string | number
    performGuestLogin():number
    logout(user_email: string): void //TODO after logout switch to guest, openSession? //lior
    displayShops():any
    getItemsFromShop(shop_id:number): any
    searchItemFromShops(search_type:SearchTypes, search_term: string):any
    filterSearch(search_type:SearchTypes, search_term: string, filters:Filter[]):string[]
    addItemToBasket(user_id:number, product_id: number, shop_id:number, amount:number):string | void
    displayShoppingCart(user_id:number): string | string[][]
    editShoppingCart(user_id:number, shop_id:number, product_id:number, amount:number):string | void
    purchaseShoppingBasket(user_id: number, shop_id: number, payment_info:string):string | boolean
    purchaseCart(user_id: number, payment_info:string):string | boolean
    addShop(user_id: number, name: string, description: string,
            location: string, bank_info:string): number | string
    UserOrderHistory(user_id: number):string | string[]
    addProduct(user_id: number, shop_id: number, name: string, description: string, amount: number, categories: string[],
               base_price: number, discount_type: DiscountType, purchase_type: PurchaseType): boolean | string
    removeProduct(user_id: number, shop_id: number, product_id: number): boolean | string
    appointManager(user_id:number,shop_id:number, appointee_user_email:string): string | boolean
    appointOwner(user_id:number,shop_id:number, appointee_user_email:string): string | boolean
    addPermissions(user_id:number, shop_id:number, target_email:string,action:Action): string | boolean
    editPermissions(user_id:number, shop_id:number, target_email:string,actions:Action[]): string | boolean
    displayStaffInfo(user_id:number,shop_id:number): string[] | string
    shopOrderHistory(user_id:number,shop_id:number): string | string[]
    adminDisplayShopHistory(user_id:number, shop_id: number): string | string[]
    adminDisplayUserHistory(user_id:number):any
    editUserDetails(user_id: number, action: any, value: any): string | boolean
    editProduct(user_id: number, shop_id: number, product_id: number, action: Item_Action, value: string): string | boolean
}

export const TestNotAssociatedWithImplementation = "Test not associated with implementation";