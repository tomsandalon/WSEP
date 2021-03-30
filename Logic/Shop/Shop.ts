import {ShopInventory} from "./ShopInventory";
import {ShopManagement} from "./ShopManagement";

export interface Shop {
    shop_id: number
    name: string
    description: string
    location: string
    bank_info: string
    inventory: ShopInventory
    management: ShopManagement
}
