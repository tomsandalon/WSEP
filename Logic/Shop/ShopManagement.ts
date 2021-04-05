import {ShopInventory} from "./ShopInventory";
import {Manager} from "../ShopPersonnel/Manager";
import {Owner} from "../ShopPersonnel/Owner";

export interface ShopManagement {
    shop_id: number //TODO remove if unused
    shop_inventory: ShopInventory,
    original_owner: Owner
    owners: Owner[] // without original
    managers: Manager[]

    allowedAddItemToShop(user_ID: number): boolean
    allowedRemoveItemFromShop(user_ID: number): boolean
    allowedManagePolicies(user_ID: number): boolean
    appointNewOwner(appointier_ID: number, apointee_ID: number): boolean
    appointNewManager(appointier_ID: number, apointee_ID: number): boolean
    editPermissions(appointier_ID: number, apointee_ID: number, permissions: string[]): boolean
    addPermissions(appointier_ID: number, apointee_ID: number, permissions: string[]): boolean
    removeManager(appointier_ID: number, apointee_ID: number): boolean
    getStaffInfo(user_ID:number, staff_id?: number[]): string[]
    allowedToViewShopHistory(user_ID: number): boolean

}