import {ShopInventory} from "./ShopInventory";
import {ShopManagement} from "./ShopManagement";
import {Product} from "../ProductHandling/Product";
import {Category} from "../ProductHandling/Category";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchaseType} from "../PurchaseProperties/PurchaseType";

export interface Shop {
    shop_id: number
    name: string
    description: string
    location: string
    bank_info: string
    inventory: ShopInventory
    management: ShopManagement

    getAllItems(): Product[]
    getInfo(): string //TODO shop info which we want to display to the user
    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[]
    filter(products: Product[], filter: any): Product[] //TODO change filter according to req 2.6
    addItem(user_ID, name: string, description:string, amount: number,
            categories: string[], base_price: number,
            discount_type?: DiscountType, purchase_type?: PurchaseType): boolean | string//TODO calls Shop managment to check permissions and shop inventory to add an item.
    removeItem(user_ID: number, product_id: number): boolean | string
    addPolicy(user_ID: number, purchase_policy?): boolean | string
    removePolicy(user_ID: number, purchase_policy?): boolean | string
    editPolicy(user_ID: number, purchase_policy?): boolean | string

}
