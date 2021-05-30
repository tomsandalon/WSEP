import {PurchaseType} from "../PurchaseProperties/PurchaseType";
import {ShopManagement} from "./ShopManagement";
import {DiscountPolicyHandler} from "../PurchaseProperties/DiscountPolicyHandler";
import {DiscountType} from "../PurchaseProperties/DiscountType";
import {PurchasePolicyHandler} from "../PurchaseProperties/PurchasePolicyHandler";
import {Product} from "../ProductHandling/Product";

export interface ShopInventory {
    shop_id: number //TODO remove if unused
    shop_management: ShopManagement
    products: Product[]
    purchase_policies: PurchasePolicyHandler
    discount_policies: DiscountPolicyHandler
    discount_types: DiscountType[]
}
