import {PurchaseType} from "../PurchaseProperties/PurchaseType";
import {ShopManagement} from "./ShopManagement";
import {DiscountPolicyHandler} from "../PurchaseProperties/DiscountPolicyHandler";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchasePolicyHandler} from "../PurchaseProperties/PurchasePolicyHandler";
import {Product} from "../ProductHandling/Product";
import {Order} from "../ProductHandling/Order";

export interface ShopInventory {
    shop_id: number //TODO remove if unused
    shop_management: ShopManagement
    products: Product[]
    purchase_policies: PurchasePolicyHandler
    discount_policies: DiscountPolicyHandler
    discount_types: DiscountType[]
    order: Order

    getAllItems(): Product[]
    search(name: string | undefined, category: string | undefined, keyword: string | undefined): Product[]
    purchaseItems()
    addItem(): boolean //TODO ADD PARAMETERS
    removeItem(): boolean //TODO ADD PARAMETERS
    getShopHistory(): string[]
}
