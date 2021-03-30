import {ShopInventory} from "./ShopInventory";
import {ShopManagement} from "./ShopManagement";
import {Product} from "../ProductHandling/Product";

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

}
