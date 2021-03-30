import {ShopInventory} from "./ShopInventory";
import {Manager} from "../ShopPersonnel/Manager";
import {Owner} from "../ShopPersonnel/Owner";

export interface ShopManagement {
    shop_id: number //TODO remove if unused
    shop_inventory: ShopInventory,
    original_owner: Owner
    owners: Owner[] // without original
    managers: Manager[]
}